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
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/utils/formatCurrency";
import { useNavigate } from "react-router-dom";
import { getBalanceStatus, getTypeDisplay } from "@/utils/helpersfunction";

interface ClientDirectoryProps {
  searchTerm: string;
  filteredClientsData: [];
  onClientAction?: (client: Client) => void;
  actionLabel?: string;
}

const ClientDirectory: React.FC<ClientDirectoryProps> = ({
  searchTerm,
  filteredClientsData,
  onClientAction,
  actionLabel = "view",
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

  // this is where the transaction is coming from
  const getClientTransaction = (client: Client) => {
    if (
      !client.transactions ||
      !Array.isArray(client.transactions) ||
      client.transactions.length === 0
    ) {
      return null;
    }

    const sortedTransaction = [...client.transactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
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
  } = usePagination(filteredClients.length, 4);

  // Memoized current page using useMemo since the value is an object
  const currentClient = useMemo(() => {
    const startIndex = (currentPage - 1) * 4;
    const endIndex = startIndex + 4;
    return filteredClients.slice(startIndex, endIndex);
  }, [filteredClients, currentPage]);

  const handleViewClient = (client: Client) => {
    // Navigate to client details page
    if (onClientAction) {
      onClientAction(client);
    } else {
      navigate(`/clients/${client._id}`);
    }
  };

  console.log("clients", clients);

  return (
    <div className="mt-7 mb-2 px-4 ">
      <Card>
        <CardContent className="text-center">
          <Table>
            <TableHeader className="bg-[#D9D9D9] ">
              <TableRow>
                <TableHead className="text-center">Date</TableHead>
                <TableHead className="text-center">Clients</TableHead>
                <TableHead className="text-center">Type</TableHead>
                <TableHead className="text-center">Amount</TableHead>
                <TableHead className="text-center">Balance</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-center">
              {currentClient.map((client) => {
                const lastTransaction = getClientTransaction(client);
                const balanceStatus = getBalanceStatus(client?.balance);
                return (
                  <TableRow key={client._id} className="text-center">
                    <TableCell>
                      <div>
                        <p className="font-[400] text-[#444444] text-sm">
                          {lastTransaction
                            ? new Date(
                                lastTransaction.date
                              ).toLocaleDateString()
                            : new Date(client.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </TableCell>

                    {/* registered clients */}
                    <TableCell>
                      <div>
                        <p className="font-[400] text-[#444444] text-sm">
                          {client.name}
                        </p>
                      </div>
                    </TableCell>

                    {/* transaction type */}
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`uppercase p-2 w-[85px] text-[12px] ${
                          lastTransaction?.type === "PURCHASE"
                            ? "border border-[#F95353] bg-[#FFCACA] text-[#F95353] rounded-2xl"
                            : lastTransaction?.type === "PICKUP" //will be figured out later
                            ? "border border-[#FFA500] bg-[#FFE7A4] text-[#FFA500] rounded-2xl"
                            : lastTransaction?.type === "DEPOSIT"
                            ? "border border-[#2ECC71] bg-[#C8F9DD] text-[#2ECC71] rounded-2xl"
                            : "bg-gray-100 rounded-2xl text-gray-300 border border-gray-300 "
                        }`}
                      >
                        {lastTransaction &&
                          getTypeDisplay(lastTransaction.type)}
                      </Badge>
                    </TableCell>

                    {/* clients Amount */}
                    <TableCell>
                      <div>
                        <p className={`font-[400] text-[#444444] text-sm `}>
                          {lastTransaction
                            ? formatCurrency(lastTransaction.amount)
                            : "₦0"}
                        </p>
                      </div>
                    </TableCell>

                    {/* client balance */}
                    <TableCell>
                      <div>
                        <span className={`font-medium  ${balanceStatus.color}`}>
                          {formatCurrency(Math.abs(Number(client.balance)))}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Button
                        variant="link"
                        size="icon"
                        className="text-[#3D80FF] text-sm underline ring-offset-1 font-[400] cursor-pointer"
                        onClick={() => handleViewClient(client)}
                      >
                        {actionLabel}
                      </Button>
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

          {/* pagination state */}
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
