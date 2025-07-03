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
  { month: "May", sales: "1.5" },
  { month: "June", sales: "3" },
  { month: "July", sales: "2.5" },
  { month: "August", sales: "3.5" },
  { month: "September", sales: "4" },
  { month: "October", sales: "3.1" },
  { month: "November", sales: "5" },
];

const BarChartMonthly = () => {
  const data = {
    labels: salesData.map((item) => item.month),
    datasets: [
      {
        data: salesData.map((item) => item.sales),
        backgroundColor: "#1AD410",
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
          label: (context: TooltipItem<"bar">) => `${context.parsed.y} m`,
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
          callback: (value: number) => `${value} million`,
          stepSize: 1,
        },
        beginAtZero: false,
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

export default BarChartMonthly;
