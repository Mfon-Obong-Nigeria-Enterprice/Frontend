import React from "react";
import DashboardTitle from "@/components/dashboard/DashboardTitle";
import { IoIosArrowUp } from "react-icons/io";
import { IoIosSearch } from "react-icons/io";

const data = [
  {
    date: "5/19/2025",
    client: "Akpan construction",
    type: "credit",
    amount: "₦150,000",
    balance: "₦150,000",
  },
  {
    date: "5/19/2025",
    client: "Effiong builder",
    type: "partial",
    amount: "-₦50,000",
    balance: "₦100,000",
  },
  {
    date: "5/20/2025",
    client: "Udom properties",
    type: "Debit",
    amount: "-₦100,000",
    balance: "₦0.00",
  },
];

const StaffClients: React.FC = () => {
  return (
    <main className="  bg-[#f5f5f5] p-10 h-full">
      <DashboardTitle
        heading="Clients"
        description="Search, view, and edit client transaction"
      />

      <section className="bg-white rounded-xl mt-5 overflow-hidden border border-[#d9d9d9] min-h-[66vh]">
        <div className="py-4 px-5 bg-white">
          <h3 className="text-xl font-medium text-text-dark">
            Client Directory
          </h3>
        </div>
        {/* search */}
        <div className="flex justify-between items-center px-4 py-5">
          <div className="bg-[#F5F5F5] flex items-center gap-1 w-1/2 px-4 rounded-md">
            <IoIosSearch size={18} />
            <input
              type="search"
              placeholder="Search products, categories..."
              className="py-2 outline-0 w-full"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="bg-[#D9D9D9] flex gap-1 items-center rounded-md py-2 px-4 border border-[#7d7d7d]">
              <span>All status</span>
              <IoIosArrowUp />
            </button>
            <button className="bg-[#D9D9D9] flex gap-1 items-center rounded-md py-2 px-4 border border-[#7d7d7d]">
              <span>All Balances</span>
              <IoIosArrowUp />
            </button>
          </div>
        </div>

        {/* table data */}
        <table className="w-full mt-3 font-Inter">
          <thead className="bg-[#F5F5F5] border border-[#D9D9D9] w-full">
            <tr className="py-5">
              <th className="text-[#333333] text-base font-medium py-2">
                Date
              </th>
              <th className="text-[#333333] text-base font-medium py-2">
                Clients
              </th>
              <th className="text-[#333333] text-base font-medium py-2">
                Type
              </th>
              <th className="text-[#333333] text-base font-medium py-2">
                Amount
              </th>
              <th className="text-[#333333] text-base font-medium py-2">
                Balance
              </th>
              <th className="text-[#333333] text-base font-medium py-2">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((d, i) => (
              <tr key={i} className="border border-[#F0F0F3]">
                <td className="text-center py-3 text-[#444444] text-sm font-normal font-Arial">
                  {d.date}
                </td>
                <td className="text-center py-3 text-[#444444] text-sm font-normal font-Arial">
                  {d.client}
                </td>
                <td className="text-center py-3 text-sm font-normal font-Arial">
                  <span
                    className={`border rounded-[6.25rem] py-1.5 px-3 capitalize ${
                      d.type.toLowerCase() === "credit"
                        ? "border-[#2ECC71] bg-[#C8F9DD] text-[#2ECC71]"
                        : d.type.toLowerCase() === "debit"
                        ? "border-[#F95353] bg-[#FFCACA] text-[#F95353]"
                        : "border-[#FFA500] bg-[#FFE7A4] text-[#FFA500]"
                    }`}
                  >
                    {d.type}
                  </span>
                </td>
                <td
                  className={`text-center py-3 text-sm font-normal font-Arial ${
                    d.amount.includes("-") ? "text-[#F95353]" : "text-[#2ECC71]"
                  }`}
                >
                  {d.amount}
                </td>
                <td
                  className={`text-center py-3 text-sm font-normal font-Arial ${
                    d.balance.startsWith("₦0")
                      ? "text-[#444444]"
                      : "text-[#2ECC71]"
                  }`}
                >
                  {d.balance}
                </td>
                <td className="text-center underline text-[#3D80FF] text-sm font-normal font-Arial">
                  View
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
};

export default StaffClients;
