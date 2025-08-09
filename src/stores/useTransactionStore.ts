import { create } from "zustand";
import { toSentenceCaseName } from "@/utils/styles";
import type { Transaction } from "@/types/transactions";

type TransactionState = {
  transactions: Transaction[] | null;
  selectedTransaction: Transaction | null;
  open: boolean;

  setTransactions: (transactions: Transaction[]) => void;
  addTransaction: (transactions: Transaction) => void;
  openModal: (transaction: Transaction) => void;
  closeModal: () => void;
  getTodaysSales: () => number;
  getYesterdaysSales: () => number;
  getSalesPercentageChange: () => {
    percentage: number;
    direction: "increase" | "decrease" | "no-change";
  };
};

export const useTransactionsStore = create<TransactionState>((set, get) => ({
  transactions: [],
  selectedTransaction: null,
  open: false,

  setTransactions: (transactions) =>
    set({
      transactions: transactions.map((txn) => {
        // Ensure all payment transactions have required properties
        if (txn.type === "DEPOSIT") {
          return {
            ...txn,
            items: txn.items || [], // Ensure items exists
            subtotal: txn.subtotal || txn.amount || 0,
            total: txn.total || txn.amount || 0,
            amountPaid: txn.amountPaid || txn.amount || 0,
            discount: txn.discount || 0,
            walkInClientName: txn.walkInClient?.name
              ? toSentenceCaseName(txn.walkInClient.name)
              : undefined,
            clientName: txn.clientId?.name
              ? toSentenceCaseName(txn.clientId.name)
              : txn.client?.name
              ? toSentenceCaseName(txn.client.name)
              : undefined,
          };
        }

        return {
          ...txn,
          walkInClientName: txn.walkInClient?.name
            ? toSentenceCaseName(txn.walkInClient.name)
            : undefined,
          clientName: txn.clientId?.name
            ? toSentenceCaseName(txn.clientId.name)
            : undefined,
        };
      }),
    }),

  addTransaction: (transaction) =>
    set((state) => ({
      transactions: state.transactions
        ? [
            ...state.transactions,
            {
              ...transaction,
              walkInClientName: transaction.walkInClient?.name
                ? toSentenceCaseName(transaction.walkInClient.name)
                : undefined,
              clientName: transaction.clientId?.name
                ? toSentenceCaseName(transaction.clientId.name)
                : transaction.client?.name
                ? toSentenceCaseName(transaction.client.name)
                : undefined,
            },
          ]
        : [transaction],
    })),

  openModal: (transaction) =>
    set({ open: true, selectedTransaction: transaction }),
  closeModal: () => set({ open: false, selectedTransaction: null }),

  getTodaysSales: () => {
    const { transactions } = get();
    if (!transactions) return 0;

    const today = new Date().toDateString();

    return transactions
      .filter((t) => {
        const transactionDate = new Date(t.createdAt).toDateString();
        return t.type === "DEPOSIT" && transactionDate === today;
      })
      .reduce((total, t) => {
        // Handle multiple possible amount fields with fallbacks
        const amount = t.amount ?? t.total ?? t.amountPaid ?? 0;
        return total + amount;
      }, 0);
  },

  getYesterdaysSales: () => {
    const { transactions } = get();
    if (!transactions) return 0;

    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();

    return transactions
      .filter((t) => {
        const transactionDate = new Date(t.createdAt).toDateString();
        return t.type === "DEPOSIT" && transactionDate === yesterday;
      })
      .reduce((total, t) => {
        // Handle multiple possible amount fields with fallbacks
        const amount = t.amount ?? t.total ?? t.amountPaid ?? 0;
        return total + amount;
      }, 0);
  },

  // Calculate percentage change in sales

  getSalesPercentageChange: () => {
    const todaysSales = get().getTodaysSales();
    const yesterdaysSales = get().getYesterdaysSales();
    if (yesterdaysSales === 0 && todaysSales === 0) {
      return { percentage: 0, direction: "no-change" };
    }
    if (yesterdaysSales === 0 && todaysSales > 0) {
      return { percentage: 100, direction: "increase" as const };
    }
    if (yesterdaysSales > 0 && todaysSales === 0) {
      return { percentage: -100, direction: "decrease" as const };
    }

    const percentageChange =
      ((todaysSales - yesterdaysSales) / yesterdaysSales) * 100;
    return {
      percentage: Math.abs(percentageChange * 100) / 100,
      direction:
        percentageChange > 0
          ? "increase"
          : percentageChange < 0
          ? "decrease"
          : "no-change",
    };
  },
}));
