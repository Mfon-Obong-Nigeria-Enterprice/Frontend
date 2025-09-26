import React from "react";
import type { StatCard } from "@/types/stats";
import { useRevenueStore } from "@/stores/useRevenueStore";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Tooltip,
} from "recharts";

interface StatsProps {
  data: StatCard[];
}

interface CircularProgressProps {
  percentage: number;
  size?: number;
  strokeColor: string;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  percentage,
  size = 80, // Reduced size for better fit
  strokeColor,
}) => {
  const radius = (size - 10) / 2; // Adjust radius for proper sizing
  const circumference = 2 * Math.PI * radius;
  const clamped = Number.isFinite(percentage)
    ? Math.max(0, Math.min(100, percentage))
    : 0;
  const strokeDashoffset = circumference - (clamped / 100) * circumference;

  return (
    <div
      style={{ width: size, height: size, position: "relative" }}
      className="flex items-center justify-center"
    >
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth="8" // Thinner stroke
          fill="transparent"
          strokeLinecap="round" // Smooth ends
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth="8" // Thinner stroke
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round" // Smooth ends - THIS FIXES THE EDGES
          style={{ 
            transition: "stroke-dashoffset 0.5s ease",
            filter: "drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.1))" // Optional: subtle shadow
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold text-gray-700">{Math.round(clamped)}%</span>
      </div>
    </div>
  );
};

const getColor = (color?: string) => {
  switch (color) {
    case "green":
      return "#16a34a";
    case "orange":
      return "#f97316";
    case "red":
      return "#ef4444";
    case "blue":
      return "#2563eb";
    default:
      return "#6b7280";
  }
};

const Stats: React.FC<StatsProps> = ({ data }) => {
  const revenueStore = useRevenueStore();
  const monthlyRevenue =
    revenueStore.getMOMRevenue && revenueStore.getMOMRevenue();

  return (
    <section
      className="gap-4 mt-2"
      style={{
        display: "grid",
        gridTemplateColumns:
          data.length <= 2
            ? "repeat(auto-fit, minmax(250px, 1fr))"
            : data.length === 3
            ? "repeat(3, 1fr)"
            : "repeat(auto-fit, minmax(200px, 1fr))",
        maxWidth: "100%",
      }}
    >
      {data.map((stat, index) => {
        const rawSeries = Array.isArray(stat.chartData) ? stat.chartData : [];
        const numericSeries = rawSeries.map((v) =>
          Number.isFinite(v as number) ? Number(v) : 0
        );
        const chartData = numericSeries.map((v, i) => ({
          name: `${i}`,
          value: v,
        }));

        const color = getColor(stat.color);
        const isCircularCard = stat.displayType === "circular";
        const showArea =
          stat.chartType === "line" && chartData.length > 0 && !isCircularCard;
        const showBar =
          stat.chartType === "bar" && chartData.length > 0 && !isCircularCard;

        const computedCircularPercent =
          typeof stat.percentage === "number"
            ? stat.percentage
            : monthlyRevenue?.percentageChange ?? 0;

        const renderSales = () => {
          if (stat.format === "currency") {
            if (typeof stat.salesValue === "number")
              return `₦${stat.salesValue.toLocaleString()}`;
            if (
              typeof stat.salesValue === "string" &&
              stat.salesValue.trim().length > 0
            )
              return stat.salesValue;
            return "₦0";
          }
          if (stat.format === "number" || stat.format === "text") {
            return typeof stat.salesValue === "number"
              ? Number(stat.salesValue).toLocaleString()
              : String(stat.salesValue ?? "");
          }
          return String(stat.salesValue ?? "");
        };

        return (
          <div
            key={index}
            className="bg-white rounded-lg border border-[#D9D9D9] p-4 sm:p-6 flex items-center justify-between gap-4 hover:shadow-md transition-shadow duration-200 relative"
          >
            {/* LEFT: text */}
            <div className="flex-1">
              <div className="text-xs sm:text-sm text-[#7D7D7D]">
                {stat.heading}
              </div>
              <div className="mt-2 text-base sm:text-xl font-bold text-text-dark">
                {renderSales()}
              </div>

              {stat.statValue && (
                <div className="flex items-center gap-1 mt-1">
                  <span
                    className="text-sm font-semibold"
                    style={{ color: color }}
                  >
                    {stat.statValue}
                  </span>
                </div>
              )}
            </div>

            {/* RIGHT: graph - changed width from w-1/2 to w-1/3 */}
            <div className="flex items-center justify-center w-1/3 h-24">
              {isCircularCard ? (
                <CircularProgress
                  percentage={computedCircularPercent}
                  size={80} // Adjusted size
                  strokeColor={color}
                />
              ) : showArea ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient
                        id={`grad-${index}`}
                        x1="0"
                        x2="0"
                        y1="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor={color}
                          stopOpacity={0.18}
                        />
                        <stop
                          offset="100%"
                          stopColor={color}
                          stopOpacity={0.02}
                        />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke={color}
                      fill={`url(#grad-${index})`}
                      strokeWidth={2}
                      dot={false}
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : showBar ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData.slice(-7)}
                    margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                  >
                    <Tooltip wrapperStyle={{ display: "none" }} />
                    <Bar
                      dataKey="value"
                      fill={color}
                      barSize={20}
                      radius={[2, 2, 0, 0]} // 
                      isAnimationActive={false}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ width: 72, height: 48 }} />
              )}
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default Stats;
