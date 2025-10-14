import React from "react";
import { Link } from "react-router-dom";

// import { MdOutlineShoppingBag } from "react-icons/md";
// import { HiUsers } from "react-icons/hi2";
// import { RiWallet2Line } from "react-icons/ri";
// import { BsBoxSeam } from "react-icons/bs";

const QuickActions: React.FC = () => {
  return (
    <div className="hidden lg:block bg-white rounded-2xl mb-8 ">
      <h4 className="text-lg text-[var(--cl-text-dark)] pl-4 pt-3 font-medium mb-3">
        Quick Actions
      </h4>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 ">
        <div>
          <Link to="/staff/dashboard/new-sales">
            <img
              src="/images/NewSales.svg"
              alt="Image 1"
              className="w-full h-auto rounded-lg hover:opacity-80 transition"
            />
          </Link>
        </div>
        <div>
          <Link to="/staff/dashboard/s-clients">
            <img
              src="/images/ClientBalance.svg"
              alt="Image 2"
              className="w-full h-auto rounded-lg hover:opacity-80 transition"
            />
          </Link>
        </div>
        <div>
          {" "}
          <Link to="/staff/dashboard/s-clients">
            <img
              src="/images/FindClient.svg"
              alt="Image 3"
              className="w-full h-auto rounded-lg hover:opacity-80 transition"
            />
          </Link>
        </div>
        <div>
          <Link to="/staff/dashboard/s-stock">
            <img
              src="/images/CheckStock.svg"
              alt="Image 4"
              className="w-full h-auto rounded-lg hover:opacity-80 transition"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
