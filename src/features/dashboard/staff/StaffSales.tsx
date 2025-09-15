import { useState, useMemo } from "react";

// components
import DashboardTitle from "../shared/DashboardTitle";
import MySalesActivity from "./components/desktop/MySalesActivity";
import MobileSalesActivity from "./components/mobile/MobileSalesActivity";
import WaybillModal from "./components/WaybillModal"; // Import the new modal

// ui
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// icons
import { VscRefresh } from "react-icons/vsc";
import { ChevronLeft, ChevronRight } from "lucide-react";

// stores
import { useTransactionsStore } from "@/stores/useTransactionStore";

// hooks
import usePagination from "@/hooks/usePagination";

const StaffSales = () => {
  const transactions = useTransactionsStore(
    (state) => state.transactions ?? []
  );

  const [filter, setFilter] = useState<"today" | "week" | "month">("today");
  const [isWaybillModalOpen, setIsWaybillModalOpen] = useState(false); // Add modal state

  // filter transaction
  const filteredTransactions = useMemo(() => {
    const now = new Date();
    return transactions?.filter((tx) => {
      const txDate = new Date(tx.createdAt);

      if (filter === "today") {
        return (
          txDate.getDate() === now.getDate() &&
          txDate.getMonth() === now.getMonth() &&
          txDate.getFullYear() === now.getFullYear()
        );
      }

      if (filter === "week") {
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay()); // sunday
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        return txDate >= startOfWeek && txDate <= endOfWeek;
      }

      if (filter === "month") {
        return (
          txDate.getMonth() === now.getMonth() &&
          txDate.getFullYear() === now.getFullYear()
        );
      }

      return true;
    });
  }, [transactions, filter]);

  //  use filtered transaction for pagination
  const {
    currentPage,
    totalPages,
    goToPreviousPage,
    goToNextPage,
    canGoPrevious,
    canGoNext,
  } = usePagination((filteredTransactions ?? []).length, 5);

  const currentTransaction = useMemo(() => {
    const startIndex = (currentPage - 1) * 5;
    const endIndex = startIndex + 5;
    return filteredTransactions?.slice(startIndex, endIndex);
  }, [filteredTransactions, currentPage]);

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between gap-3">
        <DashboardTitle
          heading="My Sales"
          description="View your sales activity"
        />

        {/* buttons */}
        <div className="flex gap-5">
          <Button
            variant="tertiary"
            onClick={() => window.location.reload()}
            className="min-w-40 border-[#7d7d7d]"
          >
            <VscRefresh />
            Refresh
          </Button>
          <Button
            className="min-w-40"
            onClick={() => setIsWaybillModalOpen(true)} // Open modal on click
          >
            <img src="/icons/brick.svg" alt="" className="w-4" />
            Add Waybill
          </Button>
        </div>
      </div>

      {/* sales activity */}
      <section className="md:bg-white md:border rounded-[10px] mt-5 overflow-hidden">
        <div className="flex justify-between items-center h-[72px] border px-2 md:px-10 py-6">
          <h4 className="hidden md:block font-medium text-lg text-[#1E1E1E] font-Inter">
            Your Sales Activity
          </h4>
          <div className="flex gap-3 items-center">
            {["today", "week", "month"].map((f) => (
              <p
                key={f}
                onClick={() => setFilter(f as "today" | "week" | "month")}
                className={`cursor-pointer px-5 py-3 rounded-[2px] text-sm font-Inter  hidden md:block ${
                  filter === f
                    ? "bg-[#D8E5FE] text-[#3D80FF]"
                    : "bg-transparent text-[#444444]"
                }`}
              >
                {f === "today"
                  ? "Today"
                  : f === "week"
                  ? "This Week"
                  : "This Month"}
              </p>
            ))}
            <div className="md:hidden w-full">
              <Tabs
                value={filter}
                onValueChange={(val) =>
                  setFilter(val as "today" | "week" | "month")
                }
              >
                <TabsList className="grid grid-cols-3 w-full md:hidden">
                  <TabsTrigger
                    value="today"
                    className="w-full px-5 py-3 text-sm font-Inter 
                 data-[state=active]:bg-[#3D80FF] data-[state=active]:text-white 
                 data-[state=inactive]:bg-transparent data-[state=inactive]:text-[#444444]"
                  >
                    Today
                  </TabsTrigger>
                  <TabsTrigger
                    value="week"
                    className="w-full px-5 py-3 text-sm font-Inter 
                  data-[state=active]:bg-[#3D80FF] data-[state=active]:text-white 
                  data-[state=inactive]:bg-transparent data-[state=inactive]:text-[#444444]"
                  >
                    This Week
                  </TabsTrigger>
                  <TabsTrigger
                    value="month"
                    className="w-full px-5 py-3 text-sm font-Inter 
                 data-[state=active]:bg-[#3D80FF] data-[state=active]:text-white 
                 data-[state=inactive]:bg-transparent data-[state=inactive]:text-[#444444]"
                  >
                    This Month
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>
        <MySalesActivity filteredTransactions={currentTransaction} />
        <MobileSalesActivity filteredTransactions={currentTransaction} />

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
      </section>

      {/* Waybill Modal */}
      <WaybillModal
        isOpen={isWaybillModalOpen}
        onClose={() => setIsWaybillModalOpen(false)}
        transactions={transactions} // Pass all transactions for recent selection
      />
    </div>
  );
};

export default StaffSales;
