import type { Client } from "@/types/types";

// Calculate balance from client.transactions using total and amountPaid
export const calculateClientBalance = (client: Client) => {
  if (!client.transactions || client.transactions.length === 0) {
    return 0;
  }

  let balance = 0;

  client.transactions.forEach((txn) => {
    if (txn.type === "DEPOSIT") {
      // Deposit reduces debt
      balance += txn.amountPaid || 0;
    } else {
      // PURCHASE/PICKUP increases debt by outstanding amount
      const outstanding = (txn.total || 0) - (txn.amountPaid || 0);
      balance -= outstanding;
    }
  });

  return balance;
};

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
