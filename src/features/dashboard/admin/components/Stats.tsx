import { NAIRA_SIGN } from "@bilmapay/react-currency-symbols";
import { BsArrowUp } from "react-icons/bs";

type statDataProp = { heading: string; salesValue: string; statValue: string };

const statData: statDataProp[] = [
  {
    heading: "Total Sales (Today)",
    salesValue: "1,250,000",
    statValue: "12% from yesterday",
  },
  {
    heading: "Outstanding balances",
    salesValue: "1,250,000",
    statValue: "5% from last week",
  },
  {
    heading: "Low Stock Items",
    salesValue: "7 Products",
    statValue: "Needs attention",
  },
  {
    heading: "Active Clients",
    salesValue: "42",
    statValue: "3% New Clients this week",
  },
];

const Stats = () => {
  return (
    <section className="mt-5 grid grid-cols-4 gap-4">
      {statData.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-lg border border-[#D9D9D9] py-5 px-7 flex flex-col gap-2.5"
        >
          <p className="font-Inter text-sm text-[#7D7D7D]">{stat.heading}</p>
          <p className="font-Arial font-bold text-xl text-text-dark">{`${NAIRA_SIGN} ${stat.salesValue}`}</p>
          <p
            className={`${
              index === 1
                ? "text-[#F39C12]"
                : index === 2
                ? "text-[#F95353]"
                : "text-[#1AD410]"
            } text-[0.75rem]  flex gap-1 items-center`}
          >
            <BsArrowUp className={index === 2 ? "hidden" : ""} />
            <span className="font-Arial leading-tight">{stat.statValue}</span>
          </p>
        </div>
      ))}
    </section>
  );
};

export default Stats;
