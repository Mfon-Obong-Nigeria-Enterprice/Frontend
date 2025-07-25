/** @format */

import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

type Transaction = {
  invoice: string;
  dateTime: string;
  items: string;
  type: "Debit" | "Credit" | "Partial";
  amount: string;
  location: string;
  balance: string;
};

const transactionData: Transaction[] = [
  {
    invoice: "INV-2025-001",
    dateTime: "5/19/2025 11:40 AM",
    items: "5x Nails",
    type: "Debit",
    amount: "-N12,750",
    location: "Main Office",
    balance: "N0,00",
  },
  {
    invoice: "INV-2025-002",
    dateTime: "5/19/2025 11:25 AM",
    items: "10x Cement",
    type: "Credit",
    amount: "+N150,000",
    location: "warehouse",
    balance: "+N150,000",
  },
  {
    invoice: "INV-2025-003",
    dateTime: "5/19/2025 9:15 AM",
    items: "25x Steel Rods",
    type: "Partial",
    amount: "+N225,000",
    location: "Main Office",
    balance: "-N5,000",
  },
  {
    invoice: "INV-2025-004",
    dateTime: "5/19/2025 8:10 AM",
    items: "3x Nails",
    type: "Debit",
    amount: "-N7,500",
    location: "warehouse",
    balance: "N0.00",
  },
];

const RecentTransactions = () => {
  return (
    <div className="py-14">
      <main className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Recent Transaction
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="border-b border-gray-200">
                <th className="py-3 text-base text-[#333333] font-normal text-center">
                  Invoice
                </th>
                <th className="py-3 text-base text-[#333333] font-normal text-center">
                  Date/Time
                </th>
                <th className="py-3 text-base text-[#333333] font-normal text-center">
                  Items
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
              {transactionData.map((transaction, i) => (
                <tr key={i} className="border-b border-[#d9d9d9]">
                  <td className="text-center text-[#444444] text-sm font-normal py-3">
                    {transaction.invoice}
                  </td>

                  <td className="text-center text-[#444444] text-sm font-normal py-3">
                    {transaction.dateTime}
                  </td>

                  <td className="flex items-center justify-center text-[#444444] text-sm font-normal py-3">
                    {transaction.items}
                    {transaction.items.includes("Nails") && (
                      <ChevronDown size={16} className="ml-1 text-gray-400" />
                    )}
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
                      transaction.amount.startsWith("-")
                        ? "text-[#F95353]"
                        : "text-[#2ECC71]"
                    }`}
                  >
                    {transaction.amount}
                  </td>

                  <td className="text-center text-[#444444] text-sm font-normal py-3">
                    {transaction.location}
                  </td>

                  <td
                    className={`text-sm text-center ${
                      transaction.balance.startsWith("-")
                        ? "text-[#F95353]"
                        : transaction.balance.startsWith("+")
                        ? "text-[#2ECC71]"
                        : "text-[#444444]"
                    }`}
                  >
                    {transaction.balance}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className=" w-full flex items-center justify-between px-4 py-2 border">
          <Button
            variant="link"
            className="text-blue-600 hover:text-blue-800 font-medium mt-4 flex justify-between  w-full"
          >
            View All Balances
            <ChevronRight size={10} className="text-gray-500 w-4 h-4" />
          </Button>
        </div>
      </main>
    </div>
  );
};

export default RecentTransactions;
