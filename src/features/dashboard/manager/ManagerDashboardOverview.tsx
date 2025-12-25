import { useNavigate } from "react-router-dom";
import DashboardTitle from "../shared/DashboardTitle";
import Stats from "../shared/Stats";
import RecentTransactions from "./component/desktop/RecentTransaction";
import RecentTransactionsMobile from "./component/mobile/RecentTransactionsMobile";

//icons
import { ChevronRight } from "lucide-react";

// types
import type { StatCard } from "@/types/stats";

// ui
import { Button } from "@/components/ui/button";

// stores
import { useClientStore } from "@/stores/useClientStore";
import { useTransactionsStore } from "@/stores/useTransactionStore";
import { useRevenueStore } from "@/stores/useRevenueStore";
// import { getAllTransactions } from "@/services/transactionService";

// utils
import { getChangeText } from "@/utils/helpersfunction";
import { formatCurrency } from "@/utils/formatCurrency";
import ManagerOutstandingDebt from "./component/ManagerOutstandingDebt";

const ManagerDashboardOverview = () => {
  const { getTodaysSales, getSalesPercentageChange } = useTransactionsStore();
  const { getMOMRevenue } = useRevenueStore();
  const { getOutStandingBalanceData } = useClientStore();
  const todaysSales = getTodaysSales();
  const monthlyRevenue = getMOMRevenue();
  const outstandingBalance = getOutStandingBalanceData();
  const dailyChange = getSalesPercentageChange();

  const navigate = useNavigate();

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
      heading: "Monthly Revenue ",
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
      statValue: ` ${outstandingBalance.clientsWithDebt} Clients with overdue balances`,
      color: "orange",
    },
  ];
  return (
    <main>
      <DashboardTitle
        heading="Manager Dashboard"
        description="welcome back! Here’s an overview of your business"
      />
      <Stats data={stats} />
      <div className="py-9">
        <div className="xl:bg-white xl:rounded-lg xl:border xl:border-gray-200 xl:shadow-sm px-2 py-6 md:p-2">
          <h2 className="bg-white p-4 rounded-md text-xl font-semibold text-gray-800 ">
            Recent Transaction
          </h2>
          <RecentTransactionsMobile />
          <RecentTransactions />
       <div className="bg-white w-full flex items-center justify-between px-4 my-5 py-3 border shadow xl:shadow-none">
  {/* Left text (mobile & tablet) */}
  <span className="text-sm font-semibold text-gray-800 xl:hidden">
    Recent Transactions
  </span>

  {/* Right button */}
  <Button
    onClick={() => navigate("/manager/dashboard/manage-transactions")}
    variant="link"
    className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 p-0"
  >
    View all sales
    <ChevronRight size={14} className="text-gray-500" />
  </Button>
</div>

        </div>
      </div>
      {/* <OutstandingBalance /> */}
      <ManagerOutstandingDebt />
    </main>
  );
};

export default ManagerDashboardOverview;
