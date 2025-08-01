// import type { Transaction } from "@/types/transactions";
// import type { Client } from "@/types/types";

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

import type { Transaction } from "@/types/transactions";
import type { Client } from "@/types/types";

export const mergeTransactionsWithClients = (
  transactions: Transaction[],
  clients: Client[]
): Transaction[] => {
  return transactions.map((txn) => {
    // For payment transactions, we might not have clientId
    const client = clients.find(
      (c) => c._id === txn.clientId?._id || c._id === txn.client?._id
    );

    // Handle payment transactions
    if (txn.type === "DEPOSIT") {
      return {
        ...txn,
        client: client || null,
        items: txn.items || [],
        subtotal: txn.subtotal || txn.amount || 0,
        total: txn.total || txn.amount || 0,
        amountPaid: txn.amountPaid || txn.amount || 0,
        discount: txn.discount || 0,
      };
    }

    return {
      ...txn,
      client: client || null,
    };
  });
};
