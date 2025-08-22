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
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4, // smooth curve
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
        fill: true,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false, // Allow custom height
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "white",
        bodyColor: "white",
        borderColor: "#3b82f6",
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          maxTicksLimit: 6, // Limit ticks for mobile
          callback: (value) => {
            if (typeof value === "number") {
              // More compact formatting for mobile
              if (value >= 1000000) {
                return `₦${(value / 1000000).toFixed(1)}M`;
              } else if (value >= 1000) {
                return `₦${(value / 1000).toFixed(0)}k`;
              }
              return `₦${value.toLocaleString()}`;
            }
            return value;
          },
          font: {
            size: 11, // Smaller font for mobile
          },
        },
      },
      x: {
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          maxTicksLimit: 8, // Show fewer labels on mobile
          font: {
            size: 11,
          },
        },
        title: {
          display: true,
          text: "Day of Month",
          font: {
            size: 12,
          },
        },
      },
    },
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
    },
  };

  return (
    <div className="w-full">
      {/* Chart container with responsive height */}
      <div className="relative w-full h-64 sm:h-80 md:h-96">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default SalesPerformanceChart;
