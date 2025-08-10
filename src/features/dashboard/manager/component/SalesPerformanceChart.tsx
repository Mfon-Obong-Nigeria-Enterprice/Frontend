import { Line } from "react-chartjs-2";
import type { ChartData, ChartOptions } from "chart.js";
import "chart.js/auto";

export interface SalesDataPoint {
  day: string; // could also be `number` if you prefer numeric days
  amount: number;
}

interface SalesPerformanceChartProps {
  data: SalesDataPoint[];
}

const SalesPerformanceChart: React.FC<SalesPerformanceChartProps> = ({
  data,
}) => {
  const chartData: ChartData<"line"> = {
    labels: data.map((d) => d.day),
    datasets: [
      {
        label: "Sales",
        data: data.map((d) => d.amount),
        borderColor: "blue",
        tension: 0.4, // smooth curve
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Sales Performance (Last 30 days)" },
    },
    scales: {
      y: {
        ticks: {
          callback: (value) => {
            if (typeof value === "number") {
              return `₦${value.toLocaleString()}`;
            }
            return value;
          },
        },
      },
      x: { title: { display: true, text: "Day of the month" } },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default SalesPerformanceChart;
