import type { Transaction } from "@/types/transactions";
import type { Client } from "@/types/types";

export function calculateTransactionsWithBalance(
  transactions: Transaction[],
  client: Pick<Client, "balance">
) {
  if (!transactions?.length) {
    // If no transactions, return empty array
    return [];
  }

  // Ensure oldest → newest
  const sorted = [...transactions].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  // Calculate the initial balance by working backwards from current balance
  // Current balance = initial balance + all transaction effects
  let initialBalance = client.balance;

  // Work backwards through transactions to find the starting balance
  for (let i = sorted.length - 1; i >= 0; i--) {
    const txn = sorted[i];

    if (txn.type === "DEPOSIT") {
      // If deposit increased balance, subtract it to go back
      initialBalance -= txn.amount ?? txn.amountPaid ?? txn.total ?? 0;
    } else {
      // If purchase/pickup decreased balance, add it back
      const total = txn.total ?? 0;
      const paid = txn.amountPaid ?? 0;
      const outstanding = total - paid;
      initialBalance += outstanding;
    }
  }

  // Now calculate forward with the correct initial balance
  let runningBalance = initialBalance;

  return sorted.map((txn) => {
    const balanceBefore = runningBalance;

    if (txn.type === "DEPOSIT") {
      // Deposits reduce debt (increase balance)
      runningBalance =
        balanceBefore + (txn.amount ?? txn.amountPaid ?? txn.total ?? 0);
    } else {
      // Purchases/Pickups increase debt (decrease balance)
      const total = txn.total ?? 0;
      const paid = txn.amountPaid ?? 0;
      const outstanding = total - paid;

      runningBalance = balanceBefore - outstanding;
    }

    return {
      ...txn,
      balanceBefore,
      balanceAfter: runningBalance,
    };
  });
}
