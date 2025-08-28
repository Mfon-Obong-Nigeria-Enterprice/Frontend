import { useNavigate } from "react-router-dom";
import DashboardTitle from "../shared/DashboardTitle";
import Stats from "../shared/Stats";
import RecentTransactions from "./component/desktop/RecentTransaction";
import RecentTransactionsMobile from "./component/mobile/RecentTransactionsMobile";
import OutstandingBalance from "../shared/OutstandingBalance";

//icons
import { ChevronRight } from "lucide-react";

// types
import type { StatCard } from "@/types/stats";

// ui
import { Button } from "@/components/ui/button";
import { useClientStore } from "@/stores/useClientStore";
import { useTransactionsStore } from "@/stores/useTransactionStore";
import { getChangeText } from "@/utils/helpersfunction";
import { useRevenueStore } from "@/stores/useRevenueStore";
import { getAllTransactions } from "@/services/transactionService";
import { useEffect } from "react";

const ManagerDashboardOverview = () => {
  const { getTodaysSales, getSalesPercentageChange } = useTransactionsStore();
  const { getMOMRevenue, setTransactions, transactions } = useRevenueStore();
  const { getOutStandingBalanceData } = useClientStore();
  const todaysSales = getTodaysSales();
  const monthlyRevenue = getMOMRevenue();
  const outstandingBalance = getOutStandingBalanceData();
  const dailyChange = getSalesPercentageChange();

  const navigate = useNavigate();

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      try {
        const transactionData = await getAllTransactions();
        setTransactions(transactionData);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      }
    };

    if (!transactions) {
      initializeData();
    }
  }, [transactions, setTransactions]);

  const stats: StatCard[] = [
    {
      heading: "Total Sales (Today)",
      salesValue: `${todaysSales.toLocaleString()}`,
      format: "currency",
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
      salesValue: `₦${monthlyRevenue?.totalRevenue.toLocaleString()}`,
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
      salesValue: `₦${outstandingBalance.totalDebt.toLocaleString()}`,
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
      <div className="py-14">
        <div className="xl:bg-white xl:rounded-lg xl:border xl:border-gray-200 xl:shadow-sm px-2 py-6 md:p-6">
          <h2 className="bg-white p-4 rounded-md text-xl font-semibold text-gray-800 mb-6">
            Recent Transaction
          </h2>
          <RecentTransactionsMobile />
          <RecentTransactions />
          <div className="bg-white w-full flex items-center justify-between px-4 my-5 xl:py-2 border shadow xl:shadow-none">
            <Button
              onClick={() => navigate("/manager/dashboard/manage-transactions")}
              variant="link"
              className="text-blue-600 hover:text-blue-800 font-medium mt-4 flex justify-between w-full"
            >
              View All Transactions
              <ChevronRight size={10} className="text-gray-500 w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
      <OutstandingBalance />
    </main>
  );
};

export default ManagerDashboardOverview;
