import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardTitle from "@/components/dashboard/DashboardTitle";
import { useClients } from "@/hooks/useClients";
import usePagination from "@/hooks/usePagination";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
// import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import { Button } from "@/components/ui/Button";
import Stats from "./components/Stats";
import type { StatCard } from "@/types/stats";
import type { TransactionItem } from "@/types/types";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Transactionprops {
  searchTerm: string;
}

const stats: StatCard[] = [
  {
    heading: "Total Sales (Today)",
    salesValue: 450000,
    format: "currency",
    hideArrow: true,
  },
  {
    heading: "Payments Received",
    salesValue: 300000,
    format: "currency",
    hideArrow: true,
    salesColor: "green",
  },
  {
    heading: "Outstanding balance",
    salesValue: 150000,
    format: "currency",
    hideArrow: true,
    salesColor: "orange",
  },
  {
    heading: "Total transactions",
    salesValue: 10,
    hideArrow: true,
  },
];

const DashboardTransactions: React.FC<Transactionprops> = ({ searchTerm }) => {
  const navigate = useNavigate();
  const { data: clients = [] } = useClients();
  const [searchInput, setSearchInput] = useState("");

  // Debug logs
  console.log("🔍 DEBUG - Clients data:", clients);
  console.log("🔍 DEBUG - Search term:", searchTerm);

  // Flatten all transactions from all clients into a single array
  const allTransactions = useMemo(() => {
    const transactions: Array<
      TransactionItem & { clientName: string; clientId: string }
    > = [];

    clients.forEach((client) => {
      if (client.transactions && Array.isArray(client.transactions)) {
        client.transactions.forEach((transaction) => {
          transactions.push({
            ...transaction,
            clientName: client.name,
            clientId: client._id,
          });
        });
      }
    });

    // Sort by date (most recent first)
    return transactions.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [clients]);

  console.log("🔍 DEBUG - All transactions:", allTransactions);

  // Filter transactions based on search term
  const filteredTransactions = useMemo(() => {
    if (!searchTerm && !searchInput) return allTransactions;

    const searchQuery = searchTerm || searchInput;
    return allTransactions.filter((transaction) => {
      const invoiceId = generateInvoiceNumber(
        transaction._id
        // Stransaction.date
      );
      return (
        invoiceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.clientName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [allTransactions, searchTerm, searchInput]);

  console.log("🔍 DEBUG - Filtered transactions:", filteredTransactions);

  const {
    currentPage,
    totalPages,
    goToPreviousPage,
    goToNextPage,
    canGoPrevious,
    canGoNext,
  } = usePagination(filteredTransactions.length, 5);

  // Get current page transactions
  const currentTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * 5;
    const endIndex = startIndex + 5;
    return filteredTransactions.slice(startIndex, endIndex);
  }, [filteredTransactions, currentPage]);

  // Helper function to format currency
  const formatCurrency = (amount: number) => `₦${amount.toLocaleString()}`;

  // Helper function to get transaction type display
  const getTransactionTypeDisplay = (type: string) => {
    switch (type.toUpperCase()) {
      case "PURCHASE":
        return "Debit";
      case "DEPOSIT":
        return "Credit";
      default:
        return type;
    }
  };

  // Helper function to get transaction type styles
  const getTransactionTypeStyles = (type: string) => {
    switch (type.toUpperCase()) {
      case "PURCHASE":
        return "border-[#F95353] bg-[#FFCACA] text-[#F95353]";
      case "DEPOSIT":
        return "border-[#2ECC71] bg-[#C8F9DD] text-[#2ECC71]";
      default:
        return "border-[#FFA500] bg-[#FFE7A4] text-[#FFA500]";
    }
  };

  // Helper function to get amount color
  const getAmountColor = (type: string) => {
    switch (type.toUpperCase()) {
      case "PURCHASE":
        return "text-[#F95353]";
      case "DEPOSIT":
        return "text-[#2ECC71]";
      default:
        return "text-[#444444]";
    }
  };

  // Helper function to get balance color
  const getBalanceColor = (balance: number) => {
    if (balance > 0) return "text-[#2ECC71]"; // Green for positive
    if (balance < 0) return "text-[#F95353]"; // Red for negative
    return "text-[#444444]"; // Gray for zero
  };

  // Helper function to generate invoice number
  const generateInvoiceNumber = (
    id: string
    // transactionDate?: string
  ): string => {
    const currentYear = new Date().getFullYear();
    const shortId = id.slice(-6).toUpperCase(); // Last 6 characters
    return `INV-${currentYear}-${shortId}`;
  };

  // Alternative: Generate shorter, more readable invoice
  // const generateShortInvoice = (id: string): string => {
  //   return `INV-${id.slice(-5).toUpperCase()}`;
  // };

  return (
    <main className="space-y-4">
      <DashboardTitle
        heading="Transaction Management"
        description="Track all sales payment & client account activities"
      />
      <Stats data={stats} />

      <div className="flex justify-between gap-10 items-center">
        {/* search */}
        <div className="relative bg-white max-w-lg w-full flex items-center gap-1 md:w-1/2 px-4 rounded-md border border-[#d9d9d9]">
          <Search size={18} className="text-gray-400" />
          <input
            type="search"
            placeholder="Search by invoice or client name..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="py-2 outline-0 w-full"
          />
        </div>

        <div className="flex items-center gap-4">
          <Button className="w-50 h-10 bg-white text-base text-[#444444] border border-[#7d7d7d]">
            Download Excel
          </Button>
          <Button className="w-40 h-10 text-base">Export PDF</Button>
        </div>
      </div>

      <div className="flex gap-4">
        <Select>
          <SelectTrigger className="bg-[#d9d9d9] h-10 w-40 text-[#444444] border border-[#7D7D7D] justify-between">
            <SelectValue placeholder="Client Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All Clients</SelectItem>
              {clients.map((client) => (
                <SelectItem key={client._id} value={client._id}>
                  {client.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="bg-[#d9d9d9] h-10 w-40 text-[#444444] border border-[#7D7D7D] justify-between">
            <SelectValue placeholder="Date Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="bg-[#d9d9d9] h-10 w-40 text-[#444444] border border-[#7D7D7D] justify-between">
            <SelectValue placeholder="Transaction Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="PURCHASE">Debit</SelectItem>
              <SelectItem value="DEPOSIT">Credit</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white border mt-7 rounded-xl shadow-xl">
        <h5 className="text-[#1E1E1E] text-xl font-medium py-6 pl-8">
          All Transactions ({filteredTransactions.length})
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
                Client
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
            {currentTransactions.length > 0 ? (
              currentTransactions.map((transaction) => (
                <tr
                  key={`${transaction.clientId}-${transaction._id}`}
                  className="border-b border-[#d9d9d9]"
                >
                  <td className="text-center text-[#444444] text-sm font-normal py-3">
                    {generateInvoiceNumber(transaction._id, transaction.date)}
                  </td>

                  <td className="text-center text-[#444444] text-sm font-normal py-3">
                    <div className="flex flex-col">
                      <span className="text-xs text-[#444444]">
                        {new Date(transaction.date).toLocaleDateString()}
                      </span>
                      <span className="text-[0.625rem] text-[#7D7D7D]">
                        {new Date(transaction.date).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </td>

                  <td className="text-center text-[#444444] text-sm font-normal py-3">
                    {transaction.clientName}
                  </td>

                  <td className="text-center py-3">
                    <span
                      className={`border text-sm py-1.5 px-3 rounded-[6.25rem] ${getTransactionTypeStyles(
                        transaction.type
                      )}`}
                    >
                      {getTransactionTypeDisplay(transaction.type)}
                    </span>
                  </td>

                  <td
                    className={`text-center text-sm py-3 ${getAmountColor(
                      transaction.type
                    )}`}
                  >
                    {transaction.type.toUpperCase() === "PURCHASE" ? "-" : ""}
                    {formatCurrency(transaction.amount)}
                  </td>

                  <td
                    className={`text-center text-sm py-3 ${getBalanceColor(
                      clients.find((c) => c._id === transaction.clientId)
                        ?.balance || 0
                    )}`}
                  >
                    {formatCurrency(
                      Math.abs(
                        clients.find((c) => c._id === transaction.clientId)
                          ?.balance || 0
                      )
                    )}
                  </td>

                  <td
                    onClick={() =>
                      navigate(`/clients-details/${client._id}`)
                    }
                    className="text-center underline text-[#3D80FF] text-sm py-3 cursor-pointer"
                  >
                    View
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-500">
                  {filteredTransactions.length === 0 &&
                  allTransactions.length === 0
                    ? "No transactions found"
                    : "No transactions match your search criteria"}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="h-16 bg-[#f5f5f5] text-sm text-[#7D7D7D] flex justify-center items-center gap-3 rounded-b-[0.625rem]">
            <button
              onClick={goToPreviousPage}
              disabled={!canGoPrevious}
              className={`border border-[#d9d9d9] rounded p-1 ${
                canGoPrevious
                  ? "cursor-pointer hover:bg-gray-100"
                  : "opacity-50 cursor-not-allowed"
              }`}
            >
              <ChevronLeft size={14} />
            </button>

            <span>
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={goToNextPage}
              disabled={!canGoNext}
              className={`border border-[#d9d9d9] rounded p-1 ${
                canGoNext
                  ? "cursor-pointer hover:bg-gray-100"
                  : "opacity-50 cursor-not-allowed"
              }`}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default DashboardTransactions;
// import React, { useMemo, useState } from "react";
// import DashboardTitle from "@/components/dashboard/DashboardTitle";
// import { useClients } from "@/hooks/useClients";
// import usePagination from "@/hooks/usePagination";
// import { Search, ChevronUp, ChevronLeft, ChevronRight } from "lucide-react";
// import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
// import { Button } from "@/components/ui/Button";
// import Stats from "./components/Stats";
// import type { StatCard } from "@/types/stats";
// import type { TransactionItem } from "@/types/types";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// interface Transactionprops {
//   searchTerm: string;
// }

// const stats: StatCard[] = [
//   {
//     heading: "Total Sales (Today)",
//     salesValue: 450000,
//     format: "currency",
//     hideArrow: true,
//   },
//   {
//     heading: "Payments Received",
//     salesValue: 300000,
//     format: "currency",
//     hideArrow: true,
//     salesColor: "green",
//   },
//   {
//     heading: "Outstanding balance",
//     salesValue: 150000,
//     format: "currency",
//     hideArrow: true,
//     salesColor: "orange",
//   },
//   {
//     heading: "Total transactions",
//     salesValue: 10,
//     hideArrow: true,
//   },
// ];

// const DashboardTransactions: React.FC<Transactionprops> = ({ searchTerm }) => {
//   const { data: clients = [] } = useClients();
//   const [searchInput, setSearchInput] = useState("");

//   // Debug logs
//   console.log("DEBUG - Clients data:", clients);
//   console.log("DEBUG - Search term:", searchTerm);

//   // Flatten all transactions from all clients into a single array
//   const allTransactions = useMemo(() => {
//     const transactions: Array<
//       TransactionItem & { clientName: string; clientId: string }
//     > = [];

//     clients.forEach((client) => {
//       if (client.transactions && Array.isArray(client.transactions)) {
//         client.transactions.forEach((transaction) => {
//           transactions.push({
//             ...transaction,
//             clientName: client.name,
//             clientId: client._id,
//           });
//         });
//       }
//     });

//     // Sort by date (most recent first)
//     return transactions.sort(
//       (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
//     );
//   }, [clients]);

//   console.log("🔍 DEBUG - All transactions:", allTransactions);

//   // Filter transactions based on search term
//   const filteredTransactions = useMemo(() => {
//     if (!searchTerm && !searchInput) return allTransactions;

//     const searchQuery = searchTerm || searchInput;
//     return allTransactions.filter((transaction) => {
//       const invoiceId = `INV-${transaction._id}`;
//       return (
//         invoiceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         transaction.clientName.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     });
//   }, [allTransactions, searchTerm, searchInput]);

//   console.log("🔍 DEBUG - Filtered transactions:", filteredTransactions);

//   const {
//     currentPage,
//     totalPages,
//     goToPreviousPage,
//     goToNextPage,
//     canGoPrevious,
//     canGoNext,
//   } = usePagination(filteredTransactions.length, 5);

//   // Get current page transactions
//   const currentTransactions = useMemo(() => {
//     const startIndex = (currentPage - 1) * 5;
//     const endIndex = startIndex + 5;
//     return filteredTransactions.slice(startIndex, endIndex);
//   }, [filteredTransactions, currentPage]);

//   // Helper function to format currency
//   const formatCurrency = (amount: number) => `₦${amount.toLocaleString()}`;

//   // Helper function to get transaction type display
//   const getTransactionTypeDisplay = (type: string) => {
//     switch (type.toUpperCase()) {
//       case "PURCHASE":
//         return "Debit";
//       case "DEPOSIT":
//         return "Credit";
//       default:
//         return type;
//     }
//   };

//   // Helper function to get transaction type styles
//   const getTransactionTypeStyles = (type: string) => {
//     switch (type.toUpperCase()) {
//       case "PURCHASE":
//         return "border-[#F95353] bg-[#FFCACA] text-[#F95353]";
//       case "DEPOSIT":
//         return "border-[#2ECC71] bg-[#C8F9DD] text-[#2ECC71]";
//       default:
//         return "border-[#FFA500] bg-[#FFE7A4] text-[#FFA500]";
//     }
//   };

//   // Helper function to get amount color
//   const getAmountColor = (type: string) => {
//     switch (type.toUpperCase()) {
//       case "PURCHASE":
//         return "text-[#F95353]";
//       case "DEPOSIT":
//         return "text-[#2ECC71]";
//       default:
//         return "text-[#444444]";
//     }
//   };

//   // Helper function to get balance color
//   const getBalanceColor = (balance: number) => {
//     if (balance > 0) return "text-[#2ECC71]"; // Green for positive
//     if (balance < 0) return "text-[#F95353]"; // Red for negative
//     return "text-[#444444]"; // Gray for zero
//   };

//   return (
//     <main className="space-y-4">
//       <DashboardTitle
//         heading="Transaction Management"
//         description="Track all sales payment & client account activities"
//       />
//       <Stats data={stats} />

//       <div className="flex justify-between gap-10 items-center">
//         {/* search */}
//         <div className="relative bg-white max-w-lg w-full flex items-center gap-1 md:w-1/2 px-4 rounded-md border border-[#d9d9d9]">
//           <Search size={18} className="text-gray-400" />
//           <input
//             type="search"
//             placeholder="Search by invoice or client name..."
//             value={searchInput}
//             onChange={(e) => setSearchInput(e.target.value)}
//             className="py-2 outline-0 w-full"
//           />
//         </div>

//         <div className="flex items-center gap-4">
//           <Button className="w-50 h-10 bg-white text-base text-[#444444] border border-[#7d7d7d]">
//             Download Excel
//           </Button>
//           <Button className="w-40 h-10 text-base">Export PDF</Button>
//         </div>
//       </div>

//       <div className="flex gap-4">
//         <Select>
//           <SelectTrigger className="bg-[#d9d9d9] h-10 w-40 text-[#444444] border border-[#7D7D7D] justify-between">
//             <SelectValue placeholder="Client Filter" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectGroup>
//               <SelectItem value="all">All Clients</SelectItem>
//               {clients.map((client) => (
//                 <SelectItem key={client._id} value={client._id}>
//                   {client.name}
//                 </SelectItem>
//               ))}
//             </SelectGroup>
//           </SelectContent>
//         </Select>

//         <Select>
//           <SelectTrigger className="bg-[#d9d9d9] h-10 w-40 text-[#444444] border border-[#7D7D7D] justify-between">
//             <SelectValue placeholder="Date Range" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectGroup>
//               <SelectItem value="today">Today</SelectItem>
//               <SelectItem value="week">This Week</SelectItem>
//               <SelectItem value="month">This Month</SelectItem>
//               <SelectItem value="all">All Time</SelectItem>
//             </SelectGroup>
//           </SelectContent>
//         </Select>

//         <Select>
//           <SelectTrigger className="bg-[#d9d9d9] h-10 w-40 text-[#444444] border border-[#7D7D7D] justify-between">
//             <SelectValue placeholder="Transaction Type" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectGroup>
//               <SelectItem value="all">All Types</SelectItem>
//               <SelectItem value="PURCHASE">Debit</SelectItem>
//               <SelectItem value="DEPOSIT">Credit</SelectItem>
//             </SelectGroup>
//           </SelectContent>
//         </Select>
//       </div>

//       <div className="bg-white border mt-7 rounded-xl shadow-xl">
//         <h5 className="text-[#1E1E1E] text-xl font-medium py-6 pl-8">
//           All Transactions ({filteredTransactions.length})
//         </h5>

//         <table className="w-full">
//           <thead className="bg-[#F5F5F5] border border-[#d9d9d9]">
//             <tr>
//               <th className="py-3 text-base text-[#333333] font-normal text-center">
//                 Invoice
//               </th>
//               <th className="py-3 text-base text-[#333333] font-normal text-center">
//                 Date
//               </th>
//               <th className="py-3 text-base text-[#333333] font-normal text-center">
//                 Client
//               </th>
//               <th className="py-3 text-base text-[#333333] font-normal text-center">
//                 Type
//               </th>
//               <th className="py-3 text-base text-[#333333] font-normal text-center">
//                 Amount
//               </th>
//               <th className="py-3 text-base text-[#333333] font-normal text-center">
//                 Balance
//               </th>
//               <th className="py-3 text-base text-[#333333] font-normal text-center">
//                 Action
//               </th>
//             </tr>
//           </thead>

//           <tbody>
//             {currentTransactions.length > 0 ? (
//               currentTransactions.map((transaction) => (
//                 <tr
//                   key={`${transaction.clientId}-${transaction._id}`}
//                   className="border-b border-[#d9d9d9]"
//                 >
//                   <td className="text-center text-[#444444] text-sm font-normal py-3">
//                     INV-{transaction._id}
//                   </td>

//                   <td className="text-center text-[#444444] text-sm font-normal py-3">
//                     <div className="flex flex-col">
//                       <span className="text-xs text-[#444444]">
//                         {new Date(transaction.date).toLocaleDateString()}
//                       </span>
//                       <span className="text-[0.625rem] text-[#7D7D7D]">
//                         {new Date(transaction.date).toLocaleTimeString([], {
//                           hour: "2-digit",
//                           minute: "2-digit",
//                         })}
//                       </span>
//                     </div>
//                   </td>

//                   <td className="text-center text-[#444444] text-sm font-normal py-3">
//                     {transaction.clientName}
//                   </td>

//                   <td className="text-center py-3">
//                     <span
//                       className={`border text-sm py-1.5 px-3 rounded-[6.25rem] ${getTransactionTypeStyles(
//                         transaction.type
//                       )}`}
//                     >
//                       {getTransactionTypeDisplay(transaction.type)}
//                     </span>
//                   </td>

//                   <td
//                     className={`text-center text-sm py-3 ${getAmountColor(
//                       transaction.type
//                     )}`}
//                   >
//                     {transaction.type.toUpperCase() === "PURCHASE" ? "-" : ""}
//                     {formatCurrency(transaction.amount)}
//                   </td>

//                   <td
//                     className={`text-center text-sm py-3 ${getBalanceColor(
//                       clients.find((c) => c._id === transaction.clientId)
//                         ?.balance || 0
//                     )}`}
//                   >
//                     {formatCurrency(
//                       Math.abs(
//                         clients.find((c) => c._id === transaction.clientId)
//                           ?.balance || 0
//                       )
//                     )}
//                   </td>

//                   <td className="text-center underline text-[#3D80FF] text-sm py-3 cursor-pointer">
//                     View
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan={7} className="text-center py-8 text-gray-500">
//                   {filteredTransactions.length === 0 &&
//                   allTransactions.length === 0
//                     ? "No transactions found"
//                     : "No transactions match your search criteria"}
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>

//         {/* Pagination */}
//         {totalPages > 1 && (
//           <div className="h-16 bg-[#f5f5f5] text-sm text-[#7D7D7D] flex justify-center items-center gap-3 rounded-b-[0.625rem]">
//             <button
//               onClick={goToPreviousPage}
//               disabled={!canGoPrevious}
//               className={`border border-[#d9d9d9] rounded p-1 ${
//                 canGoPrevious
//                   ? "cursor-pointer hover:bg-gray-100"
//                   : "opacity-50 cursor-not-allowed"
//               }`}
//             >
//               <ChevronLeft size={14} />
//             </button>

//             <span>
//               Page {currentPage} of {totalPages}
//             </span>

//             <button
//               onClick={goToNextPage}
//               disabled={!canGoNext}
//               className={`border border-[#d9d9d9] rounded p-1 ${
//                 canGoNext
//                   ? "cursor-pointer hover:bg-gray-100"
//                   : "opacity-50 cursor-not-allowed"
//               }`}
//             >
//               <ChevronRight size={14} />
//             </button>
//           </div>
//         )}
//       </div>
//     </main>
//   );
// };

// export default DashboardTransactions;
