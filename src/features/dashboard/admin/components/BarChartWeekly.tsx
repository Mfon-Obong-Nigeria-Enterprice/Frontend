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

const BarChartWeekly = () => {
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
          label: (context) => `₦${context.parsed.y}`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          // drawBorder: false,
        },
      },
      y: {
        ticks: {
          callback: (value) => `₦${value.toLocaleString()}`,
          stepSize: 100000,
        },
        beginAtZero: true,
        grid: {
          display: false,
          // drawBorder: false,
        },
      },
    },
  };

  return (
    <div className="bg-[#F5F5F5] p-2 sm:p-6 rounded-lg shadow-md ">
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChartWeekly;
