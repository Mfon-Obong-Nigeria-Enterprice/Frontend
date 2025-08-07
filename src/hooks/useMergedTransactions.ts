import { useMemo } from "react";
import { useClientStore } from "@/stores/useClientStore";
import type { Transaction } from "@/types/transactions";

export function useMergedTransactions(transactions: Transaction[]) {
  const { getClientById } = useClientStore();

  const mergedTransactions = useMemo(() => {
    return (transactions ?? []).map((transaction) => {
      const clientId =
        typeof transaction.clientId === "string"
          ? transaction.clientId
          : transaction.clientId?._id;

      const client = clientId ? getClientById(clientId) : null;

      return {
        ...transaction,
        client,
      };
    });
  }, [transactions, getClientById]);

  return mergedTransactions;
}
