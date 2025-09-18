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
      {/* Chart */}
      <SalesPerformanceChart data={chartData} />
    </div>
  );
}
