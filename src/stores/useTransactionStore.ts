import { create } from "zustand";
// import { persist } from "zustand/middleware";
import { toSentenceCaseName } from "@/utils/format";
import type { Transaction } from "@/types/transactions";

type TransactionState = {
  transactions: Transaction[] | null;
  selectedTransaction: Transaction | null;
  open: boolean;

  setTransactions: (transactions: Transaction[]) => void;
  openModal: (transaction: Transaction) => void;
  closeModal: () => void;
};

export const useTransactionsStore = create<TransactionState>((set) => ({
  transactions: [],
  selectedTransaction: null,
  open: false,

  setTransactions: (transactions) =>
    set({
      transactions: transactions.map((txn) => ({
        ...txn,
        walkInClientName: txn.walkInClient?.name
          ? toSentenceCaseName(txn.walkInClient.name)
          : undefined,
        clientName: txn.clientId?.name
          ? toSentenceCaseName(txn.clientId.name)
          : undefined,
      })),
    }),

  openModal: (transaction) =>
    set({ open: true, selectedTransaction: transaction }),
  closeModal: () => set({ open: false, selectedTransaction: null }),
}));
