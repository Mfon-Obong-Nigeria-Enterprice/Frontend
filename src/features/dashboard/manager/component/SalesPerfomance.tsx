import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
const dailyData = [
  { name: "Mon", revenue: 4000 },
  { name: "Tue", revenue: 3200 },
  { name: "Wed", revenue: 5000 },
  { name: "Thu", revenue: 3500 },
  { name: "Fri", revenue: 6000 },
  { name: "Sat", revenue: 4500 },
  { name: "Sun", revenue: 3000 },
];

const weeklyData = [
  { name: "Week 1", revenue: 15000 },
  { name: "Week 2", revenue: 18000 },
  { name: "Week 3", revenue: 22000 },
  { name: "Week 4", revenue: 17500 },
];

const monthlyData = [
  { name: "Jan", revenue: 65000 },
  { name: "Feb", revenue: 70000 },
  { name: "Mar", revenue: 80000 },
  { name: "Apr", revenue: 75000 },
];

function TotalRevenueTrends() {
  const [selectedTab, setSelectedTab] = useState("daily");

  const getData = () => {
    if (selectedTab === "weekly") return weeklyData;
    if (selectedTab === "monthly") return monthlyData;
    return dailyData;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border w-full max-w-4xl mx-auto">
      <div className="flex justify-between">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Total Revenue Trends
          </h2>
          <p className="text-sm text-gray-500">
            Revenue from transactions and product purchases
          </p>
        </div>

        <div className="flex justify-end gap mb-5">
          {["daily", "weekly", "monthly"].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-4 py-1.5 text-sm  capitalize transition-all duration-300 ${
                selectedTab === tab
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={getData()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#3b82f6"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default TotalRevenueTrends;
