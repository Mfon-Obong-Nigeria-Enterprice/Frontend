import React from "react";
import { Link } from "react-router-dom";
import { MdOutlineShoppingBag } from "react-icons/md";
import { IoPerson } from "react-icons/io5";
import { BsBoxSeam } from "react-icons/bs";

const QuickActions: React.FC = () => {
  return (
    <div className="bg-white rounded p-5 mb-8">
      <h4 className="text-lg text-[var(--cl-text-dark)] font-medium mb-3">
        Quick Actions
      </h4>

      <div className="grid grid-cols-4 gap-10 min-h-[6.25rem]">
        {/* one */}
        <Link
          to="/staff/dashboard/new-sales"
          className="flex flex-col justify-center items-center gap-1 bg-radial from-[#176639] to-[#239955] text-white rounded-[0.625rem]"
        >
          <div className="flex gap-1 items-center">
            <MdOutlineShoppingBag />
            <h6>New Sales</h6>
          </div>
          <p className="text-xs">Process customer purchase</p>
        </Link>

        {/* two */}
        <Link
          to="/staff/dashboard/s-clients"
          className="flex flex-col justify-center items-center gap-1 bg-radial from-[#176639] to-[#239955] text-white rounded-[0.625rem]"
        >
          <h6>Client Balance</h6>
          <p className="text-xs">Check account status</p>
        </Link>

        {/* three */}
        <Link
          to="/staff/dashboard/s-clients"
          className="flex flex-col justify-center items-center gap-1 bg-radial from-[#215AC8] to-[#2F6DE3] text-white rounded-[0.625rem]"
        >
          <div className="flex gap-1 items-center">
            <IoPerson />
            <h6>Find Client</h6>
          </div>
          <p className="text-xs">Search Client Records</p>
        </Link>

        {/* four */}
        <Link
          to="/staff/dashboard/s-stock"
          className="flex flex-col justify-center items-center gap-1 bg-radial from-[#215AC8] to-[#2F6DE3] text-white rounded-[0.625rem]"
        >
          <div className="flex gap-1 items-center">
            <BsBoxSeam />
            <h6>Check Stock</h6>
          </div>
          <p className="text-xs">View Inventory Levels</p>
        </Link>
      </div>
    </div>
  );
};

export default QuickActions;
