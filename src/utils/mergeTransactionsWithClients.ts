import type { Transaction } from "@/types/transactions";
import type { Client } from "@/types/types";

export function mergeTransactionsWithClients(
  transactions: Transaction[],
  clients: Client[]
) {
  return transactions.map((transaction) => {
    const clientId =
      typeof transaction.clientId === "string"
        ? transaction.clientId
        : transaction.clientId?._id;

    const client = clients.find((c) => c._id === clientId) ?? null;

    return {
      ...transaction,
      client,
    };
  });
}

