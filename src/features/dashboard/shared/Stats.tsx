import React from "react";
// import { Skeleton } from "@/components/ui/skeleton";
import type { StatCard } from "@/types/stats";
// import { BsArrowUp } from "react-icons/bs";

interface StatsProps {
  data: StatCard[];
}

const Stats: React.FC<StatsProps> = ({ data }) => {
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
            : "repeat(auto-fit, minmax(250px, 1fr))",
        maxWidth: "100%",
      }}
    >
      {data.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-lg border border-[#D9D9D9] p-4 sm:p-6 flex flex-col justify-between gap-3 sm:gap-4 min-h-[120px] sm:min-h-[140px] lg:min-h-[160px] w-full max-w-full hover:shadow-md transition-shadow duration-200"
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
          <div
            className="flex items-center text-[0.625rem] sm:text-xs gap-1 ${getColor(
              stat.color
            "
            style={{ color: stat.statColor || getColor(stat.color) }}
          >
            {/* <span>{!stat.hideArrow && <BsArrowUp />}</span> */}
            <span className="font-Arial leading-tight"> {stat.statValue}</span>
          </div>
        </div>
      ))}
    </section>
  );
};

export default Stats;
