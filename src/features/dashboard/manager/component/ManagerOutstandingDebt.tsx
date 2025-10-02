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
import { ChevronLeft, ChevronRight } from "lucide-react";
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
  return (
    <div className="bg-[#FFFFFF] border-1 border-[#D9D9D9] py-5 px-7">
      <h4 className="font-medium text-lg sm:text-xl text-text-dark pt-3 pl-6">
        Outstanding Balance
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
          currentDebtors.map((client, index) => {
            return (
              <div
                key={`${client._id}-${index}`}
                className={`border-b border-gray-300 flex justify-between items-center pt-4 `}
              >
                <p className="font-medium  text-[#444444] text-xs sm:text-base capitalize">
                  {client.name}
                </p>
                <p className="text-start text-[#F95353] text-xs sm:text-base ">
                  -{formatCurrency(Math.abs(client.balance))}
                </p>
              </div>
            );
          })
        )}
      </div>

      {debtors.length > 0 && totalPages > 1 && (
        <div className="h-12 text-sm text-[#7D7D7D] flex justify-center items-center gap-3">
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
  );
};

export default ManagerOutstandingDebt;
