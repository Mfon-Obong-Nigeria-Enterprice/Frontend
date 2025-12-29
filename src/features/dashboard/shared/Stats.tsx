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
import { ArrowUp, ArrowDown } from "lucide-react";

// --- Sub-Components (Internal) ---

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
          style={{ transition: "stroke-dashoffset 0.5s ease" }}
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

// --- Helper Functions ---
const getColor = (color?: string) => {
  const colors: Record<string, string> = {
    green: "#2ECC71",
    red: "#F95353",
    blue: "#3D80FF",
    orange: "#FFA500",
  };
  return colors[color || ""] || color || "#6b7280";
};

// --- Single Card Component ---
interface SingleStatItemProps {
  stat: StatCard;
  index: number;
  monthlyRevenue: any;
  borderColors: string[];
}

const SingleStatItem: React.FC<SingleStatItemProps> = ({
  stat,
  index,
  monthlyRevenue,
  borderColors,
}) => {
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
    (stat.chartType === "line" || stat.chartType === "area") && chartData.length > 0 && !isCircularCard;
  const showBar =
    stat.chartType === "bar" && chartData.length > 0 && !isCircularCard;
  const showIcon = !!stat.icon;

  const computedCircularPercent =
    typeof stat.percentage === "number"
      ? stat.percentage
      : monthlyRevenue?.percentageChange ?? 0;

  const renderSalesValue = () => {
    if (stat.format === "currency") {
      if (typeof stat.salesValue === "number")
        return `₦${stat.salesValue.toLocaleString()}`;
      return typeof stat.salesValue === "string" && stat.salesValue.trim()
        ? stat.salesValue
        : "₦0";
    }
    return typeof stat.salesValue === "number"
      ? Number(stat.salesValue).toLocaleString()
      : String(stat.salesValue ?? "");
  };

  const renderTrendBadge = () => {
    if (!stat.statValue) return null;
    const isNegative = stat.statValue.includes("-") || stat.statValue.toLowerCase().includes("down");
    const Icon = isNegative ? ArrowDown : ArrowUp;
    
    return (
      <div className="flex items-center gap-1 mt-2 whitespace-nowrap" style={{ color }}>
        <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
        {/* Adjusted text size for better mobile fit */}
        <span className="text-[10px] sm:text-xs font-medium">
          {stat.statValue}
        </span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-[#D9D9D9] p-4 sm:p-6 hover:shadow-md transition-shadow duration-200 flex items-center justify-between min-h-[120px] sm:min-h-[140px]">
      {/* LEFT SIDE: Text Info */}
      <div className="flex flex-col justify-between h-full z-10 w-full overflow-hidden">
        <div>
          <div className="text-xs sm:text-sm text-[#7D7D7D] whitespace-nowrap mb-1 truncate">
            {stat.heading}
          </div>
          {/* Adjusted font size for mobile to prevent overflow in 2-col layout */}
          <div className="mt-1 sm:mt-2 text-lg sm:text-2xl font-bold text-[#1E1E1E] leading-none truncate">
            {renderSalesValue()}
          </div>
        </div>
        
        {renderTrendBadge()}
      </div>

      {/* RIGHT SIDE: Visuals (Charts/Icons) */}
      {/* Hide chart on very small screens if needed, or adjust width. 
          Currently keeping it but ensuring it doesn't break flex. */}
      {(isCircularCard || showArea || showBar || showIcon) && (
        <div className="hidden xs:flex items-end justify-end h-full w-[80px] sm:w-[120px] ml-2">
          {isCircularCard ? (
            <div className="flex justify-end w-full">
              <CircularProgress
                percentage={computedCircularPercent}
                size={50} // Smaller on mobile
                strokeColor={color}
              />
            </div>
          ) : showArea ? (
            <div className="w-full h-10 sm:h-16">
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
            </div>
          ) : showBar ? (
            <div className="w-full h-10 sm:h-16">
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
            </div>
          ) : showIcon ? (
            <div
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border ml-auto"
              style={{ borderColor }}
            >
              <img
                src={stat.icon}
                alt=""
                className="w-[16px] h-[12px] sm:w-[20px] sm:h-[14px] object-contain"
              />
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

// --- Main Container Component ---

interface StatsProps {
  data: StatCard[];
}

const Stats: React.FC<StatsProps> = ({ data }) => {
  const revenueStore = useRevenueStore();
  const monthlyRevenue = revenueStore.getMOMRevenue && revenueStore.getMOMRevenue();
  const borderColors = ["#2ECC71", "#F95353", "#3D80FF", "#FFA500"];

  return (
    <section
      className={`
        mt-2 grid 
        /* Mobile: 2 Columns (Requested Change) with slightly tighter gap */
        grid-cols-2 gap-3
        /* Tablet: 2 Columns with standard gap */
        sm:gap-4
        /* Desktop: 4 Columns */
        xl:grid-cols-4 
      `}
    >
      {data.map((stat, index) => (
        <SingleStatItem
          key={index}
          stat={stat}
          index={index}
          monthlyRevenue={monthlyRevenue}
          borderColors={borderColors}
        />
      ))}
    </section>
  );
};

export default Stats;