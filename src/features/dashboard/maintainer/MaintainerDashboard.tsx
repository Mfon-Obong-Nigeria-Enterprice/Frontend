/** @format */

import DashboardTitle from "@/components/dashboard/DashboardTitle";
import Stats, {
  type StatCard,
} from "@/features/dashboard/maintainer/components/Stats";
import { Button } from "@/components/ui/Button";
import OutstandingBalance from "@/features/dashboard/maintainer/components/OutstandingBalance";

const MaintainerDashboard = () => {
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
  const transactionData: Transaction[] = [
    {
      invoice: "INV-2025-001",
      client: "Akpan construction",

      type: "Debit",
      amount: "-₦ 250,000",
      location: "Main Office",
      balance: "-₦ 450,000",
      staff: "John Doe",
      date: "5/25/2025",
      time: "10:00 AM",
    },
    {
      invoice: "INV-2025-002",
      client: "Effion builders",

      type: "Partial",
      amount: "₦ 100,000",
      location: "Warehouse",
      balance: "-₦ 450,000",
      staff: "Jane Smith",
      date: "5/21/2025",
      time: "11:00 AM",
    },
    {
      invoice: "INV-2025-003",
      client: "Udom properties",

      type: "Credit",
      amount: "₦ 75,000",
      location: "Main Office",
      balance: "-₦ 450,000",
      staff: "Mike Johnson",
      date: "5/25/2025",
      time: "10:00 AM",
    },
    {
      invoice: "INV-2025-004",
      client: "Aniekan & sons",

      type: "Debit",
      amount: "-₦ 255,000",
      location: "Warehouse",
      balance: "-₦ 450,000",
      staff: "Sara Wilson",
      date: "5/04/2025",
      time: "10:00 AM",
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
        <h5 className="text-[#1E1E1E] text-xl font-medium py-6 pl-8">
          Recent Transactions
        </h5>
        <table className="w-full">
          <thead className="bg-[#F5F5F5] border border-[#d9d9d9]">
            <tr>
              <th className="py-3 text-base text-[#333333] font-normal text-center">
                Invoice
              </th>
              <th className="py-3 text-base text-[#333333] font-normal text-center">
                Date/Time
              </th>
              <th className="py-3 text-base text-[#333333] font-normal text-center">
                Clients
              </th>
              <th className="py-3 text-base text-[#333333] font-normal text-center">
                Type
              </th>
              <th className="py-3 text-base text-[#333333] font-normal text-center">
                Amount
              </th>
              <th className="py-3 text-base text-[#333333] font-normal text-center">
                Location
              </th>
              <th className="py-3 text-base text-[#333333] font-normal text-center">
                Balance
              </th>
            </tr>
          </thead>
          <tbody>
            {transactionData.map((transaction, i) => {
              return (
                <tr key={i} className="border-b border-[#d9d9d9]">
                  <td className=" text-center text-[#444444] text-sm font-normal py-3">
                    {transaction.invoice}
                  </td>
                  <td className="flex flex-col text-center  font-normal py-3">
                    <span className="text-xs text-[#444444]">
                      {" "}
                      {transaction.date}
                    </span>
                    <span className="text-[0.625rem] text-[#7D7D7D]">
                      {" "}
                      {transaction.time}
                    </span>
                  </td>
                  <td className=" text-center text-[#444444] text-sm font-normal py-3">
                    {transaction.client}
                  </td>
                  <td className="text-center">
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
                    className={`text-sm text-center ${
                      transaction.amount.includes("-")
                        ? "text-[#F95353]"
                        : "text-[#2ECC71]"
                    }`}
                  >
                    {transaction.amount}
                  </td>
                  <td className={`text-sm text-center ${"text-[#444444]"}`}>
                    {transaction.location}
                  </td>
                  <td
                    className={`text-sm text-center ${
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
        <div className="flex justify-between items-center bg-[#f0f0f3] mt-[2dvh] mb-2">
          <div>
            <Button
              onClick={() => navigate("/maintainer/dashboard/clients")}
              text="View all Balances"
              variant="outline"
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[60fr_40fr] gap-5 mt-5"></div>
      <OutstandingBalance />
    </main>
  );
};

export default MaintainerDashboard;
