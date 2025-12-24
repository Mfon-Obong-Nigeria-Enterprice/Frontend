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
import { useClientStore } from "@/stores/useClientStore";
import type { Client } from "@/types/types";
import { Badge } from "@/components/ui/badge";
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
import { getTypeDisplay } from "@/utils/helpersfunction";
import {
  getTransactionDate,
  getTransactionDateString,
} from "@/utils/transactions";

interface ClientDirectoryProps {
  searchTerm: string;
  filteredClientsData: Client[];
  onClientAction?: (client: Client) => void;
  actionLabel?: string;
  isStaffView?: boolean;
}

const ClientDirectory: React.FC<ClientDirectoryProps> = ({
  searchTerm,
  filteredClientsData,
  onClientAction,
  actionLabel = "view",
  isStaffView = false,
}) => {
  const { clients } = useClientStore();
  const navigate = useNavigate();

  const filteredClients = (
    filteredClientsData.length > 0 ? filteredClientsData : clients ?? []
  ).filter(
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
        getTransactionDate(b).getTime() - getTransactionDate(a).getTime()
    );
    return sortedTransaction[0] || null;
  };

  const {
    currentPage,
    totalPages,
    goToPreviousPage,
    goToNextPage,
    canGoPrevious,
    canGoNext,
  } = usePagination(filteredClients.length, 3);

  const currentClient = useMemo(() => {
    const startIndex = (currentPage - 1) * 3;
    const endIndex = startIndex + 3;
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
                <TableHead>Amount</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentClient.map((client) => {
                const lastTransaction = getClientTransaction(client);
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
                      <Badge
                        variant="outline"
                        className={`uppercase p-2 md:w-full  lg:w-[85px] text-[12px] border rounded-2xl ${
                          lastTransaction?.type === "PURCHASE"
                            ? "border border-[#F95353] bg-[#FFCACA] text-[#F95353] rounded-2xl"
                            : lastTransaction?.type === "PICKUP"
                            ? "border border-[#FFA500] bg-[#FFE7A4] text-[#FFA500] rounded-2xl"
                            : lastTransaction?.type === "DEPOSIT"
                            ? "border border-[#2ECC71] bg-[#C8F9DD] text-[#2ECC71] rounded-2xl"
                            : "bg-gray-100 rounded-2xl text-gray-300 border border-gray-300 "
                        }`}
                      >
                        {lastTransaction
                          ? getTypeDisplay(lastTransaction.type)
                          : "New Client"}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div>
                        <p className={`font-[400] text-[#444444] text-sm `}>
                          {lastTransaction
                            ? formatCurrency(lastTransaction.amountPaid || 0)
                            : "₦0"}
                        </p>
                      </div>
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
                        <Button
                          variant="link"
                          size="icon"
                          className="text-[#3D80FF] text-sm underline ring-offset-1 font-[400] cursor-pointer"
                          onClick={() => handleViewClient(client)}
                        >
                          {actionLabel}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}

              {currentClient.length === 0 && (
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
