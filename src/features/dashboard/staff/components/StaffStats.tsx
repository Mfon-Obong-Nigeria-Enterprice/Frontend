import React from "react";
import { IoIosArrowRoundUp } from "react-icons/io";

const StaffStats: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-Inter mb-8">
  <div className="bg-white rounded-[8px] border border-[#D9D9D9] p-4">
    <div className="flex flex-col gap-3">
      <p className="text-sm text-[var(--cl-secondary)] font-medium">
        My Sales (Today)
      </p>
      <p className="text-[var(--cl-text-dark)] font-Arial font-bold text-xl">
        ₦ 187,500
      </p>
      <p className="flex gap-0.5 font-Arial text-[#2ECC71] ">
        <IoIosArrowRoundUp />{" "}
        <span className="text-xs">15% from yesterday</span>
      </p>
    </div>
  </div>

 
  <div className="bg-white rounded-[8px] border border-[#D9D9D9] p-4">
    <div className="flex flex-col gap-3">
      <p className="text-sm text-[var(--cl-secondary)] font-medium">
        Transactions handled
      </p>
      <p className="text-[var(--cl-text-dark)] font-Arial font-bold text-xl">
        23
      </p>
      <p className="flex gap-0.5 font-Arial text-[#FFA500] ">
        <IoIosArrowRoundUp />{" "}
        <span className="text-xs">4% more than yesterday</span>
      </p>
    </div>
  </div>

  {/* clients served */}
  <div className="bg-white rounded-[8px] border border-[#D9D9D9] p-4">
    <div className="flex flex-col gap-3">
      <p className="text-sm text-[var(--cl-secondary)] font-medium">
        Active clients served
      </p>
      <p className="text-[var(--cl-text-dark)] font-Arial font-bold text-xl">
        18
      </p>
      <p className="flex gap-0.5 font-Arial text-[#3D80FF] ">
        <IoIosArrowRoundUp />{" "}
        <span className="text-xs">3% new clients today</span>
      </p>
    </div>
  </div>
</div>

  );
};

export default StaffStats;
