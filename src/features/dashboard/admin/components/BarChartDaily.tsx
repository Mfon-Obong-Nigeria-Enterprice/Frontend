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
  { day: "May 15", sales: "200" },
  { day: "May 16", sales: "300" },
  { day: "May 17", sales: "250" },
  { day: "May 18", sales: "350" },
  { day: "May 19", sales: "400" },
  { day: "May 20", sales: "310" },
  { day: "May 21", sales: "500" },
];

const BarChartDaily = () => {
  const data = {
    labels: salesData.map((item) => item.day),
    datasets: [
      {
        data: salesData.map((item) => item.sales),
        backgroundColor: "#DA251C",
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
          callback: (value: number) => `₦${value}`,
          stepSize: 100,
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
    <div className="bg-[#F5F5F5] p-6 rounded-lg shadow-md ">
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChartDaily;
