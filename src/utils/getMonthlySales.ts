import type { Transaction } from "@/types/transactions";
import type { MonthlySales } from "@/types/types";

export const getMonthlySales = (
  transactions: Transaction[]
): MonthlySales[] => {
  const monthlyMap: Record<string, number> = {};

  transactions.forEach((txn) => {
    const date = new Date(txn.createdAt);
    const monthKey = `${date.getFullYear()}-${date.getMonth()}`; // e.g. "2025-7"

    if (monthlyMap[monthKey]) {
      monthlyMap[monthKey] += txn.total;
    } else {
      monthlyMap[monthKey] = txn.total;
    }
  });

  const result: MonthlySales[] = Object.entries(monthlyMap).map(
    ([key, sales]) => {
      const [yearStr, monthIndexStr] = key.split("-");
      const year = Number(yearStr);
      const monthIndex = Number(monthIndexStr); // 0-based (0 = Jan)

      const monthName = new Date(year, monthIndex).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });

      return {
        month: monthName, // e.g. "Aug 2025"
        sales,
      };
    }
  );

  return result.sort((a, b) => {
    const [aYear, aMonth] = a.month.split(" ");
    const [bYear, bMonth] = b.month.split(" ");
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const aDate = new Date(Number(aYear), months.indexOf(aMonth));
    const bDate = new Date(Number(bYear), months.indexOf(bMonth));
    return aDate.getTime() - bDate.getTime();
  });
};
