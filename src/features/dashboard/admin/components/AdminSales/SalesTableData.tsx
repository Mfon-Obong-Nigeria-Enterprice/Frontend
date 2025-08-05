import { useCallback, useState } from "react";

// components
import ClientTransactionModal from "@/features/dashboard/shared/ClientTransactionModal";
import WalkinTransactionModal from "@/features/dashboard/shared/WalkinTransactionModal";
import SearchBar from "@/features/dashboard/shared/SearchBar";

// ui
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// icons
import { ChevronDown } from "lucide-react";

// stores
import { useTransactionsStore } from "@/stores/useTransactionStore";

// utils
import { toSentenceCaseName } from "@/utils/styles";

// types
import type { Transaction } from "@/types/transactions";

//hooks
import { useTransactionSearch } from "@/hooks/useTransactionSearch";

const SalesTableData = ({
  currentTransaction,
  setCurrentPage,
}: {
  currentTransaction: Transaction[];
  setCurrentPage: () => void;
}) => {
  const { open, openModal, selectedTransaction } = useTransactionsStore();

  const { fetchSuggestions, onSelect } = useTransactionSearch({
    type: "client",
    pageSize: 5,
    onPageChange: (page) => setCurrentPage(page), // hook this up if you're paginating
  });

  const formatCurrency = (value: number) => `₦${value.toLocaleString()}`;

  return (
    <div className="bg-white px-8 py-6 rounded-lg font-Inter">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
            <CardTitle className="text-[#1E1E1E] text-xl font-medium">
              Recent Sales
            </CardTitle>
            <div className="w-full sm:w-1/2">
              <SearchBar
                type="client"
                placeholder="Search by client name..."
                fetchSuggestions={fetchSuggestions}
                onSelect={onSelect}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-[#D9D9D9]">
                <TableHead className="text-[#333333] text-base">Time</TableHead>
                <TableHead className="text-[#333333] text-base">
                  Client
                </TableHead>
                <TableHead className="text-[#333333] text-base">
                  Items
                </TableHead>
                <TableHead className="text-[#333333] text-base">
                  Amount
                </TableHead>
                <TableHead className="text-[#333333] text-base">
                  Staff
                </TableHead>
                <TableHead className="text-[#333333] text-base">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentTransaction && currentTransaction.length > 0 ? (
                currentTransaction.map((transaction) => (
                  <TableRow
                    key={transaction._id}
                    id={`invoice-${transaction.invoiceNumber}`}
                  >
                    <TableCell className="text-sm text-gray-400">
                      {new Date(transaction.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell>
                      {toSentenceCaseName(
                        transaction.clientId?.name ||
                          transaction.walkInClient?.name ||
                          "No Name"
                      )}
                    </TableCell>
                    <TableCell>
                      {transaction.items.length > 0 && (
                        <>
                          <span>
                            {transaction.items[0].quantity}x{" "}
                            {transaction.items[0].productName}
                          </span>
                          {transaction.items.length > 1 && (
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="ml-1"
                                >
                                  <ChevronDown className="w-4 h-4" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="text-sm max-w-xs">
                                {transaction.items
                                  .slice(1)
                                  .map(
                                    (item, index) =>
                                      `${item.quantity}x ${item.productName}${
                                        index < transaction.items.length - 2
                                          ? ", "
                                          : ""
                                      }`
                                  )}
                              </PopoverContent>
                            </Popover>
                          )}
                        </>
                      )}
                    </TableCell>
                    <TableCell className="text-green-600">
                      {formatCurrency(transaction.total)}
                    </TableCell>
                    <TableCell>{transaction.userId.name}</TableCell>
                    <TableCell className="text-center text-[#3D80FF] text-sm">
                      <button
                        onClick={() => openModal(transaction)}
                        className="underline cursor-pointer hover:no-underline transition-all duration-150 ease-in-out"
                      >
                        View
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500">
                    Loading data...
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {open &&
            (selectedTransaction?.clientId ? (
              <ClientTransactionModal />
            ) : (
              <WalkinTransactionModal />
            ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesTableData;

// import { useCallback } from "react";

// // components
// import ClientTransactionModal from "@/features/dashboard/shared/ClientTransactionModal";
// import WalkinTransactionModal from "@/features/dashboard/shared/WalkinTransactionModal";
// import SearchBar from "@/features/dashboard/shared/SearchBar";

// // ui
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// // import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/Button";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";

// // icons
// import { IoIosSearch } from "react-icons/io";

// // hooks
// import useSearch from "@/hooks/useSearch";

// // stores
// import { useTransactionsStore } from "@/stores/useTransactionStore";

// // utils
// import { toSentenceCaseName } from "@/utils/styles";
// import { ChevronDown } from "lucide-react";

// //types
// import type { Transaction } from "@/types/transactions";

// interface SalesTransaction {
//   id: string;
//   client: string;
//   amount: number;
//   time: string;
//   items: string;
//   staff: string;
//   availableItems: string[];
// }

// const recentSales: SalesTransaction[] = [
//   {
//     id: "1",
//     client: "Walk-in client",
//     amount: -12750,
//     time: "11:40 AM",
//     items: "5x Nails,",
//     staff: "John Doe",
//     availableItems: [
//       "Portland Cement (50), Steel Rod (30)",
//       "Red Bricks (500), Portland Cement (25)",
//       "Steel Rod (100), Common Nails (10)",
//     ],
//   },
//   {
//     id: "2",
//     client: "Akpan construction",
//     amount: +150000,
//     time: "11:25 AM",
//     items: "10x Cement,",
//     staff: "Jane Smith",
//     availableItems: [
//       "Portland Cement (50), Steel Rod (30)",
//       "Red Bricks (500), Portland Cement (25)",
//       "Steel Rod (100), Common Nails (10)",
//     ],
//   },
//   {
//     id: "3",
//     client: "Ade properties",
//     amount: 225000,
//     time: "9:15 AM",
//     items: "25x steel Rods",
//     staff: "Sarah Wilson",
//     availableItems: [
//       "Portland Cement (50), Steel Rod (30)",
//       "Red Bricks (500), Portland Cement (25)",
//       "Steel Rod (100), Common Nails (10)",
//     ],
//   },
//   {
//     id: "4",
//     client: "Ade Enterprises",
//     amount: -7500,
//     time: "8:10 AM",
//     items: "3x Nails",
//     staff: "Mike Johnson",
//     availableItems: [
//       "Portland Cement (50), Steel Rod (30)",
//       "Red Bricks (500), Portland Cement (25)",
//       "Steel Rod (100), Common Nails (10)",
//     ],
//   },
//   {
//     id: "5",
//     client: "Mfong properties",
//     amount: +117500,
//     time: "10:10 AM",
//     items: "10x Paints",
//     staff: "Aniekan",
//     availableItems: [
//       "Portland Cement (50), Steel Rod (30)",
//       "Red Bricks (500), Portland Cement (25)",
//       "Steel Rod (100), Common Nails (10)",
//     ],
//   },
// ];

// const SalesTableData = ({
//   currentTransaction,
// }: {
//   currentTransaction: Transaction[];
// }) => {
//   const { transactions, open, openModal, selectedTransaction } =
//     useTransactionsStore();

//   const fetchSuggestions = useCallback(
//     async (query: string) => {
//       const lowerQuery = query.toLowerCase();

//       const matched = (transactions ?? []).filter(
//         (t) =>
//           t.clientId?.name?.toLowerCase().includes(lowerQuery) ||
//           t.walkInClient?.name?.toLowerCase().includes(lowerQuery)
//       );

//       return matched.map((t) => ({
//         id: t._id,
//         label: t.clientId?.name || t.walkInClient?.name || "Unnamed",
//       }));
//     },
//     [transactions]
//   );

//   // handle selection
//   const onSelect = useCallback(
//     (selected: { id: string; label: string }) => {
//       // const index = (transactions ?? []).findIndex(
//       // (t) => t.invoiceNumber === selected.label
//       // );
//       const index = currentTransaction.findIndex((t) => {
//         const name = t.clientId?.name || t.walkInClient?.name;
//         return name?.toLowerCase() === selected.label.toLowerCase();
//       });

//       if (index === -1) return;

//       const pageSize = 5;
//       const targetPage = Math.floor(index / pageSize) + 1;

//       if (targetPage !== currentPage) {
//         setCurrentPage(targetPage);

//         // Wait for page to update, then scroll
//         setTimeout(() => {
//           const target = document.getElementById(`invoice-${selected.label}`);
//           if (target) {
//             target.scrollIntoView({ behavior: "smooth", block: "center" });
//             target.classList.add("ring-2", "ring-blue-400", "rounded-md");
//             setTimeout(() => {
//               target.classList.remove("ring-2", "ring-blue-400", "rounded-md");
//             }, 2000);
//           }
//         }, 300);
//       } else {
//         const target = document.getElementById(`invoice-${selected.label}`);
//         if (target) {
//           target.scrollIntoView({ behavior: "smooth", block: "center" });
//           target.classList.add("ring-2", "ring-blue-400", "rounded-md");
//           setTimeout(() => {
//             target.classList.remove("ring-2", "ring-blue-400", "rounded-md");
//           }, 2000);
//         }
//       }
//     },
//     [mergedTransactions, currentPage, setCurrentPage]
//   );

//   const formatCurrency = (value: number) => `₦${value.toLocaleString()}`;

//   return (
//     <div className="bg-white px-8 py-6 rounded-lg font-Inter">
//       <Card>
//         <CardHeader>
//           <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
//             <div>
//               <CardTitle className="text-[#1E1E1E] text-xl font-medium">
//                 Recent Sales
//               </CardTitle>
//             </div>
//             <div className=" w-full sm:w-1/2 relative rounded-md">
//               {/* <IoIosSearch
//                 size={18}
//                 className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400"
//                 aria-hidden="true"
//               />
//               <Input
//                 type="search"
//                 value={searchQuery}
//                 // onChange={handleSearchSale}
//                 placeholder="Search sales..."
//                 className=" pl-10 outline-none focus:outline-none"
//                 aria-label="Search sales by client or items"
//               /> */}
//               <SearchBar
//                 type="client"
//                 placeholder="Search by client name..."
//                 fetchSuggestions={fetchSuggestions}
//                 onSelect={onSelect}
//               />
//             </div>
//           </div>
//         </CardHeader>
//         <CardContent>
//           <Table>
//             <TableHeader>
//               <TableRow className="bg-[#D9D9D9]">
//                 <TableHead className=" text-[#333333] text-base ">
//                   Time
//                 </TableHead>
//                 <TableHead className=" text-[#333333] text-base ">
//                   Client
//                 </TableHead>
//                 <TableHead className=" text-[#333333] text-base ">
//                   Items
//                 </TableHead>
//                 <TableHead className=" text-[#333333] text-base ">
//                   Amount
//                 </TableHead>
//                 <TableHead className=" text-[#333333] text-base ">
//                   Staff
//                 </TableHead>
//                 <TableHead className=" text-[#333333] text-base ">
//                   Actions
//                 </TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {currentTransaction?.length > 0 ? (
//                 currentTransaction.map((transaction) => (
//                   <TableRow
//                     key={transaction._id}
//                     id={`invoice-${transaction.invoiceNumber}`}
//                     className="text-start"
//                   >
//                     <TableCell className="text-sm text-gray-400 ">
//                       {new Date(transaction.createdAt).toLocaleTimeString([], {
//                         hour: "2-digit",
//                         minute: "2-digit",
//                       })}
//                     </TableCell>
//                     <TableCell>
//                       {toSentenceCaseName(
//                         typeof transaction.clientId?.name === "string"
//                           ? transaction.clientId.name
//                           : typeof transaction.walkInClient?.name === "string"
//                           ? transaction.walkInClient.name
//                           : "No name"
//                       )}
//                     </TableCell>
//                     <TableCell>
//                       {transaction.items.length > 0 && (
//                         <>
//                           {/* Show first item */}
//                           <span>
//                             {transaction.items[0].quantity}x{" "}
//                             {transaction.items[0].productName}
//                           </span>

//                           {/* If more than one item, show popover trigger */}
//                           {transaction.items.length > 1 && (
//                             <Popover>
//                               <PopoverTrigger asChild>
//                                 <Button
//                                   variant="ghost"
//                                   size="icon"
//                                   className="ml-1"
//                                 >
//                                   <ChevronDown className="w-4 h-4" />
//                                 </Button>
//                               </PopoverTrigger>
//                               <PopoverContent className="text-sm max-w-xs">
//                                 {transaction.items
//                                   .slice(1)
//                                   .map(
//                                     (item, index) =>
//                                       `${item.quantity}x ${item.productName}${
//                                         index < transaction.items.length - 2
//                                           ? ", "
//                                           : ""
//                                       }`
//                                   )}
//                               </PopoverContent>
//                             </Popover>
//                           )}
//                         </>
//                       )}
//                     </TableCell>
//                     <TableCell className={getAmountColor(transaction.total)}>
//                       {formatCurrency(transaction.total)}
//                     </TableCell>
//                     <TableCell className="">
//                       {transaction.userId.name}
//                     </TableCell>
//                     <TableCell className="text-center text-[#3D80FF] text-sm">
//                       <button
//                         onClick={() => openModal(transaction)}
//                         className="underline cursor-pointer hover:no-underline transition-all duration-150 ease-in-out"
//                       >
//                         View
//                       </button>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               ) : (
//                 <TableRow>
//                   <TableCell colSpan={6} className="text-center text-gray-500">
//                     Loading sales data ...
//                   </TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>

//           {/* modals for clients */}
//           {open && selectedTransaction?.clientId ? (
//             <ClientTransactionModal />
//           ) : (
//             <WalkinTransactionModal />
//           )}

//           {/* Empty state */}
//           {/* {filteredSales.length === 0 && (
//             <div className="py-4 text-center text-gray-500">
//               <p>No sales found matching your search criteria</p>
//               {searchQuery && (
//                 <button
//                   onClick={() => setSearchQuery("")}
//                   className="mt-2 text-sm text-blue-600 hover:text-blue-800 underline"
//                 >
//                   Clear search
//                 </button>
//               )}
//             </div>
//           )} */}
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default SalesTableData;
