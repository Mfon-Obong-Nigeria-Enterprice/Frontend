import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { MdKeyboardArrowRight } from "react-icons/md";
import { formatCurrency } from "@/utils/formatCurrency";
import { useClientStore } from "@/stores/useClientStore";
import { getDaysSince } from "@/utils/helpersfunction";

import { useAuthStore } from "@/stores/useAuthStore";

import usePagination from "@/hooks/usePagination";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const OutstandingBalance = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // Use debtors directly from client store instead of merged transactions
  const { getClientsWithDebt } = useClientStore();
  const debtors = getClientsWithDebt();

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

  // get user role
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
    <div className="bg-white border border-[#D9D9D9] p-4 sm:p-8 mt-5  rounded-[8px] font-Inter">
      <h4 className="font-medium text-lg sm:text-xl text-text-dark mb-4 sm:mb-0">
        Outstanding Balances
      </h4>

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
        <>
          {/* ------------------- TABLET & DESKTOP VIEW (Table) ------------------- */}
          <div className="hidden md:block mt-5 sm:mt-8 border border-gray-300 rounded-t-xl">
            <Table className="rounded-t-xl overflow-hidden">
              <TableHeader>
                <TableRow className="bg-[#F0F0F3] border-b border-gray-300">
                  <TableHead className="w-[100px] text-start pl-4 font-medium text-[#333333] text-xs sm:text-base">
                    Client
                  </TableHead>
                  <TableHead className="text-center font-medium text-[#333333] text-xs sm:text-base">
                    Balance due
                  </TableHead>
                  <TableHead className="text-center font-medium text-[#333333] text-xs sm:text-base">
                    Days
                  </TableHead>
                  <TableHead className="text-center font-medium text-[#333333] text-xs sm:text-base">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {currentDebtors.map((client, index) => {
                  return (
                    <TableRow
                      key={client._id}
                      className={`border-b border-gray-300 ${
                        index % 2 !== 0 ? "bg-[#F0F0F3]" : ""
                      }`}
                    >
                      <TableCell className="font-medium pl-4 text-[#444444] text-xs sm:text-base capitalize">
                        {client.name}
                      </TableCell>
                      <TableCell className="text-center text-[#F95353] text-xs sm:text-base ">
                        -{formatCurrency(Math.abs(client.balance))}
                      </TableCell>
                      <TableCell className="text-center text-[#444444] text-xs sm:text-base">
                        {getDaysSince(
                          client.lastTransactionDate ||
                            client.updatedAt ||
                            client.createdAt
                        )}
                      </TableCell>
                      <TableCell className="text-center text-blue-400 underline cursor-pointer text-xs sm:text-base">
                        <button
                          onClick={() => navigate(`/clients/${client._id}`)}
                        >
                          View
                        </button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* ------------------- MOBILE VIEW (List) ------------------- */}
          <div className="block md:hidden mt-2">
            {currentDebtors.map((client) => (
              <div
                key={client._id}
                className="flex justify-between items-start border-b border-[#F0F0F3] py-3 last:border-0"
              >
                <div className="flex flex-col gap-1">
                  <span className="font-medium text-sm text-[#333333] capitalize">
                    {client.name}
                  </span>
                  <span className="text-xs text-[#7D7D7D]">
                    {getDaysSince(
                      client.lastTransactionDate ||
                        client.updatedAt ||
                        client.createdAt
                    )}
                  </span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="font-medium text-sm text-[#F95353]">
                    -{formatCurrency(Math.abs(client.balance))}
                  </span>
                  <button
                    onClick={() => navigate(`/clients/${client._id}`)}
                    className="text-xs text-[#3D80FF] underline cursor-pointer"
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ------------------- PAGINATION (Visible on Both) ------------------- */}
          {debtors.length > 0 && totalPages > 1 && (
            <div className="h-14 bg-[#f5f5f5] text-sm text-[#7D7D7D] flex justify-center items-center gap-3 mt-4 md:mt-0 rounded-b-xl md:rounded-none">
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
                  <PaginationItem>
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
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}

      <div className="mt-4 md:mt-[7dvh]">
        <button
          className="bg-transparent md:bg-[#f0f0f3] w-full flex justify-center md:justify-between px-5 cursor-pointer text-[#3D80FF] hover:text-[#3D80FF]/80 py-2 md:py-4 font-medium text-sm"
          onClick={handleButtonNavigate}
        >
          View all Balances
          <MdKeyboardArrowRight
            size={24}
            className="mr-5 text-[#3D80FF] hidden md:block"
          />
        </button>
      </div>

      {/* {open && selectedTransaction && <ClientTransactionModal />} */}
    </div>
  );
};

export default OutstandingBalance;