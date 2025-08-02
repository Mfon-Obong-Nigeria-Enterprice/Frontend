// import React, { useState, useRef, useMemo } from "react";
// import { useDebounce } from "use-debounce";

// import Stats from "./Stats";

// import { useClientStore } from "@/stores/useClientStore";
// import { useTransactionsStore } from "@/stores/useTransactionStore";

// import type { StatCard } from "@/types/stats";

// import { Button } from "@/components/ui/Button";

// import { Search } from "lucide-react";

// import { mergeTransactionsWithClients } from "@/utils/mergeTransactionsWithClients";
// import type { Transaction } from "@/types/transactions";
// const Transactions = () => {
//   const { clients, getClientById, getOutStandingBalanceData } =
//     useClientStore();
//   const { transactions, open, openModal, selectedTransaction } =
//     useTransactionsStore();
//   const [searchTerm, setSearchTerm] = useState<string>("");
//   const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
//   const searchInputRef = useRef<HTMLInputElement>(null);
//   const suggestionRefs = useRef<(HTMLDivElement | null)[]>([]);
//   const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
//   const [selectedSuggestionIndex, setSelectedSuggestionIndex] =
//     useState<number>(-1);

//   const outstandingBalance = getOutStandingBalanceData();

//   const stats: StatCard[] = [
//     {
//       heading: "Total Sales (Today)",
//       salesValue: 450000,
//       format: "currency",
//       hideArrow: true,
//     },
//     {
//       heading: "Payments Received",
//       salesValue: 300000,
//       format: "currency",
//       hideArrow: true,
//       salesColor: "green",
//     },
//     {
//       heading: "Outstanding balance",
//       salesValue: `${outstandingBalance.totalDebt.toLocaleString()}`,
//       format: "currency",
//       hideArrow: true,
//       salesColor: "orange",
//     },
//     {
//       heading: "Total transactions",
//       salesValue: `${transactions?.length}`,
//       hideArrow: true,
//     },
//   ];

//   const suggestions = useMemo(() => {
//     if (!searchTerm || searchTerm.length < 1) return [];

//     const lowerTerm = searchTerm.toLowerCase();
//     const uniqueSuggestions = new Set<string>();
//     const suggestionList: Transaction[] = [];

//     const mergedTransactions = useMemo(() => {
//       return mergeTransactionsWithClients(transactions, getClientById);
//     }, []);

//     filteredTransactions.forEach((transaction) => {
//       const invoiceMatch = transaction?.invoiceNumber
//         ?.toLowerCase()
//         .includes(lowerTerm);

//       if (invoiceMatch && !uniqueSuggestions.has(transaction.invoiceNumber!)) {
//         uniqueSuggestions.add(transaction.invoiceNumber!);
//         suggestionList.push({
//           type: "transaction",
//           value: transaction.invoiceNumber!,
//           transaction,
//         });
//       }
//     });
//     return suggestionList.slice(0, 8); // Limit to 8 suggestions
//   }, [searchTerm, filteredTransactions]);

//   const scrollToTransaction = (transactionId: string) => {
//     // First, ensure the transaction is visible by navigating to the correct page
//     const transactionIndex = filteredTransactions.findIndex(
//       (t) => t._id === transactionId
//     );
//     if (transactionIndex === -1) return;

//     const targetPage = Math.floor(transactionIndex / 4) + 1;

//     // If we need to change pages, do it and then scroll after a brief delay
//     if (targetPage !== currentPage) {
//       // Navigate to the correct page first
//       const pageOffset = targetPage - currentPage;
//       if (pageOffset > 0) {
//         for (let i = 0; i < pageOffset; i++) {
//           if (canGoNext) goToNextPage();
//         }
//       } else {
//         for (let i = 0; i < Math.abs(pageOffset); i++) {
//           if (canGoPrevious) goToPreviousPage();
//         }
//       }

//       // Scroll after page change with delay
//       setTimeout(() => {
//         scrollToRow(transactionId);
//       }, 100);
//     } else {
//       // Same page, scroll immediately
//       scrollToRow(transactionId);
//     }
//   };

//   const scrollToRow = (transactionId: string) => {
//     const row = document.querySelector(
//       `[data-transaction-id="${transactionId}"]`
//     );
//     if (row && tableRef.current) {
//       row.scrollIntoView({
//         behavior: "smooth",
//         block: "center",
//       });

//       // Add highlight effect
//       row.classList.add("bg-blue-50", "border-blue-200");
//       setTimeout(() => {
//         row.classList.remove("bg-blue-50", "border-blue-200");
//       }, 2000);
//     }
//   };

