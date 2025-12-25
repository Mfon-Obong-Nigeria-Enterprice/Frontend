// src/features/dashboard/manager/ManagerDashboardOverview.tsx
import { useEffect } from "react";
import DashboardTitle from "../shared/DashboardTitle";
import Stats from "../shared/Stats";
import { SalesOverview } from "./component/SalesOverview";
import { RecentSalesWidget } from "./component/RecentSalesWidget";

// types
import type { StatCard } from "@/types/stats";

// stores
import { useClientStore } from "@/stores/useClientStore";
import { useTransactionsStore } from "@/stores/useTransactionStore";
import { useRevenueStore } from "@/stores/useRevenueStore";

// utils
import { getChangeText } from "@/utils/helpersfunction";
import { formatCurrency } from "@/utils/formatCurrency";

// components
import ManagerOutstandingDebt from "./component/ManagerOutstandingDebt";

const ManagerDashboardOverview = () => {
  const {
    transactions,
    getTodaysSales,
    getSalesPercentageChange,
  } = useTransactionsStore();

  const { getMOMRevenue } = useRevenueStore();
  const { getOutStandingBalanceData } = useClientStore();

  const todaysSales = getTodaysSales();
  const monthlyRevenue = getMOMRevenue();
  const outstandingBalance = getOutStandingBalanceData();
  const dailyChange = getSalesPercentageChange();

  useEffect(() => {
    console.log("useTransactionsStore transactions:", transactions);
  }, [transactions]);

  const stats: StatCard[] = [
    {
      heading: "Total Sales (Today)",
      salesValue: formatCurrency(todaysSales),
      statValue: getChangeText(
        dailyChange.percentage,
        dailyChange.direction,
        "yesterday"
      ),
      color:
        dailyChange.direction === "increase"
          ? "green"
          : dailyChange.direction === "decrease"
          ? "red"
          : "orange",
      hideArrow: true,
    },
    {
      heading: "Monthly Revenue",
      salesValue: formatCurrency(monthlyRevenue?.totalRevenue),
      statValue: `${
        monthlyRevenue?.direction === "increase"
          ? "+"
          : monthlyRevenue?.direction === "decrease"
          ? "-"
          : ""
      }${monthlyRevenue?.percentageChange}% from last month`,
      color:
        monthlyRevenue?.direction === "increase"
          ? "green"
          : monthlyRevenue?.direction === "decrease"
          ? "red"
          : "orange",
    },
    {
      heading: "Outstanding balances",
      salesValue: formatCurrency(outstandingBalance.totalDebt),
      statValue: `${outstandingBalance.clientsWithDebt} clients with overdue balances`,
      color: "orange",
    },
  ];

  return (
    <main>
      <DashboardTitle
        heading="Manager Dashboard"
        description="Welcome back! Here’s an overview of your business"
      />

      <Stats data={stats} />

      {/* Sales Overview + Recent Sales */}
      <div className="mt-9 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
        <div className="md:col-span-1 lg:col-span-3">
          <SalesOverview transactions={transactions} />
        </div>

        <div className="md:col-span-1 lg:col-span-2">
          <RecentSalesWidget />
        </div>
      </div>

      {/* Outstanding debt section */}
      <ManagerOutstandingDebt />
    </main>
  );
};

export default ManagerDashboardOverview;
