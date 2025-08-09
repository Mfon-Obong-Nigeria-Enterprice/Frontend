import React from "react";
import DashboardTitle from "@/features/dashboard/shared/DashboardTitle";
import Stats from "../shared/Stats";
import type { StatCard } from "@/types/stats";
import TotalRevenueTrends from "./component/TotalRevenueTrends";
import SalesAnalytic from "./component/SalesAnalytic";
import MonthlySalesChart from "./component/MonthlySalesChart";

interface Product {
  prodName: string;
  soldUnit: number;
  revenue: number;
  category: string;
}

const stats: StatCard[] = [
  {
    heading: "Total Sales (This week)",
    salesValue: "8",
    statValue: "3% more than last week",
    color: "blue",
  },
  {
    heading: "Total Sales (This month)",
    salesValue: "₦ 2,235,600",
    statValue: "12% more than last month",
    color: "green",
  },
  {
    heading: "Total Transaction logged",
    salesValue: "42",
    statValue: "5% more than last month",
    color: "orange",
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

const BusinessReport: React.FC = () => {
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
