import type { Client } from "@/types/types";

type OutstandingSummary = {
  totalOutstanding: number;
  debtorCount: number;
  debtors: Client[];
};

type OutstandingChange = OutstandingSummary & {
  changePercent: number;
  increase: boolean;
};

export function isValidBalance(balance: unknown): balance is number {
  return typeof balance === "number" && !isNaN(balance);
}

export function calculateOutstandingBalance(
  clients: Client[]
): OutstandingSummary {
  const debtors = clients.filter(
    (client) => isValidBalance(client.balance) && client.balance < 0
  );

  const totalOutstanding = debtors.reduce((sum, client) => {
    return sum + (isValidBalance(client.balance) ? client.balance : 0);
  }, 0);

  return {
    totalOutstanding: Math.abs(totalOutstanding),
    debtorCount: debtors.length,
    debtors,
  };
}

export function calculateOutstandingChange(
  currentClients: Client[],
  previousClients: Client[]
): OutstandingChange {
  const current = calculateOutstandingBalance(currentClients);
  const previous = calculateOutstandingBalance(previousClients);

  const { totalOutstanding: currentTotal } = current;
  const { totalOutstanding: previousTotal } = previous;

  const change =
    previousTotal === 0
      ? currentTotal === 0
        ? 0
        : 100
      : ((currentTotal - previousTotal) / previousTotal) * 100;

  return {
    ...current,
    changePercent: Math.round(change),
    increase: change > 0,
  };
}
