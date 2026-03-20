// src/features/dashboard/manager/ManagerDashboardOverview.tsx
import DashboardTitle from "../shared/DashboardTitle";
import Stats from "../shared/Stats";
import { SalesOverview } from "./component/SalesOverview";
import { RecentSalesWidget } from "./component/RecentSalesWidget";

// types
import type { StatCard } from "@/types/stats";

// stores
import { useClientStore } from "@/stores/useClientStore";
import { useTransactionsStore } from "@/stores/useTransactionStore";

// utils
import { getChangeText } from "@/utils/helpersfunction";
import { formatCurrency } from "@/utils/formatCurrency";
import { useMemo } from "react";

// components
import ManagerOutstandingDebt from "./component/ManagerOutstandingDebt";

const ManagerDashboardOverview = () => {
  const {
    transactions,
    getTodaysSales,
    getSalesPercentageChange,
  } = useTransactionsStore();

  const { getOutStandingBalanceData } = useClientStore();

  const todaysSales = getTodaysSales();
  const outstandingBalance = getOutStandingBalanceData();
  const dailyChange = getSalesPercentageChange();

  const monthlyRevenue = useMemo(() => {
    if (!transactions) return { totalRevenue: 0, percentageChange: 0, direction: "no-change" as const };

    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfPreviousMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    const revenueTypes = ["PURCHASE", "PICKUP", "WHOLESALE", "DEPOSIT"];

    const sumRevenue = (txns: typeof transactions) =>
      txns
        .filter((t) => revenueTypes.includes(t.type))
        .reduce((sum, t) => sum + (t.total || t.amountPaid || 0), 0);

    const currentMonthRevenue = sumRevenue(
      transactions.filter((t) => {
        const d = new Date(t.createdAt);
        return d >= startOfCurrentMonth && d <= now;
      })
    );

    const previousMonthRevenue = sumRevenue(
      transactions.filter((t) => {
        const d = new Date(t.createdAt);
        return d >= startOfPreviousMonth && d <= endOfPreviousMonth;
      })
    );

    let direction: "increase" | "decrease" | "no-change" = "no-change";
    let percentageChange = 0;
    if (previousMonthRevenue === 0 && currentMonthRevenue > 0) {
      direction = "increase"; percentageChange = 100;
    } else if (previousMonthRevenue > 0) {
      const change = ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100;
      direction = change > 0 ? "increase" : change < 0 ? "decrease" : "no-change";
      percentageChange = Math.round(Math.abs(change) * 100) / 100;
    }

    return { totalRevenue: currentMonthRevenue, percentageChange, direction };
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

      <Stats data={stats} columns={3} />

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
