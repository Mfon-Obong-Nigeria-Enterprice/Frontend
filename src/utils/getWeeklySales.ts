import type { Transaction } from "@/types/transactions";
import type { WeeklySales } from "@/types/types";

// Helper: Get start and end date of a week
const getWeekRange = (date: Date) => {
  const start = new Date(date);
  const day = start.getDay(); // Sunday = 0
  const diff = start.getDate() - day + (day === 0 ? -6 : 1); // ISO week starts Monday
  start.setDate(diff);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  const format = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "2-digit" });

  return `${format(start)} - ${format(end)}`;
};

export const getWeeklySales = (transactions: Transaction[]): WeeklySales[] => {
  const weeklyMap: Record<string, number> = {};

  transactions.forEach((txn) => {
    const date = new Date(txn.createdAt);
    const year = date.getFullYear();

    // Get ISO week number
    const janFirst = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor(
      (date.getTime() - janFirst.getTime()) / (24 * 60 * 60 * 1000)
    );
    const weekNumber = Math.ceil((date.getDay() + 1 + days) / 7);

    const key = `${year}-W${weekNumber}`;
    if (weeklyMap[key]) {
      weeklyMap[key] += txn.total;
    } else {
      weeklyMap[key] = txn.total;
    }
  });

  const result: WeeklySales[] = Object.entries(weeklyMap).map(
    ([key, sales]) => {
      const [yearStr, weekStr] = key.split("-W");
      const year = Number(yearStr);
      const week = Number(weekStr);

      // Estimate week start date from year and week number
      const firstJan = new Date(year, 0, 1);
      const startOfWeek = new Date(firstJan.setDate((week - 1) * 7 + 1));

      return {
        week: `Week ${week} (${getWeekRange(startOfWeek)})`,
        sales,
      };
    }
  );

  // Optional: sort by week number
  return result.sort((a, b) => {
    const aWeek = parseInt(a.week.match(/Week (\d+)/)?.[1] ?? "0");
    const bWeek = parseInt(b.week.match(/Week (\d+)/)?.[1] ?? "0");
    return aWeek - bWeek;
  });
};
