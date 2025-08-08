import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import {
  getDailyRevenue,
  getYearlyRevenue,
  getMonthlyRevenue,
} from "@/services/transactionService";

import type { DotProps } from "recharts";

// API data shape
interface RevenueData {
  date: string;
  year?: string;
  revenue: number;
  transactions: number;
  amountPaid: number;
}

// Chart data shape after processing
interface ChartDataPoint {
  name: string;
  revenue: number;
}

type CustomTooltipProps = {
  active?: boolean;
  payload?: {
    value: number;
    payload: {
      name: string;
    };
  }[];
  label?: string;
};

// Periods
type Period = "daily" | "monthly" | "yearly";

// Fetch revenue based on selected period
const fetchRevenue = (period: Period): Promise<RevenueData[]> => {
  if (period === "daily") return getDailyRevenue();
  if (period === "monthly") return getMonthlyRevenue();
  return getYearlyRevenue();
};

// Custom Tooltip
const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (
    active &&
    payload &&
    payload.length > 0 &&
    payload[0] &&
    typeof payload[0].value === "number"
  ) {
    const revenue = payload[0].value;
    const name = payload[0].payload?.name;

    return (
      <div className="bg-white p-2 border border-gray-200 rounded shadow text-sm">
        <p className="font-semibold">{name}</p>
        <p className="text-blue-600">₦{revenue.toLocaleString()}</p>
      </div>
    );
  }

  return null;
};

// Format Y-axis values as ₦xxk
const formatYAxis = (value: number) => `₦${value / 1000}k`;

export default function RevenueTrendsChart() {
  const [selected, setSelected] = useState<Period>("daily");

  const fetchRevenueMapped = async (
    period: Period
  ): Promise<ChartDataPoint[]> => {
    const raw = await fetchRevenue(period); // returns RevenueData[]
    return raw.map((item) => ({
      name: item.date || item.year || "Unknown",
      revenue: item.revenue || item.amountPaid || 0,
    }));
  };

  const { data, isLoading, error } = useQuery<ChartDataPoint[], Error>({
    queryKey: ["revenue", selected],
    queryFn: () => fetchRevenueMapped(selected),
  });

  const hasData = data && data.length > 0;
  const maxRevenue = hasData ? Math.max(...data.map((d) => d.revenue)) : 0;

  // Custom dot rendering

  const renderDot = (props: DotProps) => {
    const { cx, cy } = props;
    // Type guard to ensure payload exists and has revenue
    const payload =
      "payload" in props && props.payload && typeof props.payload === "object"
        ? (props.payload as { revenue: number })
        : null;

    const isMax = payload?.revenue === maxRevenue;

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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Total Revenue Trends
          </h2>
          <p className="text-sm text-gray-500">
            Visualizes revenue fluctuations and peak periods
          </p>
        </div>

        <div className="flex gap-2 mb-4 md:mb-0">
          {(["daily", "monthly", "yearly"] as Period[]).map((period) => (
            <button
              key={period}
              onClick={() => setSelected(period)}
              className={`px-4 py-1.5 text-sm capitalize rounded transition-all duration-300 ${
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
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            Loading...
          </div>
        ) : error ? (
          <div className="text-red-500">Failed to load data</div>
        ) : !hasData ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            No revenue data to display yet.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={formatYAxis} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#3b82f6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorRevenue)"
                dot={renderDot}
                activeDot={{ r: 8 }}
              >
                <LabelList
                  dataKey="revenue"
                  content={({ x, y, value }) => {
                    if (typeof value === "number" && value === maxRevenue) {
                      return (
                        <text
                          x={x}
                          y={(typeof y === "number" ? y : Number(y) || 0) - 10}
                          fill="red"
                          fontWeight="bold"
                          fontSize={12}
                          textAnchor="middle"
                        >
                          {`Peak: ₦${(value / 1000).toFixed(0)}k`}
                        </text>
                      );
                    }
                    return null;
                  }}
                />
              </Line>
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
