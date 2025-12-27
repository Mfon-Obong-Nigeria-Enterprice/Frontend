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
import { ArrowUp, ArrowDown, Minus } from "lucide-react"; // Assuming lucide-react, replace with your icon lib if different

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
        <span className="text-sm font-bold text-gray-700">
          {Math.round(clamped)}%
        </span>
      </div>
    </div>
  );
};

const getColor = (color?: string) => {
  if (color?.startsWith("#")) {
    return color;
  }
  switch (color) {
    case "green":
      return "#2ECC71";
    case "red":
      return "#F95353";
    case "blue":
      return "#3D80FF";
    case "orange":
      return "#FFA500";
    default:
      return "#6b7280";
  }
};

const Stats: React.FC<StatsProps> = ({ data }) => {
  const revenueStore = useRevenueStore();
  const monthlyRevenue =
    revenueStore.getMOMRevenue && revenueStore.getMOMRevenue();

  const borderColors = ["#2ECC71", "#F95353", "#3D80FF", "#FFA500"];

  return (
    <section
      className={`
      grid gap-4 mt-2
      grid-cols-1
      /* Dynamic Grid for Desktop based on data length */
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
        const numericSeries = rawSeries.map((v) =>
          Number.isFinite(v as number) ? Number(v) : 0
        );
        const chartData = numericSeries.map((v, i) => ({
          name: `${i}`,
          value: v,
        }));

        const color = getColor(stat.color);
        const borderColor = borderColors[index % borderColors.length];

        const isCircularCard = stat.displayType === "circular";
        const showArea =
          stat.chartType === "line" && chartData.length > 0 && !isCircularCard;
        const showBar =
          stat.chartType === "bar" && chartData.length > 0 && !isCircularCard;
        const showIcon = !!stat.icon;

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

        // Reusable Badge Component to ensure consistency across layouts
        const Badge = () => {
          if (!stat.statValue) return null;
          return (
             <div className="flex items-center gap-1 whitespace-nowrap" style={{ color }}>
                {/* Simple arrow logic - replace with your actual icon logic if needed */}
                <ArrowUp className="w-4 h-4" />
                <span className="text-xs sm:text-sm font-medium">
                  {stat.statValue}
                </span>
             </div>
          );
        };

        return (
          <div
            key={index}
            className="bg-white relative rounded-lg border border-[#D9D9D9] p-6 hover:shadow-md transition-shadow duration-200 flex items-center justify-between min-h-[140px]"
          >
            {/* LEFT SECTION: Title, Value, and Mobile/Desktop Badge */}
            <div className="flex flex-col justify-between h-full gap-2 z-10">
              <div>
                <div className="text-xs sm:text-sm text-[#7D7D7D] whitespace-nowrap mb-1">
                  {stat.heading}
                </div>
                <div className="lg:mt-4 mt-8 text-xl sm:text-2xl md:text-3xl font-bold text-text-dark leading-none truncate">
                  {renderSales()}
                </div>
              </div>

              {/* BADGE POSITION 1: Bottom Left 
                  - Visible on Mobile (default)
                  - Hidden on Tablet (md:hidden)
                  - Visible on Desktop (xl:block)
              */}
              <div className="block md:hidden xl:block mt-2">
                <Badge />
              </div>
            </div>

            {/* BADGE POSITION 2: Absolute Center 
                - Hidden on Mobile (hidden)
                - Visible on Tablet (md:block)
                - Hidden on Desktop (xl:hidden)
                - Absolute centered coordinates
            */}
            <div className="hidden md:block xl:hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <Badge />
            </div>

            {/* RIGHT SECTION: Chart */}
            <div className="flex items-end justify-end h-full">
               <div className="w-24 h-12 sm:w-28 sm:h-16"> 
                  {isCircularCard ? (
                    <div className="flex justify-end">
                       <CircularProgress
                        percentage={computedCircularPercent}
                        size={60}
                        strokeColor={color}
                      />
                    </div>
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
                              stopOpacity={0.2}
                            />
                            <stop
                              offset="100%"
                              stopColor={color}
                              stopOpacity={0}
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
                      <BarChart data={chartData.slice(-7)}>
                        <Bar
                          dataKey="value"
                          fill={color}
                          radius={[2, 2, 0, 0]}
                          isAnimationActive={false}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : showIcon ? (
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center border ml-auto"
                      style={{ borderColor }}
                    >
                      <img
                        src={stat.icon}
                        alt=""
                        className="w-[20px] h-[14px] object-contain"
                      />
                    </div>
                  ) : null}
               </div>
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default Stats;