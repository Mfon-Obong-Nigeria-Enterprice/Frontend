import React from "react";
import DashboardTitle from "@/features/dashboard/shared/DashboardTitle";
import Stats from "../shared/Stats";
import type { StatCard } from "@/types/stats";
import TotalRevenueTrends from "./component/TotalRevenueTrends";
import SalesAnalytic from "./component/SalesAnalytic";

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
  return (
    <main className="flex flex-col gap-4 mb-7">
      <DashboardTitle
        heading="Business Report"
        description="Here’s is a breakdown of your business performance"
      />
      <Stats data={stats} />

      <TotalRevenueTrends />
      <SalesAnalytic topProduct={topProducts} />
    </main>
  );
};

export default BusinessReport;
