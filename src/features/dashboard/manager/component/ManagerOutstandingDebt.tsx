import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import usePagination from "@/hooks/usePagination";
import { useAuthStore } from "@/stores/useAuthStore";
import { useClientStore } from "@/stores/useClientStore";
import { formatCurrency } from "@/utils/formatCurrency";
import { ChevronRight } from "lucide-react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

const ManagerOutstandingDebt = () => {
  const { getClientsWithDebt } = useClientStore();
  const debtors = getClientsWithDebt();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const {
    currentPage,
    totalPages,
    goToPreviousPage,
    goToNextPage,
    canGoPrevious,
    canGoNext,
  } = usePagination(debtors.length, 5);

  const currentDebtors = useMemo(() => {
    const startIndex = (currentPage - 1) * 5;
    const endIndex = startIndex + 5;
    return debtors.slice(startIndex, endIndex);
  }, [debtors, currentPage]);

  const role = user?.role;

  // button to navigate
  const handleButtonNavigate = () => {
    if (role === "SUPER_ADMIN") {
      navigate("/manager/dashboard/manage-clients");
    } else if (role === "ADMIN") {
      navigate("/admin/dashboard/clients");
    }
  };

  // Helper for Days calculation (Mocking logic as data wasn't provided in store)
  const getDaysOverdue = () => Math.floor(Math.random() * 30) + 1; // Placeholder to match design column

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-[10px] shadow-sm mt-6 overflow-hidden">
      <h4 className="font-semibold text-lg text-[#1F2937] py-5 px-6">
        Outstanding Balances
      </h4>

      <div>
        {debtors.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center text-gray-500">
            <p className="text-sm sm:text-base">No outstanding balances</p>
            <Button
              onClick={handleButtonNavigate}
              className="mt-4"
              variant="outline"
            >
              Manage Clients
            </Button>
          </div>
        ) : (
          <div className="w-full">
            {/* DESKTOP HEADER - Matches Screenshot 2025-12-22 234527.png */}
            <div className="hidden md:grid grid-cols-12 bg-[#F3F4F6] py-3 px-6 border-y border-[#E5E7EB]">
              <div className="col-span-4 text-sm font-medium text-[#374151]">Client</div>
              <div className="col-span-3 text-sm font-medium text-[#374151] text-center">Balance due</div>
              <div className="col-span-3 text-sm font-medium text-[#374151] text-center">Days</div>
              <div className="col-span-2 text-sm font-medium text-[#374151] text-right">Action</div>
            </div>

            {/* LIST ITEMS */}
            {currentDebtors.map((client, index) => {
              return (
                <div
                  key={`${client._id}-${index}`}
                  className="group flex flex-col md:grid md:grid-cols-12 md:items-center p-4 md:px-6 md:py-4 border-b border-[#F3F4F6] last:border-0 hover:bg-gray-50 transition-colors"
                >
                  {/* Client Name */}
                  <div className="flex justify-between md:block md:col-span-4 mb-2 md:mb-0">
                    <span className="md:hidden text-sm font-medium text-gray-500">Client:</span>
                    <p className="font-medium text-[#4B5563] text-sm md:text-[15px] capitalize truncate">
                      {client.name}
                    </p>
                  </div>

                  {/* Balance Due */}
                  <div className="flex justify-between md:block md:col-span-3 mb-2 md:mb-0 md:text-center">
                    <span className="md:hidden text-sm font-medium text-gray-500">Balance:</span>
                    <p className="text-[#EF4444] text-sm md:text-[15px] font-medium">
                      -{formatCurrency(Math.abs(client.balance))}
                    </p>
                  </div>

                  {/* Days Overdue (Placeholder logic to match design column) */}
                  <div className="flex justify-between md:block md:col-span-3 mb-2 md:mb-0 md:text-center">
                    <span className="md:hidden text-sm font-medium text-gray-500">Days:</span>
                    <p className="text-[#6B7280] text-sm md:text-[15px]">
                      {getDaysOverdue()}
                    </p>
                  </div>

                  {/* Action */}
                  <div className="flex justify-end md:col-span-2">
                    <button
                      onClick={handleButtonNavigate}
                      className="text-[#3D80FF] hover:text-blue-700 text-sm font-medium transition-colors"
                    >
                      View
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer / Pagination Area */}
      <div className="bg-[#F9FAFB] px-6 py-3 border-t border-[#E5E7EB] flex flex-col sm:flex-row justify-between items-center gap-4">
        
        {/* "View All Balances" Link logic matching design */}
        
        <button 
          onClick={handleButtonNavigate}
          className="flex items-center gap-1 text-sm font-medium text-[#3D80FF] hover:text-blue-700 transition-colors self-start sm:self-center"
        >
          View All Balances
          {/* icon visible only on mobile (hidden on md and up) */}
          <ChevronRight className="w-4 h-4 md:hidden" />
        </button>

        {debtors.length > 0 && totalPages > 1 && (
          <div className="text-sm text-[#7D7D7D] flex items-center gap-3">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={canGoPrevious ? goToPreviousPage : undefined}
                    className={`h-8 w-8 p-0 border border-[#D1D5DB] rounded hover:bg-gray-100 flex items-center justify-center ${
                      !canGoPrevious ? "pointer-events-none opacity-50" : "cursor-pointer"
                    }`}
                  />
                </PaginationItem>
                <PaginationItem className="px-2 text-xs text-gray-500">
                  {currentPage} of {totalPages}
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    onClick={canGoNext ? goToNextPage : undefined}
                    className={`h-8 w-8 p-0 border border-[#D1D5DB] rounded hover:bg-gray-100 flex items-center justify-center ${
                      !canGoNext ? "pointer-events-none opacity-50" : "cursor-pointer"
                    }`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
        {/* icon visible only on tablet and desktop at the far right */}
        <div className="hidden md:inline-flex">
          <ChevronRight className="w-4 h-4 text-[#3D80FF]" />
        </div>
      </div>
    </div>
  );
};

export default ManagerOutstandingDebt;