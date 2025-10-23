import Stats from "../shared/Stats";
import type { StatCard } from "@/types/stats";
import TotalRevenueTrends from "./component/TotalRevenueTrends";
import MonthlySalesChart from "./component/MonthlySalesChart";
import DashboardTitle from "../shared/DashboardTitle";
import TopSellingProducts from "../shared/TopSellingProducts";
import SalesByCategoryChart from "../shared/CategoryTransactionChart";
import { useTransactionsStore } from "@/stores/useTransactionStore";
import { getChangeText } from "@/utils/helpersfunction";
import { formatCurrency } from "@/utils/formatCurrency";

const BusinessReport = () => {
  const {
    getThisWeekSales,
    getThisMonthSales,
    getWeeklySalesPercentageChange,
    getMonthlySalesPercentageChange,
    getTotalTransactionsCount,
    getTransactionsCountPercentageChange,
  } = useTransactionsStore();

  const thisWeekSales = getThisWeekSales();
  const thisMonthSales = getThisMonthSales();
  const totalTransactions = getTotalTransactionsCount();

  // Get the appropriate percentage changes
  const weeklyChange = getWeeklySalesPercentageChange();
  const monthlyChange = getMonthlySalesPercentageChange();
  const transactionCountChange = getTransactionsCountPercentageChange();

  const stats: StatCard[] = [
    {
      heading: "Total Sales (This week)",
      salesValue: formatCurrency(thisWeekSales),
      statValue: getChangeText(
        weeklyChange.percentage,
        weeklyChange.direction,
        "last week"
      ),
      color:
        weeklyChange.direction === "increase"
          ? "green"
          : weeklyChange.direction === "decrease"
          ? "red"
          : "orange",
    },
    {
      heading: "Total Sales (This month)",
      salesValue: formatCurrency(thisMonthSales),
      statValue: getChangeText(
        monthlyChange.percentage,
        monthlyChange.direction,
        "last month"
      ),
      color:
        monthlyChange.direction === "increase"
          ? "green"
          : monthlyChange.direction === "decrease"
          ? "red"
          : "orange",
    },
    {
      heading: "Total Transaction logged",
      salesValue: totalTransactions.toString(),
      statValue: getChangeText(
        transactionCountChange.percentage,
        transactionCountChange.direction,
        "last month"
      ),
      color: "orange",
    },
  ];

  return (
    <main className="flex flex-col gap-3 mb-2">
      <DashboardTitle
        heading="Transaction"
        description="Oversee All Payments, Credits & Alerts"
      />
      <Stats data={stats} />

      <div className="mt-2">
        <TotalRevenueTrends />
      </div>

      <div className=" py-4   mt-2">
        <p className="font-medium text-xl text-[#1E1E1E] pb-2 ">
          Sales Performance (Last 30 days)
        </p>
        <MonthlySalesChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 items-center justify-center gap-5 mt-2">
        <div className="lg:col-span-3">
          <TopSellingProducts />
        </div>
        <div className="bg-white border border-[#d9d9d9] rounded-xl  lg:col-span-2">
          <SalesByCategoryChart />
        </div>
      </div>
    </main>
  );
};

export default BusinessReport;
