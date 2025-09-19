/** @format */

import { Link } from "react-router-dom";
import DashboardTitle from "../shared/DashboardTitle";
import Stats from "../shared/Stats";
import SalesOverview from "./components/SalesOverview";
import OutstandingBalance from "../shared/OutstandingBalance";
import RecentSales from "../shared/RecentSales";
import { Button } from "@/components/ui/button";
import { VscRefresh } from "react-icons/vsc";
import { Plus } from "lucide-react";
import { useInventoryStore } from "@/stores/useInventoryStore";
import { useClientStore } from "@/stores/useClientStore";
import { type StatCard } from "@/types/stats";
import { useTransactionsStore } from "@/stores/useTransactionStore";
import { getChangeText } from "@/utils/helpersfunction";
import { formatCurrency } from "@/utils/formatCurrency";

const DashboardOverview: React.FC = () => {
  const products = useInventoryStore((state) => state.products);
  const {
    getActiveClients,
    getActiveClientsPercentage,
    getOutStandingBalanceData,
    getOutStandingBalancePercentageChange, // New method
  } = useClientStore();
  const { getTodaysSales, getSalesPercentageChange } = useTransactionsStore();

  const lowStockCount = products?.filter(
    (prod) => prod.stock <= prod.minStockLevel
  ).length;
  const todaysSales = getTodaysSales();
  const dailyChange = getSalesPercentageChange();
  const activeClients = getActiveClients();
  const outstandingBalance = getOutStandingBalanceData();
  const activeClientsPercentage = getActiveClientsPercentage();
  const outstandingBalanceChange = getOutStandingBalancePercentageChange();

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
    },
    {
      heading: "Outstanding Balances",
      salesValue: `${outstandingBalance.totalDebt.toLocaleString()}`,
      format: "currency",
      statValue: getChangeText(
        outstandingBalanceChange.percentage,
        outstandingBalanceChange.direction,
        "last week"
      ),
      color:
        outstandingBalanceChange.direction === "increase"
          ? "red" // Increase in debt is bad
          : outstandingBalanceChange.direction === "decrease"
          ? "green" // Decrease in debt is good
          : "orange",
    },
    {
      heading: "Low Stock Items",
      salesValue: `${lowStockCount || 0} Products`,
      statValue: `${
        lowStockCount && lowStockCount > 0
          ? "Needs attention"
          : "All items well stocked"
      }`,
      statColor: `${lowStockCount && lowStockCount > 0 ? "red" : "gray"}`,
      hideArrow: true,
    },
    {
      heading: "Active Clients",
      salesValue: `${activeClients}`,
      statValue: `${activeClientsPercentage}% of total`,
      statColor: "green",
    },
  ];

  return (
    <main className="p-2">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end md:gap-4 mb-7">
        <DashboardTitle
          heading="Dashboard"
          description="Welcome, Admin User! Here's an overview of your business today"
        />
        <div className="flex gap-5 mx-5">
          <Button
            onClick={() => window.location.reload()}
            className="w-40 bg-white hover:bg-[#f5f5f5] text-[#333333] border border-[var(--cl-secondary)] font-Inter font-medium transition-colors duration-200 ease-in-out"
          >
            <VscRefresh />
            Refresh
          </Button>
          <Link to="/add-prod">
            <Button className="w-40 bg-[#2ECC71] hover:bg-[var(--cl-bg-green-hover)] transition-colors duration-200 ease-in-out [&_span]:text-5xl">
              <Plus className="w-10 h-10 text-white" />
              Add Product
            </Button>
          </Link>
        </div>
      </div>
      <Stats data={stats} />
      <div className="grid grid-cols-1 lg:grid-cols-[60fr_40fr] gap-5 mt-5">
        <SalesOverview />
        <RecentSales />
      </div>
      <OutstandingBalance />
    </main>
  );
};

export default DashboardOverview;
