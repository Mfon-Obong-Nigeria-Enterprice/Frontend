import type { Transaction } from "@/types/transactions";

export const getDailySales = (transactions: Transaction[]) => {
  const today = new Date();
  const last7Days = [...Array(7)]
    .map((_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      return d.toISOString().slice(0, 10); // e.g. "2025-08-04"
    })
    .reverse();

  const salesMap: Record<string, number> = {};

  last7Days.forEach((dateStr) => (salesMap[dateStr] = 0));

  transactions.forEach((txn) => {
    if (txn.type !== "PURCHASE" && txn.type !== "WHOLESALE" && txn.type !== "RETURN") return;
    const txnDate = new Date(txn.createdAt).toISOString().slice(0, 10);
    if (Object.prototype.hasOwnProperty.call(salesMap, txnDate)) {
      const amount = txn.type === "RETURN" ? -(txn.total ?? 0) : (txn.total ?? 0);
      salesMap[txnDate] += amount;
    }
  });

  return last7Days.map((dateStr) => ({
    day: new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    }),
    sales: salesMap[dateStr],
  }));
};
