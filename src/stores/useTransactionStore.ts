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
};

export const useTransactionsStore = create<TransactionState>((set) => ({
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
                : undefined,
            },
          ]
        : [transaction],
    })),

  openModal: (transaction) =>
    set({ open: true, selectedTransaction: transaction }),
  closeModal: () => set({ open: false, selectedTransaction: null }),
}));
