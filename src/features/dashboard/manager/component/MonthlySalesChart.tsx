import SalesPerformanceChart from "./SalesPerformanceChart";
import { useRevenueStore } from "@/stores/useRevenueStore";

export default function MonthlySalesChar() {
  const { transactions, getSalesPerformanceData, getLast30DaysSales } =
    useRevenueStore();

  // Get sales performance data for last 30 days
  const salesData = getSalesPerformanceData();

  // Get summary stats
  const salesSummary = getLast30DaysSales();

  // Transform the data to match SalesPerformanceChart's expected format
  const chartData = salesData.map((item) => ({
    day: item.day.toString(), // Convert to string as expected by chart
    amount: item.sales, // Map sales to amount
  }));

  // Loading state
  if (!transactions) {
    return <p className="text-gray-500">Loading monthly sales...</p>;
  }

  // No data state
  if (chartData.length === 0 || salesSummary.totalSales === 0) {
    return <p className="text-gray-500">No revenue data to display yet</p>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border">
      {/* Sales Summary Stats */}
      {/* <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-blue-600">
            Total Sales (30 days)
          </h3>
          <p className="text-2xl font-bold text-blue-900">
            ₦{salesSummary.totalSales.toLocaleString()}
          </p>
          <p className="text-sm text-blue-600">
            {salesSummary.direction === "increase"
              ? "↗"
              : salesSummary.direction === "decrease"
              ? "↘"
              : "→"}
            {salesSummary.percentageChange}% vs previous 30 days
          </p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-green-600">
            Average Daily Sales
          </h3>
          <p className="text-2xl font-bold text-green-900">
            ₦{Math.round(salesSummary.averageDailySales).toLocaleString()}
          </p>
          <p className="text-sm text-green-600">Per day average</p>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-purple-600">
            Total Transactions
          </h3>
          <p className="text-2xl font-bold text-purple-900">
            {salesSummary.totalTransactions}
          </p>
          <p className="text-sm text-purple-600">Completed transactions</p>
        </div>
      </div> */}

      {/* Chart */}
      <SalesPerformanceChart data={chartData} />
    </div>
  );
}
