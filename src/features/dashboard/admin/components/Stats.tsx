import React from "react";
// import { Skeleton } from "@/components/ui/skeleton";
import type { StatCard } from "@/types/stats";
import { BsArrowUp } from "react-icons/bs";

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

      default:
        return "#7d7d7d";
    }
  };

  return (
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mt-5 px-3">
      {data.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-lg border border-[#D9D9D9]  p-3 sm:py-5 sm:px-7 flex flex-col gap-1 sm:gap-2.5"
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
            <span>{!stat.hideArrow && <BsArrowUp />}</span>
            <span className="font-Arial leading-tight"> {stat.statValue}</span>
          </div>
        </div>
      ))}
    </section>
  );
};

export default Stats;
