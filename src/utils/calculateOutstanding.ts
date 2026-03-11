import type { Transaction } from "@/types/transactions";
import type { Client } from "@/types/types";

export interface TransactionWithBalance extends Transaction {
  loading: number;
  loadingAndOffloading: number;
  transportFare: number;
  balanceBefore: number;
  balanceAfter: number;
}

export function calculateTransactionsWithBalance(
  transactions: Transaction[],
  client: Pick<Client, "balance">
): TransactionWithBalance[] {
  if (!transactions?.length) {
    // If no transactions, return empty array
    return [];
  }

  // Use snapshot-based approach: each transaction already stores the correct balance after
  // No need to sort since we're using snapshots - preserve the caller's desired order
  return transactions.map((txn) => {
    // Use the snapshot stored in the transaction
    const balanceAfter = txn.clientBalanceAfterTransaction ?? client.balance;

    // Calculate balanceBefore by reversing the transaction effect
    let balanceBefore: number;

    if (txn.type === "RETURN") {
      // Returns credit the client balance
      // Before return: balance was lower (more debt or less credit)
      const returnAmount = txn.actualAmountReturned ?? txn.total ?? 0;
      balanceBefore = balanceAfter - returnAmount;
    } else if (txn.type === "DEPOSIT") {
      // Deposits reduce debt (increase balance)
      // Before deposit: balance was lower
      const depositAmount = txn.amountPaid ?? txn.amount ?? txn.total ?? 0;
      balanceBefore = balanceAfter - depositAmount;
    } else {
      // Purchases/Pickups/Wholesale increase debt (decrease balance)
      // Before purchase: balance was higher
      const total = txn.total ?? 0;
      const paid = txn.amountPaid ?? 0;
      const outstanding = total - paid;

      balanceBefore = balanceAfter + outstanding;
    }

    return {
      ...txn,
      loading: txn.loading ?? 0,
      loadingAndOffloading: txn.loadingAndOffloading ?? 0,
      transportFare: txn.transportFare ?? 0,
      balanceBefore,
      balanceAfter,
    };
  });
}
