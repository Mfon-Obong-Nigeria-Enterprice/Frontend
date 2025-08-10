import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { getColor } from "@/lib/utils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface HealthChartProps {
  databaseValue: number;
  memoryValue: number;
}

export function HealthChart({ databaseValue, memoryValue }: HealthChartProps) {
  const chartData = {
    labels: ["Database Response Time", "Memory Usage"],
    datasets: [
      {
        label: "Database (ms)",
        data: [databaseValue, 0],
        backgroundColor: getColor(databaseValue, true),
      },
      {
        label: "Memory (%)",
        data: [0, memoryValue],
        backgroundColor: getColor(memoryValue, false),
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="h-64">
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
}