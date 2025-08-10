import { useQuery } from "@tanstack/react-query";
import SalesPerformanceChart from "./SalesPerformanceChart"; // your chart component

export default function MonthlySalesChart({
  selectedMonth,
}: {
  selectedMonth: string;
}) {
  // Fetch monthly revenue
  const { data, isLoading, isError } = useQuery({
    queryKey: ["monthly-revenue", selectedMonth],
    queryFn: async () => {
      const res = await fetch(`/api/revenue/monthly?month=${selectedMonth}`);
      if (!res.ok) throw new Error("Failed to fetch revenue data");
      return res.json();
    },
  });

  // Transform breakdown → chart format
  const chartData =
    data?.breakdown?.map((item: { date: string; total: number }) => ({
      day: new Date(item.date).getDate(), // 1..31
      sales: item.total,
    })) || [];

  if (isLoading) {
    return <p className="text-gray-500">Loading monthly sales...</p>;
  }

  if (isError || chartData.length === 0) {
    return <p className="text-gray-500">No revenue data to display yet</p>;
  }

  return <SalesPerformanceChart data={chartData} />;
}
