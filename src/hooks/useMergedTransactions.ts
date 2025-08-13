import { useMemo } from "react";
import { useClientStore } from "@/stores/useClientStore";
import { useBranchStore } from "@/stores/useBranchStore";

import type { Transaction } from "@/types/transactions";

export function useMergedTransactions(transactions: Transaction[]) {
  const { getClientById } = useClientStore();
  const { branches } = useBranchStore();

  const mergedTransactions = useMemo(() => {
    return (transactions ?? []).map((transaction) => {
      const clientId =
        typeof transaction.clientId === "string"
          ? transaction.clientId
          : transaction.clientId?._id;

      // get client by id
      const client = clientId ? getClientById(clientId) : null;

      // get branch
      const branchId =
        typeof transaction.branchId === "string"
          ? transaction.branchId
          : transaction.branchId;
      const branch = branchId ? branches.find((b) => b._id === branchId) : null;

      return {
        ...transaction,
        client,
        branchName: branch?.name ?? "Unknown",
      };
    });
  }, [transactions, getClientById, branches]);

  return mergedTransactions;
}
