import React from "react";
import { MoveRight, MoveLeft } from "lucide-react";

type Transaction = {
  client: string;
  type: "Debit" | "Credit" | "Partial";
  amount: string;
  balance: string;
  staff: string;
  date: string;
};

const transactionData: Transaction[] = [
  {
    client: "Akpan construction",

    type: "Debit",
    amount: "-₦ 250,000",
    balance: "-₦ 450,000",
    staff: "John Doe",
    date: "5/25/2025",
  },
  {
    client: "Effion builders",

    type: "Partial",
    amount: "₦ 100,000",
    balance: "-₦ 200,000",
    staff: "Jane Smith",
    date: "5/21/2025",
  },
  {
    client: "Udom properties",

    type: "Credit",
    amount: "₦ 75,000",
    balance: "-₦750,000",
    staff: "Mike Johnson",
    date: "5/25/2025",
  },
  {
    client: "Aniekan & sons",

    type: "Debit",
    amount: "-₦ 255,000",
    balance: "₦0.00",
    staff: "Sara Wilson",
    date: "5/04/2025",
  },
];
const ClientDirectory: React.FC = () => {
  return (
    <div className="mt-7">
      <table className="w-full">
        <thead className="bg-[#F5F5F5] border border-[#d9d9d9]">
          <tr>
            <th className="py-3 text-base text-[#333333] font-normal text-center">
              Date
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
              Balance
            </th>
            <th className="py-3 text-base text-[#333333] font-normal text-center">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {transactionData.map((transaction, i) => {
            return (
              <tr key={i} className="border-b border-[#d9d9d9]">
                <td className=" text-center text-[#7D7D7D] text-sm font-normal py-3">
                  {transaction.date}
                </td>
                <td className=" text-center text-[#7D7D7D] text-sm font-normal py-3">
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

                <td className="text-center underline text-[#3D80FF] text-sm">
                  View
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="h-16 bg-[#f5f5f5] flex justify-center items-center gap-3 rounded-b-[0.625rem] ">
        <MoveLeft />
        Page 1 of 1
        <MoveRight />
      </div>
    </div>
  );
};

export default ClientDirectory;
