/* eslint-disable @typescript-eslint/no-explicit-any */
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


interface RevenueData {
  name: string;
  revenue: number;
}


const dataMap: Record<"daily" | "weekly" | "monthly", RevenueData[]> = {
  daily: [
    { name: "Week 1", revenue: 120000 },
    { name: "Week 2", revenue: 195000 },
    { name: "Week 3", revenue: 230000 },
    { name: "Week 4", revenue: 160000 },
  ],
  weekly: [
    { name: "Week 1", revenue: 420000 },
    { name: "Week 2", revenue: 380000 },
    { name: "Week 3", revenue: 450000 },
    { name: "Week 4", revenue: 500000 },
  ],
  monthly: [
    { name: "Week 1", revenue: 1500000 },
    { name: "Week 2", revenue: 1720000 },
    { name: "Week 3", revenue: 1980000 },
    { name: "Week 4", revenue: 1840000 },
  ],
};


const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: any[];
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-200 rounded shadow pb-14">
        <p className="font-semibold">{payload[0].payload.name}</p>
        <p className="text-blue-600">₦{payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

const formatYAxis = (value: number) => `₦${value / 1000}k`;

export default function RevenueTrendsChart() {
  const [selected, setSelected] = useState<"daily" | "weekly" | "monthly">(
    "daily"
  );
  const currentData = dataMap[selected];
  const maxRevenue = Math.max(...currentData.map((d) => d.revenue));

  const renderDot = (props: any) => {
    const { cx, cy, payload } = props;
    const isMax = payload.revenue === maxRevenue;

    return (
      <circle
        cx={cx}
        cy={cy}
        r={6}
        stroke="#3b82f6"
        strokeWidth={2}
        fill={isMax ? "red" : "#3b82f6"}
      />
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border w-full max-w-5xl mx-auto">
      <div className="flex justify-between">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Total Revenue Trends
          </h2>
          <p className="text-sm text-gray-500">
            Visualizes revenue fluctuations and peak periods
          </p>
        </div>

        
        <div className="flex justify-end gap mb-5">
          {["daily", "weekly", "monthly"].map((period) => (
            <button
              key={period}
              onClick={() => setSelected(period as "daily" | "weekly" | "monthly")}
              className={`px-4 py-1.5 text-sm capitalize transition-all duration-300 ${
                selected === period
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={currentData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={formatYAxis} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={renderDot}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
