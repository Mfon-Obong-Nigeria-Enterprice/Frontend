import Stats from "../shared/Stats";
import type { StatCard } from "@/types/stats";
import TotalRevenueTrends from "./component/TotalRevenueTrends";
import MonthlySalesChart from "./component/MonthlySalesChart";
import DashboardTitle from "../shared/DashboardTitle";
import TopSellingProducts from "../shared/TopSellingProducts";
import SalesByCategoryChart from "../shared/CategoryTransactionChart";
import { useTransactionsStore } from "@/stores/useTransactionStore";
import { getChangeText } from "@/utils/helpersfunction";

// interface Product {
//   prodName: string;
//   soldUnit: number;
//   revenue: number;
//   category: string;
// }

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
      salesValue: `₦${thisWeekSales.toLocaleString()}`,
      statValue: getChangeText(
        weeklyChange.percentage,
        weeklyChange.direction,
        "week"
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
      salesValue: `₦${thisMonthSales.toLocaleString()}`,
      statValue: getChangeText(
        monthlyChange.percentage,
        monthlyChange.direction,
        "month"
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
        "month"
      ),
      color: "orange",
    },
  ];

  // const topProducts: Product[] = [
  //   {
  //     prodName: "cement",
  //     soldUnit: 320,
  //     revenue: 960000,
  //     category: "construction",
  //   },
  //   {
  //     prodName: "Rod",
  //     soldUnit: 190,
  //     revenue: 285000,
  //     category: "Reinforcement",
  //   },
  //   {
  //     prodName: "Tiles",
  //     soldUnit: 100,
  //     revenue: 280000,
  //     category: "Finishing",
  //   },
  // ];

  // Dynamically create selectedMonth in format YYYY-MM
  const now = new Date();
  const selectedMonth = `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}`;

  return (
    <main className="flex flex-col gap-10 mb-2">
      <DashboardTitle
        heading="Transaction"
        description="Oversee All Payments, Credits & Alerts"
      />
      <Stats data={stats} />

      <div className="mt-5">
        <TotalRevenueTrends />
      </div>

      <div className="bg-white py-10 px-5 border border-[#D9D9D9] rounded-md shadow-md">
        <p className="font-medium text-xl text-[#1E1E1E] pb-3">
          Sales Performance (Last 30 days)
        </p>
        <MonthlySalesChart selectedMonth={selectedMonth} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 items-center justify-center gap-5">
        <TopSellingProducts />
        <div className="bg-white flex flex-col justify-center w-full h-full p-7 border border-[#d9d9d9] rounded-xl">
          <h4 className="text-xl font-medium text-[#1E1E1E] mb-4">
            Sales by Category
          </h4>
          <SalesByCategoryChart />
        </div>
      </div>
    </main>
  );
};

export default BusinessReport;
