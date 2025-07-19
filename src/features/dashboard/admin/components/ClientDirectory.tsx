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
import React, { useEffect, useMemo, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
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
// import { MoveRight, MoveLeft } from "lucide-react";

interface ClientDirectoryProps {
  searchTerm: string;
}

const ClientDirectory: React.FC<ClientDirectoryProps> = ({ searchTerm }) => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [dialog, setDialog] = useState<"view" | "delete" | null>(null);
  const { clients, initializeStore, fetchClient, deleteClient } =
    useClientStore();

  useEffect(() => {
    const initialize = async () => {
      try {
        await initializeStore();
        await fetchClient();
      } catch (error) {
        console.error("failed to initialize store", error);
      }
    };
    initialize();
  }, [initializeStore, fetchClient]);

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client._id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // thisi is where the transaction is coming from
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
    // const clientTransactions = transactions
    //   .filter((tr: TransactionItem) => tr._id === clientId)
    //   .sort(
    //     (a: TransactionItem, b: TransactionItem) =>
    //       new Date(b.date).getTime() - new Date(a.date).getTime()
    //   );

    return sortedTransaction[0] || null;
  };
  const formatCurrency = (value: number) => `₦${value.toLocaleString()}`;

  const {
    currentPage,
    totalPages,
    goToPreviousPage,
    goToNextPage,
    canGoPrevious,
    canGoNext,
  } = usePagination(filteredClients.length, 4);

  // Memomized curent page using useMemo since the value is an object

  const currentClient = useMemo(() => {
    const startIndex = (currentPage - 1) * 4;
    const endIndex = startIndex + 4;
    return filteredClients.slice(startIndex, endIndex);
  }, [filteredClients, currentPage]);

  const getBalanceStatus = (balance: number) => {
    if (balance > 0) {
      return {
        status: "Credit",
        variant: "default" as const,
        color: "text-green-500",
      };
    } else if (balance < 0) {
      return {
        status: "Debt",
        variant: "destructive" as const,
        color: "text-emerald-500",
      };
    }
    return {
      status: "Zero",
      variant: "secondary" as const,
      color: "text-neutral-700",
    };
  };

  const handleAction = (client: Client, action: "view" | "delete") => {
    setSelectedClient(client);
    setDialog(action);
  };

  const deleteClientData = async () => {
    if (!selectedClient) return;
    try {
      await deleteClient(selectedClient._id);
      setSelectedClient(null);
      setDialog(null);
      console.log("Client deleted successfully");
    } catch (error: any) {
      console.error("Deletion failed:", error);

      // Handle specific error types
      if (error?.response?.status === 403) {
        alert(
          "You don't have permission to delete this client. Please check your access rights."
        );
      } else if (error?.response?.status === 401) {
        alert("Your session has expired. Please log in again.");
        // Redirect to login or refresh token
      } else {
        alert("Failed to delete client. Please try again.");
      }
    }
  };

  return (
    <div className="mt-7 mb-2 px-4 ">
      <Card>
        <CardContent>
          <Table>
            <TableHeader className="bg-[#D9D9D9]">
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
                const balanceStatus = getBalanceStatus(client.balance);
                return (
                  <TableRow key={client._id}>
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
                      <Badge variant="outline" className="capitalize p-2">
                        {lastTransaction ? lastTransaction.type : "New Client"}
                      </Badge>
                    </TableCell>

                    {/*  clients Amount */}
                    <TableCell>
                      <div>
                        <p className="font-[400] text-[#444444] text-sm">
                          {lastTransaction
                            ? `₦${lastTransaction.amount.toLocaleString()}`
                            : "₦0"}
                        </p>
                      </div>
                    </TableCell>

                    {/* client balance */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={`font-medium ${balanceStatus.color}`}>
                          {formatCurrency(Math.abs(client.balance))}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="link"
                            size="icon"
                            className="text-[#3D80FF] text-sm underline ring-offset-1 font-[400] cursor-pointer"
                          >
                            View
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleAction(client, "view")}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            view Details
                          </DropdownMenuItem>
                          {/*  */}
                          <DropdownMenuItem
                            onClick={() => handleAction(client, "delete")}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}

              {/*  */}

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

      <Dialog open={dialog === "view"} onOpenChange={() => setDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clients Details - {selectedClient?.name}</DialogTitle>
          </DialogHeader>
          {selectedClient && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Name</Label>
                  <p className="font-Inter">{selectedClient.name}</p>
                </div>
              </div>

              <div>
                <Label>Current Balance</Label>
                <p
                  className={`font-bold text-lg ${
                    getBalanceStatus(selectedClient.balance).color
                  }`}
                >
                  {formatCurrency(Math.abs(selectedClient.balance))}
                  <span className="text-sm ml-2">
                    ({getBalanceStatus(selectedClient.balance).status})
                  </span>
                </p>
              </div>

              {/*  */}

              <div className="text-sm text-muted-foreground">
                <p>
                  Created:{" "}
                  {new Date(selectedClient.createdAt).toLocaleDateString()}
                </p>
                <p>
                  Updated:{" "}
                  {new Date(selectedClient.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={dialog === "delete"} onOpenChange={() => setDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Client</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>
              Are you sure you want to delete{" "}
              <strong>{selectedClient?.name}</strong>?
            </p>
            <p className="text-sm text-muted-foreground">
              This action cannot be undone. All transaction history will be
              preserved but the client record will be removed.
            </p>

            <div className="flex gap-2">
              <Button
                variant="destructive"
                onClick={deleteClientData}
                className="flex-1"
              >
                Delete Client
              </Button>
              <Button variant="outline" onClick={() => setDialog(null)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* <table className="w-full">
        <thead className="bg-[#F5F5F5] border border-[#d9d9d9]">
          <tr>
            <th className="py-3 text-base text-[#333333] font-normal text-center">
              Date
            </th>
            <th className="py-3 text-base text-[#333333] font-normal text-center">
              Clients
            </th>
            <th className="py-3 text-base text-[#333333] font-normal text-center">
              Type
            </th>
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
          {transactionData.map((transaction, i) => {
            return (
              <tr key={i} className="border-b border-[#d9d9d9]">
                <td className=" text-center text-[#7D7D7D] text-sm font-normal py-3">
                  {transaction.date}
                </td>
                <td className=" text-center text-[#7D7D7D] text-sm font-normal py-3">
                  {transaction.client}
                </td>
                <td className="text-center">
                  <span
                    className={`border text-sm py-1.5 px-3 rounded-[6.25rem] ${
                      transaction.type === "Debit"
                        ? "border-[#F95353] bg-[#FFCACA] text-[#F95353]"
                        : transaction.type === "Credit"
                        ? "border-[#2ECC71] bg-[#C8F9DD] text-[#2ECC71]"
                        : "border-[#FFA500] bg-[#FFE7A4] text-[#FFA500]"
                    }`}
                  >
                    {transaction.type}
                  </span>
                </td>

                <td
                  className={`text-sm text-center ${
                    transaction.amount.includes("-")
                      ? "text-[#F95353]"
                      : "text-[#2ECC71]"
                  }`}
                >
                  {transaction.amount}
                </td>
                <td
                  className={`text-sm text-center ${
                    transaction.balance.includes("-")
                      ? "text-[#F95353]"
                      : transaction.balance.startsWith("₦0")
                      ? "text-[#444444]"
                      : "text-[#2ECC71]"
                  }`}
                >
                  {transaction.balance}
                </td>

                <td className="text-center underline text-[#3D80FF] text-sm">
                  View
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="h-16 bg-[#f5f5f5] flex justify-center items-center gap-3 rounded-b-[0.625rem] ">
        <MoveLeft />
        Page 1 of 1
        <MoveRight />
      </div> */}
    </div>
  );
};

export default ClientDirectory;
