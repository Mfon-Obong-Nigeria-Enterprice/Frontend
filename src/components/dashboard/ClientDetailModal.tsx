/** @format */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";
import { X, MapPin, Phone } from "lucide-react";

type Props = {
  setOpenModal: (value: boolean) => void;
};

type Transaction = {
  method: string;
  items: string[];
  type: "Debit" | "Credit" | "Partial";
  amount: string;
  date: string;
  time: string;
};
const invoiceData = [
  {
    invoice: "INV-2025-001",
    transactionDate: "5/21/2025",
    dueDate: "6/21/2025",
    amount: "-₦ 200,000",
    status: "14",
  },
  {
    invoice: "INV-2025-002",
    transactionDate: "5/25/2025",
    dueDate: "8/15/2025",
    amount: "-₦ 250,000",
    status: "13",
  },
];

const transactionData: Transaction[] = [
  {
    method: "Bank transfer",
    items: ["10x cement", "4x Nails"],
    type: "Debit",
    amount: "-₦ 250,000",
    date: "5/25/2025",
    time: "10:45 AM",
  },
  {
    method: "Check payment",
    items: [
      "10 bags of cement",
      "10x 8MM long rod",
      "15x nails",
      "20x 4mm rod",
      "10x 6mm rod",
    ],
    type: "Partial",
    amount: "₦ 100,000",
    date: "5/21/2025",
    time: "02:30 PM",
  },
  {
    method: "Cash",
    items: ["10x cement"],
    type: "Credit",
    amount: "₦ 75,000",
    date: "5/18/2025",
    time: "09:45 AM",
  },
];

