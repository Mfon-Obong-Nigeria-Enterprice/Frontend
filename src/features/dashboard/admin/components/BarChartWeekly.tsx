import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions,
} from "chart.js";
import { getWeeklySales } from "@/utils/getWeeklySales";
import { useTransactionsStore } from "@/stores/useTransactionStore";
import type { WeeklySales } from "@/types/types";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface BarChartWeeklyProps {
  yAxisRange?: [number, number];
}

const BarChartWeekly = ({ yAxisRange = [0, 10000000] }: BarChartWeeklyProps) => {
  const { transactions } = useTransactionsStore();
  const salesData: WeeklySales[] = getWeeklySales(transactions ?? []);

  const data: ChartData<"bar", number[], string> = {
    labels: salesData.map((item) => item.week),
    datasets: [
      {
        data: salesData.map((item) => item.sales),
        backgroundColor: "#F39C12",
        borderRadius: 4,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `₦${context.parsed.y.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        min: yAxisRange[0],
        max: yAxisRange[1],
        ticks: {
          callback: (value) => `₦${Number(value).toLocaleString()}`,
        },
        beginAtZero: true,
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="bg-[#F5F5F5] p-2 sm:p-6 rounded-lg shadow-md">
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChartWeekly;