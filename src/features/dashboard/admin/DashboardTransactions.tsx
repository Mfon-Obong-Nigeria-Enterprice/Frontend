import DashboardTitle from "@/components/dashboard/DashboardTitle";
import { Search, ChevronUp, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type Transaction = {
  invoice: string;
  client: string;
  type: "Debit" | "Credit" | "Partial";
  amount: string;
  balance: string;
  staff: string;
  date: string;
  time: string;
};

const transactionData: Transaction[] = [
  {
    invoice: "INV-2025-001",
    client: "Akpan construction",

    type: "Debit",
    amount: "-₦ 250,000",
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
    balance: "-₦ 200,000",
    staff: "Jane Smith",
    date: "5/21/2025",
    time: "11:00 AM",
  },
  {
    invoice: "INV-2025-003",
    client: "Udom properties",

    type: "Credit",
    amount: "₦ 75,000",
    balance: "-₦750,000",
    staff: "Mike Johnson",
    date: "5/25/2025",
    time: "10:00 AM",
  },
  {
    invoice: "INV-2025-004",
    client: "Aniekan & sons",

    type: "Debit",
    amount: "-₦ 255,000",
    balance: "₦0.00",
    staff: "Sara Wilson",
    date: "5/04/2025",
    time: "10:00 AM",
  },
];

const DashboardTransactions = () => {
  return (
    <main className="space-y-4">
      <DashboardTitle
        heading="Transaction Management"
        description="Track all sales payment & client account activities"
      />
      <div className="flex justify-between gap-10 items-center">
        {/* search */}
        <div className="relative bg-white max-w-lg w-full flex items-center gap-1 md:w-1/2 px-4 rounded-md border border-[#d9d9d9]">
          <Search size={18} className="text-gray-400" />
          <input
            type="search"
            placeholder="Search by invoice..."
            // onChange={(e) => debouncedSearch(e.target.value)}
            className="py-2 outline-0 w-full"
          />
          {/* {searchQuery && (
            <div className="absolute top-full left-0 z-50 bg-white border rounded-md shadow-md w-full min-h-24">
              {suggestions.length > 0 ? (
                suggestions.map((suggestion, i) => (
                  <p
                    key={i}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  >
                    {suggestion.item.name}{" "}
                    <span className="text-xs text-gray-500">
                      (category: {suggestion.item.categoryId?.name})
                    </span>
                  </p>
                ))
              ) : (
                <p className="p-4 italic text-center text-gray-500">
                  No matching products found for{" "}
                  <span className="text-gray-700">"{searchQuery}"</span>
                </p>
              )}
            </div>
          )} */}
        </div>

        <div className="flex items-center gap-4">
          <Button className="w-50 h-10 bg-white text-base text-[#444444] border border-[#7d7d7d]">
            Download Excel
          </Button>
          <Button className="w-40 h-10 text-base">Export PDF</Button>
        </div>
      </div>
      <div className="flex gap-4 ">
        <Button
          variant="secondary"
          className="bg-[#d9d9d9] h-10 w-40 text-[#444444] border border-[#7D7D7D] justify-between"
        >
          <span>Clients Filter</span>
          <ChevronUp />
        </Button>
        <Button
          variant="secondary"
          className="bg-[#d9d9d9] h-10 w-40 text-[#444444] border border-[#7D7D7D] justify-between"
        >
          <span>Date Range</span>
          <ChevronUp />
        </Button>
        <Button
          variant="secondary"
          className="bg-[#d9d9d9] h-10 w-40 text-[#444444] border border-[#7D7D7D] justify-between"
        >
          <span>Transaction Type</span>
          <ChevronUp />
        </Button>
      </div>

      <div className="bg-white border mt-7 rounded-xl shadow-xl">
        <h5 className="text-[#1E1E1E] text-xl font-medium py-6 pl-8">
          All Transactions
        </h5>
        <table className="w-full">
          <thead className="bg-[#F5F5F5] border border-[#d9d9d9]">
            <tr>
              <th className="py-3 text-base text-[#333333] font-normal text-center">
                Invoice
              </th>
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
        <div className="h-16 bg-[#f5f5f5] text-sm text-[#7D7D7D] flex justify-center items-center gap-3 rounded-b-[0.625rem] ">
          <span className="border border-[#d9d9d9] rounded">
            <ChevronLeft size={14} />
          </span>
          Page 1 of 1
          <span className="border border-[#d9d9d9] rounded">
            <ChevronRight size={14} />
          </span>
        </div>
      </div>
    </main>
  );
};

export default DashboardTransactions;