const ClientDetailModal = ({ setOpenModal }: Props) => {
  const navigate = useNavigate();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  // absolute top-5 left-[60%] -translate-x-1/2
  return (
    <div className="fixed top-0 left-0 w-full h-screen z-50 flex justify-center items-center bg-[rgba(0,0,0,0.5)]">
      <div className="max-w-[50rem] w-[90%] max-h-[90vh] overflow-y-auto rounded-[0.625rem] bg-white font-Inter">
        <div className="flex justify-between items-center px-7 py-2">
          <h5 className="text-lg text-text-dark font-medium">
            Client Account Detail
          </h5>
          <button
            onClick={() => setOpenModal(false)}
            className="bg-transparent hover:bg-gray-200 text-text-dark px-3 py-1 rounded"
          >
            <X size={14} />
          </button>
        </div>

        {/* main */}
        <div className="border-y border-[#d9d9d9] px-7">
          {/* overview */}
          <div
            className={`flex justify-between border border-l-[6px] border-[#DA251C] bg-[#FFE9E9] mt-7 mb-5 p-3 rounded-[0.875rem]`}
          >
            <div className="flex flex-col gap-1">
              <p className="text-[#444444] font-medium">Okoro builders</p>
              <address className="flex gap-0.5 items-center text-[#444444] text-sm">
                <MapPin size={14} />
                <span>124 Abak Road (warehouse 3)</span>
              </address>
              <p className="flex gap-1 items-center text-[#444444] text-sm">
                <Phone size={14} />
                <span>080 1234 5678</span>
              </p>
            </div>
            <div>
              <p className="font-normal text-base text-[#F95353]">-₦ 450,000</p>
              <div className="bg-[#FFE7A4] py-2 px-2.5 rounded mt-1">
                <p className="text-[#444444CC] text-[0.625rem]">
                  30 days overdue
                </p>
              </div>
            </div>
          </div>

          {/* outstanding invoices */}
          <div className="py-2 border-b border-[#d9d9d9]">
            <h5 className="font-medium text-[#333333]">Outstanding Invoices</h5>
          </div>

          <table className="w-full mt-7">
            <thead className="bg-[#F5F5F5]">
              <tr>
                <th className="py-1.5 text-sm text-[#333333] font-normal text-center">
                  Invoice #
                </th>
                <th className="py-1.5 text-sm text-[#333333] font-normal text-center">
                  Transaction date
                </th>
                <th className="py-1.5 text-sm text-[#333333] font-normal text-center">
                  Due date
                </th>
                <td className="py-1.5 text-sm text-[#333333] font-normal text-center">
                  Amount
                </td>
                <td className="py-1.5 text-sm text-[#333333] font-normal text-center">
                  Status
                </td>
              </tr>
            </thead>
            <tbody>
              {invoiceData.map((invoice) => (
                <tr className="border-b border-[#d9d9d9]">
                  <td className="text-[#333333] text-xs text-center py-1">
                    {invoice.invoice}
                  </td>
                  <td className="text-[#333333] text-xs text-center py-1">
                    {invoice.transactionDate}
                  </td>
                  <td className="text-[#333333] text-xs text-center py-1">
                    {invoice.dueDate}
                  </td>
                  <td className="text-[#333333] text-xs text-center py-1">
                    {invoice.amount}
                  </td>
                  <td className="text-[#333333] text-xs text-center py-1">
                    {invoice.status} days late
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* transaction history */}
          <div className="mt-6">
            <div className="flex justify-between items-center border-b py-2">
              <h5 className="text-base text-[#333333] font-medium">
                Recent Transaction History
              </h5>
              <p className="text-sm text-[#444444]">Last 2 Transaction</p>
            </div>

            {/* details */}
            <ul className="flex flex-col gap-3 mt-4 pb-5">
              {transactionData.map((transaction, i) => {
                const isExpanded = expandedIndex === i;
                const items = transaction.items || [];

                const visibleItems = isExpanded
                  ? items
                  : items.length === 1
                  ? items
                  : items.slice(0, 2); // show 1 or 2 items when collapsed

                const hiddenCount = isExpanded
                  ? 0
                  : items.length - visibleItems.length;

                return (
                  <li
                    key={i}
                    className="grid grid-cols-[50fr_30fr_30fr_5fr] items-center gap-3 border border-[#d9d9d9] rounded-[8px] px-2 py-2.5"
                  >
                    <div className="flex flex-col text-xs">
                      <p className="text-[#333333]">{transaction.method}</p>

                      <div className="flex flex-wrap items-center">
                        <span className="text-[0.625rem] truncate">
                          {visibleItems.join(", ")}
                        </span>
                        {!isExpanded && hiddenCount > 0 && (
                          <button
                            onClick={() => toggleExpand(i)}
                            className="ml-1 text-[#7d7d7d] text-[0.6rem] underline italic"
                          >
                            +{hiddenCount} more
                          </button>
                        )}
                        {isExpanded && items.length > 2 && (
                          <button
                            onClick={() => toggleExpand(i)}
                            className="ml-1 text-[#7d7d7d] text-[0.6rem] underline italic"
                          >
                            less
                          </button>
                        )}
                      </div>
                    </div>

                    <p>
                      <span
                        className={`border text-xs py-1.5 px-3 rounded-[6.25rem] ${
                          transaction.type === "Debit"
                            ? "border-[#F95353] bg-[#FFCACA] text-[#F95353]"
                            : transaction.type === "Credit"
                            ? "border-[#2ECC71] bg-[#C8F9DD] text-[#2ECC71]"
                            : "border-[#FFA500] bg-[#FFE7A4] text-[#FFA500]"
                        }`}
                      >
                        {transaction.type}
                      </span>
                    </p>

                    <p
                      className={`text-sm ${
                        transaction.amount.includes("-")
                          ? "text-[#F95353]"
                          : "text-[#2ECC71]"
                      }`}
                    >
                      {transaction.amount}
                    </p>

                    <div className="flex flex-col justify-center text-[#7D7D7D] text-[0.625rem]">
                      <p>{transaction.date}</p>
                      <p>{transaction.time}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        <div className="flex justify-end gap-4 my-4 mx-7">
          <Button className="bg-[#FFC761] hover:bg-[#FFA500] text-text-dark">
            Send Payment Reminder
          </Button>
          <Button
            onClick={() => navigate("/client-details")}
            className="bg-[#2ECC71] hover:bg-[var(--cl-bg-green-hover)] text-white"
          >
            View Full Account
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ClientDetailModal;
