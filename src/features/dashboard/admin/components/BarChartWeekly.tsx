import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  type TooltipItem,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const salesData = [
  { week: "May 15", sales: "20000" },
  { week: "May 20", sales: "30000" },
  { week: "May 26", sales: "60000" },
  { week: "June 02", sales: "35000" },
  { week: "June 07", sales: "40000" },
  { week: "June 13", sales: "31000" },
  { week: "June 19", sales: "5000" },
];

const BarChartWeekly = () => {
  const data = {
    labels: salesData.map((item) => item.week),
    datasets: [
      {
        data: salesData.map((item) => item.sales),
        backgroundColor: "#F39C12",
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<"bar">) => `₦${context.parsed.y}`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
      },
      y: {
        ticks: {
          callback: (value: number) => `₦${value.toLocaleString()}`,
          stepSize: 10000,
        },
        beginAtZero: true,
        grid: {
          display: false,
          drawBorder: false,
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
