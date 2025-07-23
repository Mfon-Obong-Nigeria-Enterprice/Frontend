import { create } from "zustand";
// import { persist } from "zustand/middleware";
import type { Transaction } from "@/types/transactions";

type TransactionState = {
  transactions: Transaction[];
  setTransactions: (transactions: Transaction[]) => void;
};

export const useTransactionsStore = create<TransactionState>((set) => ({
  transactions: [],

  setTransactions: (transactions) => set({ transactions }),
}));
