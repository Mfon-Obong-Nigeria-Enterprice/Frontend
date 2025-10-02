import type { Transaction } from "@/types/transactions";

export function calculateTransactionsWithBalance(
  transactions: Transaction[],
  startingBalance: number = 0
) {
  if (!transactions?.length) return [];

  // Ensure oldest → newest
  const sorted = [...transactions].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  let runningBalance = startingBalance;

  return sorted.map((txn) => {
    const balanceBefore = runningBalance;

    if (txn.type === "DEPOSIT") {
      // Deposits reduce debt
      runningBalance =
        balanceBefore + (txn.amount ?? txn.amountPaid ?? txn.total ?? 0);
    } else {
      // Purchases/Pickups → debt = total - amountPaid
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

//  if (!clientTransactions?.length) {
//       return [];
//     }

//     // Sort transactions by date (oldest first for proper balance calculation)
//     const sortedTransactions = [...clientTransactions].sort(
//       (a, b) =>
//         new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
//     );

//     // Start with initial balance of 0 (assuming clients start with no debt)
//     let runningBalance = 0;

//     const transactions = sortedTransactions.map((txn) => {
//       const balanceBefore = runningBalance;
//       let balanceAfter = balanceBefore;

//       if (txn.type === "DEPOSIT") {
//         // Deposit reduces the debt (increases the balance toward zero)
//         runningBalance =
//           balanceBefore + (txn.amount ?? txn.amountPaid ?? txn.total ?? 0);
//       } else {
//         // Purchase/Pickup increases debt by the outstanding amount

//         balanceAfter = txn.client?.balance ?? 0;
//         console.log("balance after", balanceAfter);
//         // balanceAfter = balanceBefore - outstandingAmount;
//       }

//       runningBalance = balanceAfter;

//       return {
//         ...txn,
//         balanceBefore,
//         balanceAfter,
//       };
//     });
//     console.log("deposit det", transactions);

//     // Return in reverse order (newest first for display)
//     return transactions.reverse();
// import type { Client } from "@/types/types";

// // Calculate balance from client.transactions using total and amountPaid
// export const calculateClientBalance = (client: Client) => {
//   if (!client.transactions || client.transactions.length === 0) {
//     return 0;
//   }

//   let balance = 0;

//   client.transactions.forEach((txn) => {
//     if (txn.type === "DEPOSIT") {
//       // Deposit reduces debt
//       balance += txn.amountPaid || 0;
//     } else {
//       // PURCHASE/PICKUP increases debt by outstanding amount
//       const outstanding = (txn.total || 0) - (txn.amountPaid || 0);
//       balance -= outstanding;
//     }
//   });

//   return balance;
// };

// import type { Client } from "@/types/types";

// type OutstandingSummary = {
//   totalOutstanding: number;
//   debtorCount: number;
//   debtors: Client[];
// };

// type OutstandingChange = OutstandingSummary & {
//   changePercent: number;
//   increase: boolean;
// };

// export function isValidBalance(balance: unknown): balance is number {
//   return typeof balance === "number" && !isNaN(balance);
// }

// export function calculateOutstandingBalance(
//   clients: Client[]
// ): OutstandingSummary {
//   const debtors = clients.filter(
//     (client) => isValidBalance(client.balance) && client.balance < 0
//   );

//   const totalOutstanding = debtors.reduce((sum, client) => {
//     return sum + (isValidBalance(client.balance) ? client.balance : 0);
//   }, 0);

//   return {
//     totalOutstanding: Math.abs(totalOutstanding),
//     debtorCount: debtors.length,
//     debtors,
//   };
// }

// export function calculateOutstandingChange(
//   currentClients: Client[],
//   previousClients: Client[]
// ): OutstandingChange {
//   const current = calculateOutstandingBalance(currentClients);
//   const previous = calculateOutstandingBalance(previousClients);

//   const { totalOutstanding: currentTotal } = current;
//   const { totalOutstanding: previousTotal } = previous;

//   const change =
//     previousTotal === 0
//       ? currentTotal === 0
//         ? 0
//         : 100
//       : ((currentTotal - previousTotal) / previousTotal) * 100;

//   return {
//     ...current,
//     changePercent: Math.round(change),
//     increase: change > 0,
//   };
// }
