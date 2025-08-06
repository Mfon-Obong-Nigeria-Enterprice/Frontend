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
import { useTransactionsStore } from "@/stores/useTransactionStore";
import { getMonthlySales } from "@/utils/getMonthlySales";
import type { MonthlySales } from "@/types/types";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const BarChartMonthly = () => {
  const { transactions } = useTransactionsStore();
  const salesData: MonthlySales[] = getMonthlySales(transactions ?? []);

  const data: ChartData<"bar", number[], string> = {
    labels: salesData.map((item) => item.month),
    datasets: [
      {
        data: salesData.map((item) => item.sales),
        backgroundColor: "#1AD410",
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
          label: (context) => `${context.parsed.y} m`,
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
          callback: (value) => `${value.toLocaleString()} million`,
          stepSize: 500000,
        },
        beginAtZero: false,
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

export default BarChartMonthly;
