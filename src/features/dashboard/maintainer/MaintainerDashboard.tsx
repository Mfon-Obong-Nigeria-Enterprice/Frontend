/** @format */

import DashboardTitle from "@/features/dashboard/shared/DashboardTitle";
import Stats, {
  type StatCard,
} from "@/features/dashboard/maintainer/components/Stats";
import { Button } from "@/components/ui/button";
import OutstandingBalance from "@/features/dashboard/maintainer/components/OutstandingBalance";
import { MdKeyboardArrowRight } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { SystemHealth } from "./components/SystemHealth";



const MaintainerDashboard = () => {
  const navigate = useNavigate();
  const stats: StatCard[] = [
    {
      heading: "Total Sales (Today)",
      salesValue: "₦ 135,500",
      statValue: "15% from yesterday",
      color: "green",
    },
    {
      heading: "Monthly Revenue",
      salesValue: "₦ 446,850",
      statValue: "8% from last month",
      color: "green",
    },
    {
      heading: "Outstanding balances",
      salesValue: "₦ 1,355,800",
      statValue: "5 Clients with overdue balances",
      color: "orange",
    },
  ];
  const transactionData = [
    {
      invoice: "INV-2025-001",
      date: "5/19/2025",
      time: "11:40 AM",
      items: "5x Nails",
      type: "Debit",
      amount: "-₦12,750",
      location: "Main Office",
      balance: "₦0.00",
    },
    {
      invoice: "INV-2025-002",
      date: "5/19/2025",
      time: "11:25 AM",
      items: "10x Cement",
      type: "Credit",
      amount: "+₦150,000",
      location: "Warehouse",
      balance: "+₦150,000",
    },
    {
      invoice: "WB-2025-003",
      date: "5/19/2025",
      time: "9:15 AM",
      items: "25x Steel Rods",
      type: "Partial",
      amount: "+₦225,000",
      location: "Main Office",
      balance: "-₦5,000",
    },
    {
      invoice: "INV-2025-004",
      date: "5/19/2025",
      time: "8:10 AM",
      items: "3x Nails",
      type: "Debit",
      amount: "-₦7,500",
      location: "Warehouse",
      balance: "₦0.00",
    },
  ];
  return (
    <main>
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-4 mb-7">
        <DashboardTitle
          heading="Maintainer's Dashboard"
          description="Welcome back, Maintainer! Here's an overview of your business"
        />
      </div>
      <Stats data={stats} />
      <div className="bg-white border mt-7 rounded-xl shadow-xl mx-2 px-2">
        <h5 className="text-[#1E1E1E] text-xl font-medium py-6 pl-7">
          Recent Transactions
        </h5>
        <table className="w-full pl-4">
          <thead className="bg-[#F5F5F5] border border-[#d9d9d9] text-left pl-8">
            <tr>
              <th className="py-3 text-base text-[#333333] font-normal pl-4">
                Invoice
              </th>
              <th className="py-3 text-base text-[#333333] font-normal pl-4">
                Date/Time
              </th>
              <th className="py-3 text-base text-[#333333] font-normal pl-4">
                Items
              </th>
              <th className="py-3 text-base text-[#333333] font-normal pl-4">
                Type
              </th>
              <th className="py-3 text-base text-[#333333] font-normal pl-4">
                Amount
              </th>
              <th className="py-3 text-base text-[#333333] font-normal pl-4">
                Location
              </th>
              <th className="py-3 text-base text-[#333333] font-normal pl-4">
                Balance
              </th>
            </tr>
          </thead>
          <tbody className="pl-4">
            {transactionData.map((transaction, i) => {
              return (
                <tr key={i} className="border-b border-[#d9d9d9]">
                  <td className="text-[#444444] text-sm font-normal py-3 pl-4">
                    {transaction.invoice}
                  </td>
                  <td className="flex flex-col font-normal py-3 pl-4">
                    <span className="text-xs text-[#444444]">
                      {" "}
                      {transaction.date}
                    </span>
                    <span className="text-[0.625rem] text-[#7D7D7D]">
                      {" "}
                      {transaction.time}
                    </span>
                  </td>
                  <td className="text-[#444444] text-sm font-normal py-3 pl-4">
                    {transaction.items}
                  </td>
                  <td className="pl-4">
                    <span
                      className={`border text-sm py-1.5 px-3 rounded-[6.25rem] ${
                        transaction.type === "Debit"
                          ? "border-[#F95353] bg-[#FFCACA] text-[#F95353]"
                          : transaction.type === "Credit"
                          ? "border-[#2ECC71] bg-[#C8F9DD] text-[#2ECC71]"
                          : "border-[#FFA500] bg-[#FFE7A4] text-[#FFA500]"
                      }`}
                    >
                      {transaction.type}
                    </span>
                  </td>

                  <td
                    className={`text-sm pl-4  ${
                      transaction.amount.includes("-")
                        ? "text-[#F95353]"
                        : "text-[#2ECC71]"
                    }`}
                  >
                    {transaction.amount}
                  </td>
                  <td className="text-sm pl-4 text-[#444444]">
                    {transaction.location}
                  </td>
                  <td
                    className={`text-sm pl-4  ${
                      transaction.balance.includes("-")
                        ? "text-[#F95353]"
                        : transaction.balance.startsWith("₦0")
                        ? "text-[#444444]"
                        : "text-[#2ECC71]"
                    }`}
                  >
                    {transaction.balance}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="flex justify-between items-center bg-[#f0f0f3] mt-[2dvh] mb-3">
          <div>
            <Button
              onClick={() => navigate("/maintainer/dashboard/clients")}
              variant="outline"
              size={"lg"}
              className="text-[#3D80FF] text-base "
            >
              View all Balances
            </Button>
          </div>
          <MdKeyboardArrowRight size={24} className="mr-5 text-[#3D80FF]" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[60fr_40fr] gap-5 mt-5"></div>
       <SystemHealth/>
     
      <OutstandingBalance />
    </main>
  );
};

export default MaintainerDashboard;
