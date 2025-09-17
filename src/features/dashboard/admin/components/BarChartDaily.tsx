import { useTransactionsStore } from "@/stores/useTransactionStore";
import { getDailySales } from "@/utils/getDailySales";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  type ChartOptions,
  type ChartData,
} from "chart.js";
import type { DailySales } from "@/types/types";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const BarChartDaily = () => {
  const { transactions } = useTransactionsStore();
  const salesData: DailySales[] = getDailySales(transactions ?? []);

  const maxValue = Math.max(0, ...salesData.map((item) => item.sales));
  const step = Math.ceil(maxValue / 6); // about 6 ticks

  const data: ChartData<"bar", number[], string> = {
    labels: salesData.map((item) => item.day),
    datasets: [
      {
        data: salesData.map((item) => item.sales),
        backgroundColor: "#DA251C",
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
        ticks: {
          callback: (value) => `₦${value.toLocaleString()}`,
          stepSize: step,
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

export default BarChartDaily;
