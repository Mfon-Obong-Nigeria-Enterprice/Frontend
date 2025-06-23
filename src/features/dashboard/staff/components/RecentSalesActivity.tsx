import React from "react";
import { Link } from "react-router-dom";
import { MdKeyboardArrowRight, MdKeyboardArrowDown } from "react-icons/md";

// type Props = {
//   client: string;
//   amount: string | number;
//   time: string;
// };

const Sales = [
  {
    client: "Walk-in client",
    amount: "-₦ 12,750",
    time: "11:40 AM",
    products: ["5x Nails"],
  },
  {
    client: "Akpan construction",
    amount: "₦ 150,000",
    time: "11:25 AM",
    products: ["10x Cement"],
  },
  {
    client: "Ade properties",
    amount: "₦ 225,000",
    time: "09:15 AM",
    products: ["25x Steel rods"],
  },
  {
    client: "Walk-in client",
    amount: "-₦ 7,500",
    time: "08:10 AM",
    products: ["3x Nails"],
  },
];

const RecentSalesActivity: React.FC = () => {
  return (
    <div className="bg-white rounded-[0.625rem] border border-[#D9D9D9] py-1 font-Inter">
      <div className="flex justify-between items-center p-4">
        <h5 className=" font-medium text-[var(--cl-text-dark)] text-lg">
          Your Recent Sales Activity
        </h5>
        <Link
          to="/staff/dashboard/s-sales"
          className="flex gap-1 items-center text-[#3D80FF]"
        >
          <span>View all Sales</span>
          <MdKeyboardArrowRight />
        </Link>
      </div>

      {/* sales data */}
      <div>
        {Sales.map((sale, i) => (
          <div key={i} className="p-4 border-t border-[#D9D9D9]">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[#333333] mb-2">{sale.client}</p>
                {sale.products && (
                  <div className="p-2 border rounded border-[#D9D9D9] w-fit flex gap-1 items-center">
                    <p className="text-[#444444B2] text-sm">{sale.products}</p>
                    <MdKeyboardArrowDown />
                  </div>
                )}
              </div>
              <div className="flex gap-1.5 items-center">
                <p
                  className={`text-sm font-semibold ${
                    sale.amount.includes("-")
                      ? "text-[#F95353]"
                      : "text-[#2ECC71]"
                  }`}
                >
                  {sale.amount}
                </p>
                <span className="text-xs text-[var(--cl-secondary)]">
                  {sale.time}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* pagination
       */}
      <div className="flex justify-center items-center border-t border-[#D9D9D9] p-5">
        Page 1 of 1
      </div>
    </div>
  );
};

export default RecentSalesActivity;
