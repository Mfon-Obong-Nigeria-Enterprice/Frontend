import React from "react";
import type { StatCard } from "@/types/stats";
import { useRevenueStore } from "@/stores/useRevenueStore";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
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
  size = 75,
  strokeColor,
}) => {
  const radius = (size - 10) / 2;
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
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth="8"
          fill="transparent"
          strokeLinecap="round"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            transition: "stroke-dashoffset 0.5s ease",
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
    case "green": return "#16a34a";
    case "orange": return "#f97316";
    case "red": return "#ef4444";
    case "blue": return "#2563eb";
    default: return "#6b7280";
  }
};

const Stats: React.FC<StatsProps> = ({ data }) => {
  const revenueStore = useRevenueStore();
  const monthlyRevenue = revenueStore.getMOMRevenue && revenueStore.getMOMRevenue();

  return (
    <section
      className={`
        grid gap-4 mt-2
        /* 1. GRID BEHAVIOR */
        /* Mobile: 2 Columns (Matches Screenshot) */
        grid-cols-2 
        
        /* Tablet: 2 Columns */
        md:grid-cols-2    
        
        /* Large Tablet/Laptop: 2 Columns */
        lg:grid-cols-2    
        
        /* Desktop (XL+): Split to 3 or 4 Columns */
        ${
          data.length <= 2
            ? "xl:grid-cols-2"
            : data.length === 3
            ? "xl:grid-cols-3"
            : "xl:grid-cols-4"
        }
      `}
    >
      {data.map((stat, index) => {
        const rawSeries = Array.isArray(stat.chartData) ? stat.chartData : [];
        const numericSeries = rawSeries.map((v) => Number.isFinite(v as number) ? Number(v) : 0);
        const chartData = numericSeries.map((v, i) => ({ name: `${i}`, value: v }));

        const color = getColor(stat.color);
        const isCircularCard = stat.displayType === "circular";
        const showArea = stat.chartType === "line" && chartData.length > 0 && !isCircularCard;
        const showBar = stat.chartType === "bar" && chartData.length > 0 && !isCircularCard;

        const computedCircularPercent = typeof stat.percentage === "number"
            ? stat.percentage
            : monthlyRevenue?.percentageChange ?? 0;

        const renderSales = () => {
          if (stat.format === "currency") {
            if (typeof stat.salesValue === "number") return `₦${stat.salesValue.toLocaleString()}`;
            if (typeof stat.salesValue === "string" && stat.salesValue.trim().length > 0) return stat.salesValue;
            return "₦0";
          }
          if (stat.format === "number" || stat.format === "text") {
            return typeof stat.salesValue === "number" ? Number(stat.salesValue).toLocaleString() : String(stat.salesValue ?? "");
          }
          return String(stat.salesValue ?? "");
        };

        // Reusable Percentage Component
        const PercentageBadge = () => (
          stat.statValue ? (
            <span
              className="text-xs sm:text-sm font-medium flex items-center gap-1 whitespace-nowrap"
              style={{ color: color }}
            >
              {stat.statValue}
            </span>
          ) : null
        );

        return (
          <div
            key={index}
            className="bg-white rounded-lg border border-[#D9D9D9] p-4 sm:p-6 hover:shadow-md transition-shadow duration-200"
          >
            {/* 2. INTERNAL LAYOUT */ }
            <div className="flex flex-row items-center justify-between xl:flex xl:flex-row xl:items-center xl:justify-between h-full">
              
              {/* SECTION A: Heading & Amount */}
              <div className="flex flex-col justify-center w-full">
                <div className="text-xs sm:text-sm text-[#7D7D7D] whitespace-nowrap mb-2">
                  {stat.heading}
                </div>
                {/* Responsive text size to prevent overflow on small screens */}
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-text-dark leading-none truncate">
                  {renderSales()}
                </div>
                
                {/* PERCENTAGE LOCATION: Always visible (Mobile/Tablet/Desktop) */}
                <div className="mt-2 block">
                  <PercentageBadge />
                </div>
              </div>

              {/* SECTION C: Chart (Only renders if chart data exists) */}
              {(isCircularCard || showArea || showBar) && (
                <div className="flex items-center justify-end w-24 sm:w-32 md:w-full ml-2">
                  <div className="w-full h-16 max-w-[120px]">
                    {isCircularCard ? (
                      <div className="flex justify-end xl:justify-center">
                        <CircularProgress
                          percentage={computedCircularPercent}
                          size={65} 
                          strokeColor={color}
                        />
                      </div>
                    ) : showArea ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                          <defs>
                            <linearGradient id={`grad-${index}`} x1="0" x2="0" y1="0" y2="1">
                              <stop offset="0%" stopColor={color} stopOpacity={0.2} />
                              <stop offset="100%" stopColor={color} stopOpacity={0} />
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
                        <BarChart data={chartData.slice(-7)}>
                          <Bar
                            dataKey="value"
                            fill={color}
                            radius={[2, 2, 0, 0]} 
                            isAnimationActive={false}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : null}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default Stats;