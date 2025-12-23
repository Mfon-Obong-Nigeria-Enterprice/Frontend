//src\features\dashboard\manager\ManagerDashboardOverview.tsx
import { useEffect } from "react";
//import { useNavigate } from "react-router-dom";
import DashboardTitle from "../shared/DashboardTitle";
import Stats from "../shared/Stats";
//import RecentTransactions from "./component/desktop/RecentTransaction";
//import RecentTransactionsMobile from "./component/mobile/RecentTransactionsMobile";
import { SalesOverview } from "./component/SalesOverview"; // Adjusted path to match your structure
import { RecentSalesWidget } from "./component/RecentSalesWidget"; // Import the new widget

//icons
//import { ChevronRight } from "lucide-react";

// types
import type { StatCard } from "@/types/stats";

// ui
//import { Button } from "@/components/ui/button";

// stores
import { useClientStore } from "@/stores/useClientStore";
import { useTransactionsStore } from "@/stores/useTransactionStore";
import { useRevenueStore } from "@/stores/useRevenueStore";

// utils
import { getChangeText } from "@/utils/helpersfunction";
import { formatCurrency } from "@/utils/formatCurrency";
import ManagerOutstandingDebt from "./component/ManagerOutstandingDebt";

const ManagerDashboardOverview = () => {
  // 1. Extract 'transactions' list from the store along with the helpers
  const { transactions, getTodaysSales, getSalesPercentageChange } = useTransactionsStore();
  const { getMOMRevenue } = useRevenueStore();
  const { getOutStandingBalanceData } = useClientStore();
  
  const todaysSales = getTodaysSales();
  const monthlyRevenue = getMOMRevenue();
  const outstandingBalance = getOutStandingBalanceData();
  const dailyChange = getSalesPercentageChange();

 // const navigate = useNavigate();

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

      {/* 2. Split Layout: Sales Overview (Left) & Recent Sales (Right) */}
      <div className="mt-9 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
        <div className="md:col-span-1 lg:col-span-3">
          <SalesOverview transactions={transactions} />
        </div>
        <div className="md:col-span-1 lg:col-span-2">
          <RecentSalesWidget />
        </div>
      </div>

      {/* <div className="py-2">
        <div className="xl:bg-white xl:rounded-lg xl:border xl:border-gray-200 xl:shadow-sm px-2 py-6 md:p-2">
          <h2 className="bg-white p-4 rounded-md text-xl font-semibold text-gray-800 ">
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
      </div> */}
      {/* <OutstandingBalance /> */}
      <ManagerOutstandingDebt />
    </main>
  );
};

export default ManagerDashboardOverview;