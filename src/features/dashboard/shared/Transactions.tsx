/** @format */

import { useState, useCallback, useMemo } from "react";

// libs
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import { toast } from "sonner";

// stores
import { useClientStore } from "@/stores/useClientStore";
import { useTransactionsStore } from "@/stores/useTransactionStore";
import { useBranchStore } from "@/stores/useBranchStore";

// types
import type { StatCard } from "@/types/stats";
import type { DateRange } from "react-day-picker";

// hooks
import usePagination from "@/hooks/usePagination";

// components
import TransactionsTableMobile from "./mobile/TransactionsTableMobile";
import Stats from "../shared/Stats";
import SearchBar from "./SearchBar";
import TransactionTable from "./desktop/TransactionTable";
import DateRangePicker from "@/components/DateRangePicker";

// ui
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// icons
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getChangeText } from "@/utils/helpersfunction";
import { formatCurrency } from "@/utils/formatCurrency";

const Transactions = () => {
  const { getOutStandingBalanceData, getClientById } = useClientStore();
  const {
    transactions,
    getTodaysSales,
    getThisMonthPayments,
    getMonthlyPaymentsPercentageChange,
    getTodaysTransactionCount,
    getTodaysTransactionCountPercentageChange,
    // getWeeklySalesPercentageChange,
  } = useTransactionsStore();
  const { branches } = useBranchStore();
  const [clientFilter, setClientFilter] = useState<string | undefined>();
  const [transactionTypeFilter, setTransactionTypeFilter] = useState<
    string | undefined
  >();
  const [dateRangeFilter, setDateRangeFilter] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });

  const outstandingBalance = getOutStandingBalanceData() || {
    totalDebt: 0,
    clientsWithDebt: 0,
  };
  const todaysTransactionCount = getTodaysTransactionCount();
  const transactionCountChange = getTodaysTransactionCountPercentageChange();
  const todaysSales = getTodaysSales();
  const monthlyPayments = getThisMonthPayments();
  // const weeklyChange = getWeeklySalesPercentageChange();
  const monthlyChange = getMonthlyPaymentsPercentageChange();

  // Format change text helper
  const formatChangeText = (change: {
    percentage: number;
    direction: "increase" | "decrease" | "no-change";
  }) => {
    switch (change.direction) {
      case "increase":
        return `↑${change.percentage}% from yesterday`;
      case "decrease":
        return `↓${change.percentage}% from yesterday`;
      default:
        return "—No change from yesterday";
    }
  };

  const stats: StatCard[] = [
    {
      heading: "Total Sales (Today)",
      salesValue: formatCurrency(todaysSales),
      hideArrow: false,
    },
    {
      heading: "Payments Received",
      salesValue: formatCurrency(monthlyPayments),
      statValue: getChangeText(
        monthlyChange.percentage,
        monthlyChange.direction,
        "last month"
      ),
      color:
        monthlyChange.direction === "increase"
          ? "green"
          : monthlyChange.direction === "decrease"
          ? "red"
          : "orange",
      hideArrow: false,
      salesColor: "green",
    },
    {
      heading: "Outstanding balance",
      salesValue: formatCurrency(outstandingBalance.totalDebt),
      statValue: `${outstandingBalance.clientsWithDebt} clients with overdue balances`,
      hideArrow: true,
      salesColor: "orange",
    },
    {
      heading: "Total transactions (Today)",
      salesValue: `${todaysTransactionCount}`, // Updated to use today's count
      statValue: formatChangeText(transactionCountChange), // Add percentage change
      color:
        transactionCountChange.direction === "increase"
          ? "green"
          : transactionCountChange.direction === "decrease"
          ? "red"
          : "blue",
      hideArrow: false, // Show arrow since we now have percentage change
    },
  ];

  // Fetch Suggestions based on invoice number
  const mergedTransactions = useMemo(() => {
    return (transactions ?? []).map((transaction) => {
      // get client id
      const clientId =
        typeof transaction.clientId === "string"
          ? transaction.clientId
          : transaction.clientId?._id;
      const client = clientId ? getClientById(clientId) : null;

      // get branch
      const branchId =
        typeof transaction.branchId === "string"
          ? transaction.branchId
          : transaction.branchId;
      const branch = branchId ? branches.find((b) => b._id === branchId) : null;

      return {
        ...transaction,
        client,
        branchName: branch?.name ?? "Unknown",
      };
    });
  }, [transactions, getClientById, branches]);

  const filteredTransactions = useMemo(() => {
    if (!mergedTransactions) return [];

    let filtered = [...mergedTransactions];

    // Client filter
    if (clientFilter === "registeredClient") {
      filtered = filtered.filter((tx) => tx.clientId && !tx.walkInClient);
    } else if (clientFilter === "unregisteredClient") {
      filtered = filtered.filter((tx) => tx.walkInClient && !tx.clientId);
    } else if (clientFilter === "allClients") {
      return filtered;
    }

    // Transaction type filter
    if (transactionTypeFilter?.toUpperCase() === "PURCHASE") {
      filtered = filtered.filter((tx) => tx.type === "PURCHASE");
    } else if (transactionTypeFilter === "PICKUP") {
      filtered = filtered.filter((tx) => tx.type === "PICKUP");
    }

    //date filter
    if (dateRangeFilter.from && dateRangeFilter.to) {
      filtered = filtered.filter((tx) => {
        const txDate = new Date(tx.createdAt);
        return txDate >= dateRangeFilter.from! && txDate <= dateRangeFilter.to!;
      });
    }
    return filtered;
  }, [
    clientFilter,
    transactionTypeFilter,
    dateRangeFilter,
    // debouncedSearchTerm,
    mergedTransactions,
  ]);

  // Use filteredTransactions for pagination instead of filterByInvoice
  const {
    currentPage,
    setCurrentPage,
    totalPages,
    goToPreviousPage,
    goToNextPage,
    canGoPrevious,
    canGoNext,
  } = usePagination((filteredTransactions ?? []).length, 20);

  const currentTransaction = useMemo(() => {
    const startIndex = (currentPage - 1) * 20;
    const endIndex = startIndex + 20;
    return filteredTransactions?.slice(startIndex, endIndex);
  }, [filteredTransactions, currentPage]);

  //
  const handleExportExcel = () => {
    const data =
      filteredTransactions &&
      filteredTransactions.map((txn) => ({
        "Invoice Number": txn.invoiceNumber,
        Date: new Date(txn.createdAt).toLocaleDateString("en-NG"),
        Name: txn.clientName || "Unregistered",
        "Type of Transaction": txn.type,
        Status: txn.status,
        Amount: txn.total,
        Balance: txn?.client != null ? txn?.client?.balance : "0.00",
      }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory");
    XLSX.writeFile(workbook, "transaction_export.xlsx");
    toast.success("Downloaded Successfully!");
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();

    const columns = [
      { header: "Invoice Number", dataKey: "invoiceNumber" },
      { header: "Date", dataKey: "date" },
      { header: "Name", dataKey: "clientName" },
      { header: "Type of Transaction", dataKey: "type" },
      { header: "Status", dataKey: "status" },
      { header: "Amount", dataKey: "total" },
      { header: "Balance", dataKey: "balance" },
    ];

    const rows = (filteredTransactions ?? []).map((t) => [
      t.invoiceNumber ?? "N/A",
      format(new Date(t.createdAt), "dd/MM/yyyy"),
      t.clientName ?? "N/A",
      t.type ?? "N/A",
      t.status ?? "N/A",
      t.total?.toLocaleString() ?? "0.00",
      (t.client?.balance != null
        ? t.client.balance
        : t.clientId?.balance ?? 0
      ).toLocaleString(),
    ]);

    doc.text("Transaction Export", 14, 16);
    autoTable(doc, {
      startY: 22,
      columns,
      body: rows,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [44, 204, 113] },
    });
    doc.save("transaction_export.pdf");
    toast.success("Downloaded Successfully!");
  };

  const fetchSuggestions = useCallback(
    async (query: string) => {
      const lowerQuery = query.toLowerCase();

      const matched = (transactions ?? []).filter((t) =>
        t.invoiceNumber?.toLowerCase().includes(lowerQuery)
      );

      return matched.map((t) => ({
        id: t._id,
        label: t.invoiceNumber ?? "Unnamed Invoice",
      }));
    },
    [transactions]
  );

  // 2. Handle selection of a transaction
  const onSelect = useCallback(
    (selected: { id: string; label: string }) => {
      const index = filteredTransactions.findIndex(
        (t) => t.invoiceNumber === selected.label
      );

      if (index === -1) return;

      const pageSize = 20;
      const targetPage = Math.floor(index / pageSize) + 1;

      if (targetPage !== currentPage) {
        setCurrentPage(targetPage);

        // Wait for page to update, then scroll
        setTimeout(() => {
          const target = document.getElementById(`invoice-${selected.label}`);
          if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "center" });
            target.classList.add("ring-2", "ring-blue-400", "rounded-md");
            setTimeout(() => {
              target.classList.remove("ring-2", "ring-blue-400", "rounded-md");
            }, 2000);
          }
        }, 300);
      } else {
        const target = document.getElementById(`invoice-${selected.label}`);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "center" });
          target.classList.add("ring-2", "ring-blue-400", "rounded-md");
          setTimeout(() => {
            target.classList.remove("ring-2", "ring-blue-400", "rounded-md");
          }, 2000);
        }
      }
    },
    [filteredTransactions, currentPage, setCurrentPage]
  );

  return (
    <div className="px-2 md:px-0">
      <Stats data={stats} />

      {/* Search bar for invoice number */}
      <div className="flex justify-between gap-2 items-center  sm:py-5 mt-5 mb-4 sm:mb-0 flex-wrap-reverse md:flex-nowrap">
        <div className="bg-[#F5F5F5] flex items-center gap-1 rounded-md w-full md:w-1/2">
          <SearchBar
            type="invoice"
            fetchSuggestions={fetchSuggestions}
            onSelect={onSelect}
            placeholder="Search by invoice..."
          />
        </div>
        <div className="flex items-center gap-4 pt-4 sm:pt-0 md:gap-3">
          <Button
            onClick={handleExportExcel}
            variant="secondary"
            className="w-42 md:w-50 h-10 bg-white text-base text-[#444444] border border-[#7d7d7d]"
          >
            Download Excel
          </Button>
          <Button onClick={handleExportPDF} className="w-42 md:w-50 h-10">
            Export PDF
          </Button>
        </div>
      </div>

      {/* filter buttons */}
      <div className="flex gap-2 flex-wrap md:gap-4 ">
        {/* filter by registered or unregisterd clients */}
        <Select value={clientFilter} onValueChange={setClientFilter}>
          <SelectTrigger className="bg-[#d9d9d9]! h-10 w-full md:w-46 text-[#444444] border-[#7D7D7D]">
            <SelectValue placeholder="Clients Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="allClients">All Clients</SelectItem>
              <SelectItem value="registeredClient">
                Registered Clients
              </SelectItem>
              <SelectItem value="unregisteredClient">
                Unregistered clients
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* filter by date */}
        <DateRangePicker
          value={dateRangeFilter}
          onChange={(range) => setDateRangeFilter(range)}
          className=" h-9 w-full md:w-46"
        />

        {/* filter by transaction type */}
        <Select
          value={transactionTypeFilter}
          onValueChange={setTransactionTypeFilter}
        >
          <SelectTrigger className="!bg-[#d9d9d9] h-10 w-full md:w-46 text-[#444444] border-[#7D7D7D]">
            <SelectValue placeholder="Transaction Type"></SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="allType">All Transaction Types</SelectItem>
              <SelectItem value="PURCHASE">Purchase</SelectItem>
              <SelectItem value="PICKUP">Pick Up</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Transaction table */}
      <div className="my-4 xl:shadow-lg rounded-xl overflow-hidden">
        <div className="xl:bg-white xl:border overflow-x-auto">
          <h5 className="bg-white text-[#1E1E1E] text-lg sm:text-xl font-medium py-3 my-4 pl-4 sm:pl-8 rounded-xl">
            All Transactions
          </h5>
          <TransactionTable currentTransaction={currentTransaction} />
          <TransactionsTableMobile currentTransaction={currentTransaction} />
        </div>
        {/* pagination */}
        {currentTransaction &&
          currentTransaction?.length > 0 &&
          totalPages > 1 && (
            <div className="h-14 bg-[#f5f5f5] text-sm text-[#7D7D7D] flex justify-center items-center gap-3">
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
    </div>
  );
};

export default Transactions;
