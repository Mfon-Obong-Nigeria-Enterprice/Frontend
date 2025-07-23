import { BsArrowUp } from "react-icons/bs";

// type statDataProp = { heading: string; salesValue: string; statValue: string };

export type StatCard = {
  heading: string;
  salesValue: string;
  statValue: string;
  color?: "green" | "orange" | "red" | "blue";
  hideArrow?: boolean;
};

type StatsProps = {
  data: StatCard[];
};


const Stats1 = ({ data }: StatsProps) => {
  return (
    <section className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 mt-5">
      {data.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-lg border border-[#D9D9D9] p-3 sm:py-5  flex flex-col gap-1 sm:gap-2.5 "
        >
          <p className="font-Inter text-xs sm:text-sm text-[#7D7D7D]">
            {stat.heading}
          </p>
          <p className="font-Arial font-bold text-base sm:text-xl text-text-dark">
            {stat.salesValue}
          </p>
          <p
            className={`text-[0.625rem] sm:text-xs flex gap-1 items-center ${
              stat.color === "orange"
                ? "text-[#F39C12]"
                : stat.color === "red"
                ? "text-[#F95353]"
                : stat.color === "blue"
                ? "text-[#3D80FF]"
                : "text-[#1AD410]" 
            } `}
            >
            {!stat.hideArrow && <BsArrowUp />}
            <span className="font-Arial leading-tight">{stat.statValue}</span>
          </p>
        </div>
      ))}
    </section>
  );
};

export default Stats1;
