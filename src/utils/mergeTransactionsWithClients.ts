import type { Transaction } from "@/types/transactions";
import type { Client } from "@/types/types";

// export function mergeTransactionsWithClients(
//   transactions: Transaction[],
//   clients: Client[]
// ) {
//   return transactions.map((transaction) => {
//     const clientId =
//       typeof transaction.clientId === "string"
//         ? transaction.clientId
//         : transaction.clientId?._id;

//     const client = clients.find((c) => c._id === clientId) ?? null;

//     return {
//       ...transaction,
//       client,
//     };
//   });
// }

export function mergeTransactionsWithClients(
  transactions: Transaction[] = [],
  getClient: ((id: string) => Client | null) | Client[] = []
) {
  return transactions.map((transaction) => {
    const clientId =
      typeof transaction.clientId === "string"
        ? transaction.clientId
        : transaction.clientId?._id;

    let client: Client | null = null;

    if (typeof getClient === "function") {
      client = getClient(clientId);
    } else if (Array.isArray(getClient)) {
      client = getClient.find((c) => c._id === clientId) ?? null;
    }

    return {
      ...transaction,
      client,
    };
  });
}
