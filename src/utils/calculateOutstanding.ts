import type { Transaction } from "@/types/transactions";
import type { Client } from "@/types/types";

export function calculateTransactionsWithBalance(
  transactions: Transaction[],
  client: Pick<Client, "balance"> // Accept an object with a balance property
) {
  if (!transactions?.length) return [];

  // Ensure oldest → newest
  const sorted = [...transactions].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  // Use the client's balance as the starting point
  let runningBalance = client.balance || 0;

  return sorted.map((txn) => {
    const balanceBefore = runningBalance;

    if (txn.type === "DEPOSIT") {
      // Deposits reduce debt (increase balance)
      runningBalance =
        balanceBefore + (txn.amount ?? txn.amountPaid ?? txn.total ?? 0);
    } else {
      // Purchases/Pickups increase debt (decrease balance)
      // Outstanding = total - amountPaid
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
