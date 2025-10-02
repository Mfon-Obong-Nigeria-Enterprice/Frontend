import type { Transaction, MergedTransaction } from "@/types/transactions";
import type { Client } from "@/types/types";

export const mergeTransactionsWithClients = (
  transactions: Transaction[],
  getClientById: (id: string) => Client | null
) => {
  return transactions.map((transaction) => {
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
};

// Prefer backend-provided date over createdAt when present
export const getTransactionDate = (tx: Partial<Transaction>): Date => {
  const raw = (tx as any)?.date ?? tx.createdAt;
  if (!raw) return new Date();
  const parsed = new Date(raw as string);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
};

export const getTransactionDateString = (
  tx: Partial<Transaction>,
  locale: string = undefined
): string => {
  const d = getTransactionDate(tx);
  return d.toLocaleDateString(locale);
};

export const getTransactionTimeString = (
  tx: Partial<Transaction>,
  locale: string = undefined
): string => {
  const d = getTransactionDate(tx);
  return d.toLocaleTimeString(locale);
};

export function getClientsWithDebt(mergedTransaction: MergedTransaction[]) {
  const clientMap: Record<string, { client: Client; _id: string; createdAt: string }> = {};

  mergedTransaction.forEach((tx) => {
    const client = tx.client;
    if (!client) return; // Skip walk-in clients

    const clientId = client._id;

    // Only store the first occurrence (for createdAt)
    if (!clientMap[clientId]) {
      clientMap[clientId] = {
        client,
        _id: clientId,
        createdAt: tx.createdAt,
      };
    }
  });

  // Filter clients with negative balance (they owe money) and map to output
  return Object.values(clientMap)
    .filter(({ client }) => client.balance < 0)
    .map(({ client, _id, createdAt }) => ({
      name: client.name,
      _id,
      balance: client.balance,
      createdAt,
    }));
}

export function getTopSellingProducts(
  transactions: Transaction[],
  topN = 5
): {
  productId: string;
  productName: string;
  quantitySold: number;
  totalRevenue: number;
}[] {
  const productSalesMap: Record<
    string,
    {
      productId: string;
      productName: string;
      quantitySold: number;
      totalRevenue: number;
    }
  > = {};

  transactions.forEach((tx) => {
    tx.items.forEach((item) => {
      const id = item.productId;
      if (!productSalesMap[id]) {
        productSalesMap[id] = {
          productId: id,
          productName: item.productName,
          quantitySold: 0,
          totalRevenue: 0,
        };
      }
      productSalesMap[id].quantitySold += item.quantity;
      productSalesMap[id].totalRevenue += item.subtotal;
    });
  });

  return Object.values(productSalesMap)
    .sort((a, b) => b.quantitySold - a.quantitySold)
    .slice(0, topN);
}

// export function getTopSellingProducts(transactions: Transaction[], topN = 5) {
//   const productSalesMap = {};

//   transactions.forEach((tx) => {
//     tx.items.forEach((item) => {
//       const id = item.productId;
//       if (!productSalesMap[id]) {
//         productSalesMap[id] = {
//           productId: id,
//           productName: item.productName,
//           quantitySold: 0,
//           totalRevenue: 0,
//         };
//       }
//       productSalesMap[id].quantitySold += item.quantity;
//       productSalesMap[id].totalRevenue += item.subtotal;
//     });
//   });

//   return Object.values(productSalesMap)
//     .sort((a, b) => b.quantitySold - a.quantitySold)
//     .slice(0, topN);
// }
