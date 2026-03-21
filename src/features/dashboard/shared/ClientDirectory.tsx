/** @format */

import React, { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Client } from "@/types/types";
import type { Transaction } from "@/types/transactions";
import usePagination from "@/hooks/usePagination";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/formatCurrency";
import { useNavigate } from "react-router-dom";
import { getTransactionDateString } from "@/utils/transactions";
import { useQuery } from "@tanstack/react-query";
import { getAllTransactions } from "@/services/transactionService";
import { getTransactionTypeBadgeStyles } from "@/utils/transactionTypeStyles";
import { Skeleton } from "@/components/ui/skeleton";

interface ClientDirectoryProps {
  searchTerm: string;
  filteredClientsData: Client[];
  onClientAction?: (client: Client) => void;
  onDepositAction?: (client: Client) => void;
  actionLabel?: string;
  isStaffView?: boolean;
}

const ClientDirectory: React.FC<ClientDirectoryProps> = ({
  searchTerm,
  filteredClientsData,
  onClientAction,
  onDepositAction,
  actionLabel = "view",
  isStaffView = false,
}) => {
  const navigate = useNavigate();

  const { data: allTransactions, isLoading: isTransactionsLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: getAllTransactions,
    staleTime: 5 * 60 * 1000,
  });

  const latestTransactionMap = useMemo(() => {
    if (!allTransactions) return new Map<string, Transaction>();
    const sorted = [...allTransactions].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    const map = new Map<string, Transaction>();
    sorted.forEach((txn) => {
      const clientId =
        (typeof txn.clientId === "object" ? txn.clientId?._id : txn.clientId) ||
        (typeof txn.client === "object" ? txn.client?._id : undefined);
      if (clientId && !map.has(clientId)) map.set(clientId, txn);
    });
    return map;
  }, [allTransactions]);

  const filteredClients = filteredClientsData.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client._id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get the last transaction for a client
  const getClientTransaction = (client: Client) => {
    if (
      !client.transactions ||
      !Array.isArray(client.transactions) ||
      client.transactions.length === 0
    ) {
      return null;
    }

    const sortedTransaction = [...client.transactions].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return sortedTransaction[0] || null;
  };

  const ITEMS_PER_PAGE = 10;

  const {
    currentPage,
    totalPages,
    goToPreviousPage,
    goToNextPage,
    canGoPrevious,
    canGoNext,
  } = usePagination(filteredClients.length, ITEMS_PER_PAGE);

  const currentClient = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredClients.slice(startIndex, endIndex);
  }, [filteredClients, currentPage]);

  const handleViewClient = (client: Client) => {
    if (onClientAction) {
      onClientAction(client);
    } else {
      navigate(`/clients/${client._id}`);
    }
  };

  return (
    <div className="mt-7 mb-2 hidden lg:block">
      <Card>
        <CardContent>
          <Table>
            <TableHeader className="bg-[#D9D9D9] ">
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Clients</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Transaction</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isTransactionsLoading && Array.from({ length: 8 }).map((_, i) => (
                <TableRow key={`skeleton-${i}`}>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-16 rounded" /></TableCell>
                </TableRow>
              ))}
              {!isTransactionsLoading && currentClient.map((client) => {
                const lastTransaction = getClientTransaction(client);
                const latestTransaction = latestTransactionMap.get(client._id);
                const isOwing = client.balance < 0;

                return (
                  <TableRow key={client._id} className="text-start">
                    <TableCell>
                      <div>
                        <p className="font-[400] text-[#444444] text-sm">
                          {lastTransaction
                            ? new Date(
                                lastTransaction.date
                              ).toLocaleDateString()
                            : getTransactionDateString(client)}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell className=" md:w-[95px]  lg:w-[125px] lg:pr-5 pr-10">
                      <div>
                        <p className="font-[400] text-[#444444] text-sm capitalize">
                          {client.name}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getTransactionTypeBadgeStyles(
                          latestTransaction?.type || "N/A"
                        )}`}
                      >
                        {latestTransaction?.type || "New Client"}
                      </span>
                    </TableCell>

                    <TableCell>
                      <p
                        className={`font-medium text-sm ${
                          latestTransaction?.type === "DEPOSIT" || latestTransaction?.type === "RETURN"
                            ? "text-[#2ECC71]"
                            : latestTransaction
                            ? "text-[#F95353]"
                            : "text-[#444444]"
                        }`}
                      >
                        {latestTransaction
                          ? `${latestTransaction.type === "DEPOSIT" || latestTransaction.type === "RETURN" ? "+" : "-"}₦${Math.abs(latestTransaction.total ?? 0).toLocaleString()}`
                          : "₦0"}
                      </p>
                    </TableCell>

                    <TableCell>
                      <div>
                        <span
                          className={`font-medium ${
                            client.balance > 0
                              ? "text-green-400"
                              : client.balance < 0
                              ? "text-red-400"
                              : "text-gray-300"
                          } `}
                        >
                          {formatCurrency(client.balance)}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      {isStaffView ? (
                        <Button
                          variant="ghost"
                          className="w-40 border-[#3D80FF] border text-[#3D80FF] cursor-pointer hover:text-[#3D80FF] transition-colors duration-200 ease-in-out"
                          onClick={() => handleViewClient(client)}
                        >
                          {isOwing ? "Add payment" : "Deposit"}
                        </Button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="link"
                            size="icon"
                            className="text-[#3D80FF] text-sm underline ring-offset-1 font-[400] cursor-pointer"
                            onClick={() => handleViewClient(client)}
                          >
                            {actionLabel}
                          </Button>
                          {onDepositAction && (
                            <Button
                              variant="ghost"
                              className="ml-6 border-[#3D80FF] border text-[#3D80FF] cursor-pointer hover:text-[#3D80FF] transition-colors duration-200 ease-in-out text-xs px-2 h-8"
                              onClick={() => onDepositAction(client)}
                            >
                              Deposit
                            </Button>
                          )}
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}

              {!isTransactionsLoading && currentClient.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-4 text-muted-foreground"
                  >
                    No clients found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {currentClient.length > 0 && totalPages > 1 && (
            <div className="mt-6 flex justify-center">
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
                    >
                      <button
                        aria-label="previous page"
                        disabled={!canGoPrevious}
                      >
                        <FaArrowLeft className="w-5 h-5 mr-2" />
                      </button>
                    </PaginationPrevious>
                  </PaginationItem>

                  <PaginationItem>
                    <span className="px-4 text-sm text-gray-600">
                      Page {currentPage} of {totalPages}
                    </span>
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
                      <FaArrowRight className="w-5 h-5" />
                    </PaginationNext>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientDirectory;