//   // Scroll selected suggestion into view
//   useEffect(() => {
//     if (
//       selectedSuggestionIndex >= 0 &&
//       suggestionRefs.current[selectedSuggestionIndex]
//     ) {
//       suggestionRefs.current[selectedSuggestionIndex]?.scrollIntoView({
//         behavior: "smooth",
//         block: "nearest",
//       });
//     }
//   }, [selectedSuggestionIndex]);

//   const handleSuggestionClick = (suggestion: Suggestion) => {
//     setSearchTerm(suggestion.value);
//     setShowSuggestions(false);
//     setSelectedSuggestionIndex(-1);

//     if (suggestion.type === "transaction") {
//       scrollToTransaction(suggestion.transaction._id);
//     }
//     // scrollToTransaction((suggestion.transaction as Transaction)._id);
//   };

//   const handleKeyDown = (e: React.KeyboardEvent) => {
//     if (!showSuggestions || suggestions.length === 0) return;

//     switch (e.key) {
//       case "ArrowDown":
//         e.preventDefault();
//         setSelectedSuggestionIndex((prev) =>
//           prev < suggestions.length - 1 ? prev + 1 : 0
//         );
//         break;
//       case "ArrowUp":
//         e.preventDefault();
//         setSelectedSuggestionIndex((prev) =>
//           prev > 0 ? prev - 1 : suggestions.length - 1
//         );
//         break;
//       case "Enter":
//         e.preventDefault();
//         if (selectedSuggestionIndex >= 0) {
//           handleSuggestionClick(suggestions[selectedSuggestionIndex]);
//         }
//         break;
//       case "Escape":
//         setShowSuggestions(false);
//         setSelectedSuggestionIndex(-1);
//         searchInputRef.current?.blur();
//         break;
//     }
//   };

//   return (
//     <div>
//       <Stats data={stats} />

//       {/* Search bar */}
//       <div className="flex justify-between gap-10 items-center">
//         {/* search */}
//         <div className="relative max-w-lg w-full md:w-1/2 search-container">
//           <div className="relative bg-white flex items-center gap-1 px-4 rounded-md border border-[#d9d9d9]">
//             <Search size={18} className="text-gray-400" />
//             <input
//               type="search"
//               ref={searchInputRef}
//               placeholder="Search by invoice..."
//               value={searchTerm}
//               onChange={(e) => {
//                 setSearchTerm(e.target.value);
//                 setShowSuggestions(true);
//                 setSelectedSuggestionIndex(-1);
//               }}
//               onFocus={() => setShowSuggestions(true)}
//               onKeyDown={handleKeyDown}
//               className="py-2 outline-0 w-full"
//             />
//           </div>

//           {showSuggestions && searchTerm && (
//             <div className="absolute top-full left-0 z-50 bg-white border rounded-md shadow-lg w-full max-h-64 overflow-y-auto">
//               {suggestions.length > 0 ? (
//                 suggestions.map((suggestion, i) => (
//                   <div
//                     key={i}
//                     ref={(el) => {
//                       suggestionRefs.current[i] = el;
//                     }}
//                     onClick={() => handleSuggestionClick(suggestion)}
//                     onMouseEnter={() => setSelectedSuggestionIndex(i)}
//                     className={`flex items-center justify-between px-4 py-3 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors ${
//                       selectedSuggestionIndex === i
//                         ? "bg-blue-50 border-blue-200"
//                         : "hover:bg-gray-50"
//                     }`}
//                   >
//                     <div className="flex flex-col">
//                       <span className="text-sm font-medium text-gray-900">
//                         {suggestion.value}
//                       </span>
//                       <span className="text-xs text-gray-500">
//                         {suggestion.type === "transaction"
//                           ? "Invoice Number"
//                           : "Client Name"}
//                       </span>
//                     </div>
//                     <div className="text-xs text-gray-400">
//                       {suggestion.type === "invoice" && (
//                         <span className="ml-2">
//                           {suggestion.transaction.clientId?.name ??
//                             suggestion.transaction.walkInClient?.name}
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <div className="p-4 text-center">
//                   <p className="text-sm text-gray-500">
//                     No matches found for{" "}
//                     <span className="font-medium text-gray-700">
//                       "{searchTerm}"
//                     </span>
//                   </p>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         <div className="flex items-center gap-4">
//           <Button
//             onClick={handleExportExcel}
//             className="w-50 h-10 bg-white text-base text-[#444444] border border-[#7d7d7d]"
//           >
//             Download Excel
//           </Button>
//           <Button onClick={handleExportPDF} className="w-40 h-10 text-base">
//             Export PDF
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Transactions;
