import React from "react";
import DashboardTitle from "@/features/dashboard/shared/DashboardTitle";
import Stats from "../shared/Stats";
import type { StatCard } from "@/types/stats";
import TotalRevenueTrends from "./component/TotalRevenueTrends";
import SalesAnalytic from "./component/SalesAnalytic";
import MonthlySalesChart from "./component/MonthlySalesChart";
import { useTransactionsStore } from "@/stores/useTransactionStore";

interface Product {
  prodName: string;
  soldUnit: number;
  revenue: number;
  category: string;
}

const BusinessReport: React.FC = () => {
  const {
    getThisWeekSales,
    getWeeklySalesPercentageChange,
    getThisMonthSales,
    getMonthlySalesPercentageChange,
    getTotalTransactionsCount,
    getTransactionsCountPercentageChange,
  } = useTransactionsStore();

  // Get dynamic data
  const thisWeekSales = getThisWeekSales();
  const weeklyChange = getWeeklySalesPercentageChange();

  const thisMonthSales = getThisMonthSales();
  const monthlyChange = getMonthlySalesPercentageChange();

  const totalTransactions = getTotalTransactionsCount();
  const transactionChange = getTransactionsCountPercentageChange();

  // Format change text helper
  const formatChangeText = (
    change: {
      percentage: number;
      direction: "increase" | "decrease" | "no-change";
    },
    period: string
  ) => {
    switch (change.direction) {
      case "increase":
        return `↑${change.percentage}% more than ${period}`;
      case "decrease":
        return `↓${change.percentage}% less than ${period}`;
      default:
        return `—No change from ${period}`;
    }
  };

  const stats: StatCard[] = [
    {
      heading: "Total Sales (This week)",
      salesValue: thisWeekSales,
      format: "currency",
      statValue: formatChangeText(weeklyChange, "last week"),
      color:
        weeklyChange.direction === "increase"
          ? "green"
          : weeklyChange.direction === "decrease"
          ? "red"
          : "blue",
    },
    {
      heading: "Total Sales (This month)",
      salesValue: thisMonthSales,
      format: "currency",
      statValue: formatChangeText(monthlyChange, "last month"),
      color:
        monthlyChange.direction === "increase"
          ? "green"
          : monthlyChange.direction === "decrease"
          ? "red"
          : "blue",
    },
    {
      heading: "Total Transaction logged",
      salesValue: totalTransactions,
      format: "number",
      statValue: formatChangeText(transactionChange, "last month"),
      color:
        transactionChange.direction === "increase"
          ? "green"
          : transactionChange.direction === "decrease"
          ? "red"
          : "orange",
    },
  ];

  const topProducts: Product[] = [
    {
      prodName: "cement",
      soldUnit: 320,
      revenue: 960000,
      category: "construction",
    },
    {
      prodName: "Rod",
      soldUnit: 190,
      revenue: 285000,
      category: "Reinforcement",
    },
    {
      prodName: "Tiles",
      soldUnit: 100,
      revenue: 280000,
      category: "Finishing",
    },
  ];

  // Dynamically create selectedMonth in format YYYY-MM
  const now = new Date();
  const selectedMonth = `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}`;

  return (
    <main className="flex flex-col gap-4 mb-7">
      <DashboardTitle
        heading="Business Report"
        description="Here's is a breakdown of your business performance"
      />
      <Stats data={stats} />

      <TotalRevenueTrends />

      <div className="bg-white py-10 px-5 my-16 border border-[#D9D9D9] rounded-md shadow-md">
        <p className="font-medium text-xl text-[#1E1E1E] pb-3">
          Sales Performance (Last 30 days)
        </p>
        <MonthlySalesChart selectedMonth={selectedMonth} />
      </div>

      <SalesAnalytic topProduct={topProducts} />
    </main>
  );
};

export default BusinessReport;
