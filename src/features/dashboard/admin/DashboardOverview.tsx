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
    <main className="w-full max-w-full overflow-x-hidden">
      <div className="flex flex-col xl:flex-row xl:justify-between xl:items-end gap-4 mb-7">
        <DashboardTitle
          heading="Dashboard"
          description="Welcome, Admin User! Here's an overview of your business today"
        />
        <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
          <Button
            onClick={() => window.location.reload()}
            className="flex-1 sm:flex-none sm:min-w-[140px] bg-white hover:bg-[#f5f5f5] text-[#333333] border border-[var(--cl-secondary)] font-Inter font-medium transition-colors duration-200 ease-in-out"
          >
            <VscRefresh />
            Refresh
          </Button>
          <Link to="/add-prod" className="flex-1 sm:flex-none">
            <Button className="w-full sm:min-w-[140px] bg-[#2ECC71] hover:bg-[var(--cl-bg-green-hover)] transition-colors duration-200 ease-in-out">
              <Plus className="w-4 h-4 text-white mr-2" />
              Add Product
            </Button>
          </Link>
        </div>
      </div>
      <Stats data={stats} />
      <div className="grid grid-cols-1 xl:grid-cols-[60fr_40fr] gap-5 mt-5">
        <SalesOverview />
        <RecentSales />
      </div>
      <OutstandingBalance />
    </main>
  );
};

export default DashboardOverview;
