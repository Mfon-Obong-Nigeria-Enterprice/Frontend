import React from "react";
import type { StatCard } from "@/types/stats";
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

const Stats: React.FC<StatsProps> = ({ data }) => {
  return (
    <section
      className="
        grid gap-4 mt-2
        /* Mobile: 1 Column */
        grid-cols-1 
        /* Tablet: 1 Column (Wide cards) */
        md:grid-cols-1    
        /* Desktop: 3 Columns (Standard cards) */
        xl:grid-cols-3
      "
    >
      {data.map((stat, index) => {
        const rawSeries = Array.isArray(stat.chartData) ? stat.chartData : [];
        const numericSeries = rawSeries.map((v) => Number.isFinite(v as number) ? Number(v) : 0);
        const safeSeries = numericSeries.length > 0 ? numericSeries : [0, 0];
        const chartData = safeSeries.map((v, i) => ({ name: `${i}`, value: v }));

        const chartColor = stat.chartColor || "#3D80FF"; 
        
        const isCircularCard = stat.displayType === "circular";
        const showArea = (stat.chartType === "area" || stat.chartType === "line") && !isCircularCard;
        const showBar = stat.chartType === "bar" && !isCircularCard;

        const renderSales = () => {
          if (stat.format === "currency") {
            if (typeof stat.salesValue === "number") return `₦${stat.salesValue.toLocaleString()}`;
            if (typeof stat.salesValue === "string" && stat.salesValue.trim().length > 0) return stat.salesValue;
            return "₦0";
          }
          return typeof stat.salesValue === "number" ? Number(stat.salesValue).toLocaleString() : String(stat.salesValue ?? "");
        };

        // Reusable Percentage Component to avoid code duplication
        const PercentageBadge = () => (
           stat.statValue ? (
            <div className={`text-xs font-medium flex items-center gap-1 whitespace-nowrap ${
                stat.color === 'green' ? 'text-[#22C55E]' : 
                stat.color === 'blue' ? 'text-[#3D80FF]' : 
                stat.color === 'red' ? 'text-[#EF4444]' : 'text-[#FFA500]'
            }`}>
              {/* Arrow Icon logic based on color/direction if needed, mimicking the text */}
              {stat.statValue}
            </div>
           ) : null
        );

        return (
          <div
            key={index}
            className="bg-white rounded-[10px] border border-[#E5E7EB] p-5 hover:shadow-sm transition-shadow duration-200 flex flex-row justify-between items-center min-h-[140px]"
          >
            {/* 1. LEFT SIDE: Heading & Value */}
            {/* Logic: On Tablet, we ONLY show Heading and Value here. Percentage moves to center. */}
            <div className="flex flex-col justify-between h-full pr-2 self-stretch">
              <h3 className="text-[13px] md:text-sm text-[#6B7280] font-normal truncate">
                {stat.heading}
              </h3>

              <div className="text-xl sm:text-2xl font-bold text-[#1F2937] my-1">
                {renderSales()}
              </div>

              {/* MOBILE & DESKTOP PERCENTAGE (Hidden on Tablet) */}
              <div className="block md:hidden xl:block">
                 <PercentageBadge />
              </div>
            </div>

            {/* 2. CENTER: Percentage (TABLET ONLY) */}
            {/* Logic: Hidden on Mobile and Desktop. Visible and Centered on Tablet. */}
            <div className="hidden md:flex xl:hidden flex-1 justify-center items-center">
               <PercentageBadge />
            </div>

            {/* 3. RIGHT SIDE: Charts */}
            <div className="w-[120px] sm:w-[140px] h-full flex items-end justify-end relative self-stretch">
                {isCircularCard ? (
                  <div className="flex items-center justify-center h-full w-full">
                    <CircularProgress
                      percentage={stat.percentage || 0}
                      size={80}
                      strokeColor={chartColor}
                    />
                  </div>
                ) : showArea ? (
                  <div className="w-full h-[80px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id={`grad-${index}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={chartColor} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke={chartColor}
                          strokeWidth={2}
                          fill={`url(#grad-${index})`}
                          isAnimationActive={true}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                ) : showBar ? (
                  <div className="w-full h-[60px] flex items-end">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <Bar
                          dataKey="value"
                          fill={chartColor}
                          radius={[3, 3, 0, 0]}
                          barSize={12} 
                          isAnimationActive={true}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : null}
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default Stats;