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

interface BarChartDailyProps {
  yAxisRange?: [number, number];
}

const BarChartDaily = ({ yAxisRange = [0, 4000000] }: BarChartDailyProps) => {
  const { transactions } = useTransactionsStore();
  const salesData: DailySales[] = getDailySales(transactions ?? []);

  const data: ChartData<"bar", number[], string> = {
    labels: salesData.map((_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (salesData.length - 1 - index));
      return date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
      });
    }),
    datasets: [
      {
        data: salesData.map((item) => item.sales),
        backgroundColor: "#DA251C", // Red color matching the screenshot
        borderRadius: 4,
        barPercentage: 0.6, // Adjusts bar width to match design
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false, // Allows the chart to fill the container height
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#fff",
        titleColor: "#333",
        bodyColor: "#333",
        borderColor: "#e5e5e5",
        borderWidth: 1,
        padding: 10,
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
        ticks: {
          // CRITICAL FIX: These two lines force the text to be horizontal
          maxRotation: 0, 
          minRotation: 0,
          autoSkip: true, // Prevents overlap on small screens
          color: "#9CA3AF", // Gray text color
          font: {
            size: 12,
            family: "Inter",
          },
        },
      },
      y: {
        min: yAxisRange[0],
        max: yAxisRange[1],
        ticks: {
          callback: (value) => {
            const val = Number(value);
            if (val >= 1000000) return `₦${(val / 1000000).toFixed(0)}M`;
            if (val >= 1000) return `₦${(val / 1000).toFixed(0)}k`;
            return `₦${val}`;
          },
          color: "#9CA3AF",
          font: {
            size: 12,
            family: "Inter",
          },
        },
        beginAtZero: true,
        border: {
           display: false
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    // Updated container: bg-white to match first screenshot, fixed height for stability
    <div className="w-full h-[300px] bg-white p-2 sm:p-4 rounded-lg">
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChartDaily;