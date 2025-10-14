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
// export const getTransactionDate = (tx: Partial<Transaction>): Date => {
//   const raw = (tx as any)?.date ?? tx.createdAt;
//   // if (!raw) return new Date(); // fallback to now
//   // return new Date(raw);
//   try {
//     return new Date(raw as string);
//   } catch {
//     return new Date();
//   }
// };
// Prefer backend-provided date over createdAt when present
// export const getTransactionDate = (tx: Partial<Transaction>): Date => {
//   const raw = (tx as any)?.date ?? tx.createdAt;

//   if (!raw) {
//     return new Date(); // fallback if no date
//   }

//   const d = new Date(raw as string);

//   // Check if the parsed date is valid
//   if (isNaN(d.getTime())) {
//     return new Date(); // fallback to now
//   }

//   return d;
// };

// export const getTransactionDateString = (
//   tx: Partial<Transaction>,
//   locale: string = "en-GB"
// ): string => {
//   const d = getTransactionDate(tx);
//   return d.toLocaleDateString(locale);
// };

// export const getTransactionTimeString = (
//   tx: Partial<Transaction>,
//   locale: string = "en-GB"
// ): string => {
//   const d = getTransactionDate(tx);
//   return d.toLocaleTimeString(locale);
// };

// Enhanced transaction time utilities

// Get transaction date from either createdAt or saleDate
export const getTransactionDate = (tx: Partial<Transaction>): Date => {
  // Priority: saleDate > createdAt > current date
  const dateString = tx.createdAt;

  if (dateString) {
    return new Date(dateString);
  }

  return new Date(); // Fallback to current date
};

// Format time with date context for better clarity
export const getTransactionTimeString = (
  tx: Partial<Transaction>,
  locale: string = "en-GB"
): string => {
  const date = getTransactionDate(tx);

  // Format time
  const timeString = date.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return ` ${timeString}`;
};

// Alternative: Simple date + time format
export const getTransactionDateString = (
  tx: Partial<Transaction>,
  locale: string = "en-GB"
): string => {
  const date = getTransactionDate(tx);

  return date.toLocaleDateString(locale);
};

export function getClientsWithDebt(mergedTransaction: MergedTransaction[]) {
  const clientMap: Record<
    string,
    { client: Client; _id: string; createdAt: string }
  > = {};

  mergedTransaction.forEach((tx) => {
    const client = tx.client;

    if (!client) return; // Skip walk-in clients

    const clientId = client._id;

    // Assuming 'total' is what they should pay, and 'amountPaid' is what they paid
    // const amountOwed = tx.total - tx.amountPaid;

    // Only store the first occurrence (for createdAt)
    if (!clientMap[clientId]) {
      clientMap[clientId] = {
        client,
        _id: clientId,
        createdAt: tx.createdAt, // use the first transaction's date
      };
    }
  });

  // Filter clients with balance < 0 (i.e., they owe money)
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
