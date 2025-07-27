import { useMemo, useState, useEffect, useRef } from "react";
import { useDebounce } from "use-debounce";

import DashboardTitle from "@/components/dashboard/DashboardTitle";
import ClientTransactionModal from "./components/ClientTransactionModal";
import WalkinTransactionModal from "./components/WalkinTransactionModal";
import Stats from "./components/Stats";

import { Search, ChevronUp, ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/Button";

import { useTransactionsStore } from "@/stores/useTransactionStore";
import { useClientStore } from "@/stores/useClientStore";
import { useUserStore } from "@/stores/useUserStore";

import usePagination from "@/hooks/usePagination";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import type { StatCard } from "@/types/stats";
import type { Transaction } from "@/types/transactions";
import type { Client } from "@/types/types";

type BaseSuggestion<T extends "transaction" | "client" | "invoice"> = {
  type: T;
  value: string;
  transaction: Transaction;
  client: Client;
};

type TransactionSuggestion = BaseSuggestion<"transaction">;

type ClientSuggestion = BaseSuggestion<"client">;

type InvoiceSuggestion = BaseSuggestion<"invoice">;

type Suggestion = TransactionSuggestion | ClientSuggestion | InvoiceSuggestion;

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

const DashboardTransactions = () => {
  const { transactions, open, openModal, selectedTransaction } =
    useTransactionsStore();
  const { clients, getClientById } = useClientStore();
  const { getUserNameById } = useUserStore();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] =
    useState<number>(-1);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tableRef = useRef<HTMLTableElement>(null);

  // clientId is only available for registered clients.
  const mergedTransactions = useMemo(() => {
    return (transactions ?? []).map((transaction) => {
      // const clientId = transaction.clientId?._id;
      const clientId =
        typeof transaction.clientId === "string"
          ? transaction?.clientId
          : transaction.clientId?._id;

      // if (!clientId) {
      //   return { ...transaction, clientBalance: null }; // for walk-in clients or missing id
      // }
      const client = clientId ? getClientById(clientId) : null;

      return {
        ...transaction,
        client,
        // clientBalance: clientMatch?.balance ?? null,
      };
    });
  }, [transactions, getClientById]);

  // remove this on prod
  useEffect(() => {
    console.log("Transactions", transactions);
    console.log("Clients", clients);
    console.log("Users in store:", useUserStore.getState().users);
  }, [transactions, clients]);

  const filteredTransactions = useMemo(() => {
    const lowerTerm = debouncedSearchTerm.toLowerCase();
    return (mergedTransactions ?? []).filter((transaction) => {
      const invoice = transaction.invoiceNumber?.toLowerCase() ?? "";
      const client =
        transaction.clientId?.name?.toLowerCase() ??
        transaction.walkInClient?.name?.toLowerCase() ??
        "";
      return invoice.includes(lowerTerm) || client.includes(lowerTerm);
    });
  }, [debouncedSearchTerm, mergedTransactions]);

  // Generate suggestions based on search term
  const suggestions = useMemo(() => {
    if (!searchTerm || searchTerm.length < 1) return [];

    const lowerTerm = searchTerm.toLowerCase();
    const uniqueSuggestions = new Set<string>();
    const suggestionList: Suggestion[] = [];

    // filteredTransactions.forEach((transaction) => {
    //   // Add invoice suggestions
    //   if (transaction.invoiceNumber?.toLowerCase().includes(lowerTerm)) {
    //     const suggestion = {
    //       type: "invoice" as const,
    //       value: transaction.invoiceNumber,
    //       transaction,
    //     };
    //     if (!uniqueSuggestions.has(suggestion.value)) {
    //       uniqueSuggestions.add(suggestion.value);
    //       suggestionList.push(suggestion);
    //     }
    //   }

    //   // Add client suggestions
    //   const clientName =
    //     transaction.clientId?.name ?? transaction.walkInClient?.name;
    //   if (clientName?.toLowerCase().includes(lowerTerm)) {
    //     const suggestion = {
    //       type: "client" as const,
    //       value: clientName,
    //       transaction,
    //     };
    //     if (!uniqueSuggestions.has(suggestion.value)) {
    //       uniqueSuggestions.add(suggestion.value);
    //       suggestionList.push(suggestion);
    //     }
    //   }
    // });
    filteredTransactions.forEach((transaction) => {
      const invoiceMatch = transaction.invoiceNumber
        ?.toLowerCase()
        .includes(lowerTerm);
      const clientName =
        transaction.clientId?.name ?? transaction.walkInClient?.name;
      const clientMatch = clientName?.toLowerCase().includes(lowerTerm);

      if (invoiceMatch && !uniqueSuggestions.has(transaction.invoiceNumber!)) {
        uniqueSuggestions.add(transaction.invoiceNumber!);
        suggestionList.push({
          type: "transaction",
          value: transaction.invoiceNumber!,
          transaction,
        });
      }

      if (clientMatch && clientName && !uniqueSuggestions.has(clientName)) {
        uniqueSuggestions.add(clientName);
        suggestionList.push({
          type: "client",
          value: clientName,
          transaction,
        });
      }
    });
    return suggestionList.slice(0, 8); // Limit to 8 suggestions
  }, [searchTerm, filteredTransactions]);

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setSearchTerm(suggestion.value);
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);

    if (suggestion.type === "transaction") {
      scrollToTransaction(suggestion.transaction._id);
    }
    // scrollToTransaction((suggestion.transaction as Transaction)._id);
  };

  const scrollToTransaction = (transactionId: string) => {
    // First, ensure the transaction is visible by navigating to the correct page
    const transactionIndex = filteredTransactions.findIndex(
      (t) => t._id === transactionId
    );
    if (transactionIndex === -1) return;

    const targetPage = Math.floor(transactionIndex / 4) + 1;

    // If we need to change pages, do it and then scroll after a brief delay
    if (targetPage !== currentPage) {
      // Navigate to the correct page first
      const pageOffset = targetPage - currentPage;
      if (pageOffset > 0) {
        for (let i = 0; i < pageOffset; i++) {
          if (canGoNext) goToNextPage();
        }
      } else {
        for (let i = 0; i < Math.abs(pageOffset); i++) {
          if (canGoPrevious) goToPreviousPage();
        }
      }

      // Scroll after page change with delay
      setTimeout(() => {
        scrollToRow(transactionId);
      }, 100);
    } else {
      // Same page, scroll immediately
      scrollToRow(transactionId);
    }
  };

  const scrollToRow = (transactionId: string) => {
    const row = document.querySelector(
      `[data-transaction-id="${transactionId}"]`
    );
    if (row && tableRef.current) {
      row.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      // Add highlight effect
      row.classList.add("bg-blue-50", "border-blue-200");
      setTimeout(() => {
        row.classList.remove("bg-blue-50", "border-blue-200");
      }, 2000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedSuggestionIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedSuggestionIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (selectedSuggestionIndex >= 0) {
          handleSuggestionClick(suggestions[selectedSuggestionIndex]);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        searchInputRef.current?.blur();
        break;
    }
  };

  // Scroll selected suggestion into view
  useEffect(() => {
    if (
      selectedSuggestionIndex >= 0 &&
      suggestionRefs.current[selectedSuggestionIndex]
    ) {
      suggestionRefs.current[selectedSuggestionIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [selectedSuggestionIndex]);

  // const clearSearch = () => {
  //   setSearchTerm("");
  //   setShowSuggestions(false);
  //   setSelectedSuggestionIndex(-1);
  // };

  // Use filteredTransactions for pagination instead of filterByInvoice
  const {
    currentPage,
    totalPages,
    goToPreviousPage,
    goToNextPage,
    canGoPrevious,
    canGoNext,
  } = usePagination(mergedTransactions.length, 5);

  const currentTransaction = useMemo(() => {
    const startIndex = (currentPage - 1) * 5;
    const endIndex = startIndex + 5;
    return filteredTransactions?.slice(startIndex, endIndex);
  }, [filteredTransactions, currentPage]);

  // Handle clicks outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".search-container")) {
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset suggestion selection when suggestions change
  useEffect(() => {
    setSelectedSuggestionIndex(-1);
  }, [suggestions]);

  // Update suggestion refs array length
  useEffect(() => {
    suggestionRefs.current = suggestionRefs.current.slice(
      0,
      suggestions.length
    );
  }, [suggestions.length]);

  return (
    <main className="space-y-4">
      <DashboardTitle
        heading="Transaction Management"
        description="Track all sales payment & client account activities"
      />
      <Stats data={stats} />
      <div className="flex justify-between gap-10 items-center">
        {/* search */}
        <div className="relative max-w-lg w-full md:w-1/2 search-container">
          <div className="relative bg-white flex items-center gap-1 px-4 rounded-md border border-[#d9d9d9]">
            <Search size={18} className="text-gray-400" />
            <input
              type="search"
              ref={searchInputRef}
              placeholder="Search by invoice..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSuggestions(true);
                setSelectedSuggestionIndex(-1);
              }}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={handleKeyDown}
              className="py-2 outline-0 w-full"
            />
          </div>

          {showSuggestions && searchTerm && (
            <div className="absolute top-full left-0 z-50 bg-white border rounded-md shadow-lg w-full max-h-64 overflow-y-auto">
              {suggestions.length > 0 ? (
                suggestions.map((suggestion, i) => (
                  <div
                    key={i}
                    ref={(el) => {
                      suggestionRefs.current[i] = el;
                    }}
                    onClick={() => handleSuggestionClick(suggestion)}
                    onMouseEnter={() => setSelectedSuggestionIndex(i)}
                    className={`flex items-center justify-between px-4 py-3 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors ${
                      selectedSuggestionIndex === i
                        ? "bg-blue-50 border-blue-200"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">
                        {suggestion.value}
                      </span>
                      <span className="text-xs text-gray-500">
                        {suggestion.type === "invoice"
                          ? "Invoice Number"
                          : "Client Name"}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400">
                      {suggestion.type === "invoice" && (
                        <span className="ml-2">
                          {suggestion.transaction.clientId?.name ??
                            suggestion.transaction.walkInClient?.name}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center">
                  <p className="text-sm text-gray-500">
                    No matches found for{" "}
                    <span className="font-medium text-gray-700">
                      "{searchTerm}"
                    </span>
                  </p>
                </div>
              )}
            </div>
          )}
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
          {searchTerm && (
            <span className="text-sm font-normal text-gray-500 ml-2">
              ({filteredTransactions.length} results for "{searchTerm}")
            </span>
          )}
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
              {/* <th className="py-3 text-base text-[#333333] font-normal text-center">
                Status
              </th> */}
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
            {currentTransaction?.length > 0 ? (
              currentTransaction.map((transaction) => (
                <tr key={transaction._id} className="border-b border-[#d9d9d9]">
                  <td className=" text-center text-[#444444] text-sm font-normal py-3">
                    {transaction.invoiceNumber}
                  </td>
                  <td className="flex flex-col text-center  font-normal py-3">
                    <span className="text-xs text-[#444444]">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </span>
                    <span className="text-[0.625rem] text-[#7D7D7D]">
                      {new Date(transaction.createdAt).toLocaleTimeString()}
                    </span>
                  </td>
                  <td className=" text-center text-[#444444] text-sm font-normal py-3">
                    {transaction.clientName || transaction.walkInClientName}
                  </td>
                  <td className="text-center">
                    {transaction.type && (
                      <span
                        className={`border text-xs py-1.5 px-3 rounded-[6.25rem] ${
                          transaction.type === "PURCHASE"
                            ? "border-[#F95353] bg-[#FFCACA] text-[#F95353]"
                            : "border-[#FFA500] bg-[#FFE7A4] text-[#FFA500]"
                        }`}
                      >
                        {transaction.type}
                      </span>
                    )}
                  </td>
                  {/* <td
                    className={`text-xs text-center ${
                      transaction.status === "COMPLETED"
                        ? "text-[#2ECC71]"
                        : "text-[#F95353]"
                    }`}
                  >
                    {transaction.status}
                  </td> */}
                  <td className="text-sm text-center">
                    ₦{transaction.total.toLocaleString()}
                  </td>
                  <td
                    className={`text-sm text-center ${
                      typeof transaction?.client?.balance === "number"
                        ? transaction?.client?.balance < 0
                          ? "text-[#F95353]"
                          : transaction?.client?.balance > 0
                          ? "text-[#2ECC71]"
                          : "text-[#7d7d7d]"
                        : "text-[#7d7d7d]"
                    }`}
                  >
                    {transaction.client !== null &&
                    transaction.client.balance !== null ? (
                      <>
                        {transaction.client.balance < 0 ? "-" : ""}₦
                        {Math.abs(transaction?.client.balance).toLocaleString()}
                      </>
                    ) : (
                      "₦0.00"
                    )}
                  </td>
                  <td className="text-center text-[#3D80FF] text-sm">
                    <button
                      onClick={() => openModal(transaction)}
                      className="underline cursor-pointer hover:no-underline transition-all duration-150 ease-in-out"
                    >
                      View
                    </button>

                    {/* {transaction.clientId?._id ? (
                      <Link
                        to={`/clients/${transaction?.clientId._id}`}
                        className="underline"
                      >
                        View
                      </Link>
                    ) : (
                      <span>walk-in</span>
                    )} */}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="text-gray-400 text-center font-normal text-sm py-10"
                >
                  {searchTerm
                    ? "No transactions found matching your search"
                    : "Loading transactions..."}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* {open && transactions?.clientId !== null ? (
          <ClientTransactionModal />
        ) : (
          <WalkinTransactionModal />
        )} */}

        {open && selectedTransaction?.clientId ? (
          <ClientTransactionModal />
        ) : (
          <WalkinTransactionModal />
        )}

        {/* pagination */}
        {currentTransaction?.length > 0 && totalPages > 1 && (
          <div className="h-16 bg-[#f5f5f5] text-sm text-[#7D7D7D] flex justify-center items-center gap-3 rounded-b-[0.625rem] ">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={canGoPrevious ? goToPreviousPage : undefined}
                    className={
                      !canGoPrevious
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                    aria-label="Go to previous page"
                  >
                    <Button
                      disabled={!canGoPrevious}
                      className="border border-[#d9d9d9] rounded"
                    >
                      {" "}
                      <ChevronLeft size={14} />
                    </Button>
                  </PaginationPrevious>
                </PaginationItem>
                <PaginationItem className="px-4 text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </PaginationItem>
                <PaginationNext
                  onClick={canGoNext ? goToNextPage : undefined}
                  className={
                    !canGoNext
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                  aria-label="Go to next page"
                >
                  <Button className="border border-[#d9d9d9] rounded">
                    <ChevronRight size={14} />
                  </Button>
                </PaginationNext>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </main>
  );
};

export default DashboardTransactions;
