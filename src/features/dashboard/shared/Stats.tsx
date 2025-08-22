import React from "react";
import type { StatCard } from "@/types/stats";
import { useRevenueStore } from "@/stores/useRevenueStore";

interface StatsProps {
  data: StatCard[];
}

interface CircularProgressProps {
  percentage: number;
  size?: number;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  percentage,
  size = 80,
}) => {
  // Use the radius that matches your actual circle elements
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;

  // Clamp percentage between 0 and 100, handle negative values properly
  const clampedPercentage = Math.max(0, Math.min(100, Math.abs(percentage)));
  const strokeDashoffset =
    circumference - (clampedPercentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth="8"
          fill="transparent"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={percentage >= 0 ? "#2ECC71" : "#E74C3C"} // Green for positive, red for negative
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-300"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xl font-bold text-gray-900">{percentage}%</span>
      </div>
    </div>
  );
};

const Stats: React.FC<StatsProps> = ({ data }) => {
  const { getMOMRevenue } = useRevenueStore();
  const monthlyRevenue = getMOMRevenue();
  const getColor = (color?: string) => {
    switch (color) {
      case "green":
        return "#1AD410";
      case "orange":
        return "#F39C12";
      case "red":
        return "#F95353";
      case "blue":
        return "#3D80FF";
      default:
        return "#7d7d7d";
    }
  };

  return (
    <section
      className="gap-4 mt-2 px-3 md:px-0"
      style={{
        display: "grid",
        gridTemplateColumns:
          data.length <= 2
            ? "repeat(auto-fit, minmax(250px, 1fr))"
            : data.length === 3
            ? "repeat(auto-fit, minmax(280px, 1fr))"
            : "repeat(auto-fit, minmax(220px, 1fr))",
        maxWidth: "100%",
      }}
    >
      {data.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-lg border border-[#D9D9D9] p-4 sm:p-6 flex flex-col justify-evenly items-start gap-3 sm:gap-4 hover:shadow-md transition-shadow duration-200 relative"
        >
          <div className="font-Inter text-xs sm:text-sm text-[#7D7D7D]">
            {stat.heading}
          </div>
          <div
            className="font-Arial font-bold text-base sm:text-xl text-text-dark"
            style={{ color: stat.salesColor || "text-text-dark" }}
          >
            {stat.format === "currency"
              ? `₦${stat.salesValue.toLocaleString()}`
              : stat.format === "number"
              ? Number(stat.salesValue).toLocaleString()
              : stat.salesValue}
          </div>

          {/* Conditional rendering based on displayType */}
          {stat.displayType === "circular" && stat.percentage !== undefined ? (
            <div className="absolute right-2 bottom-[20%]">
              <CircularProgress
                percentage={monthlyRevenue?.percentageChange ?? 0}
                size={80}
              />
            </div>
          ) : stat.displayType === "linear" && stat.percentage !== undefined ? (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Progress</span>
                <span className="text-xs font-semibold">
                  {stat.percentage}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${stat.percentage}%`,
                    backgroundColor: getColor(stat.color),
                  }}
                ></div>
              </div>
            </div>
          ) : (
            <div
              className="flex items-center text-[0.625rem] sm:text-xs gap-1"
              style={{ color: stat.statColor || getColor(stat.color) }}
            >
              <span className="font-Arial leading-tight">{stat.statValue}</span>
            </div>
          )}
        </div>
      ))}
    </section>
  );
};

export default Stats;
