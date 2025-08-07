// components
import ClientTransactionModal from "@/features/dashboard/shared/ClientTransactionModal";
import WalkinTransactionModal from "@/features/dashboard/shared/WalkinTransactionModal";
import SearchBar from "@/features/dashboard/shared/SearchBar";

// ui
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// icons
import { ChevronDown } from "lucide-react";

// stores
import { useTransactionsStore } from "@/stores/useTransactionStore";

// utils
import { toSentenceCaseName } from "@/utils/styles";

// types
import type { Transaction } from "@/types/transactions";

//hooks
import { useTransactionSearch } from "@/hooks/useTransactionSearch";

const SalesTableData = ({
  currentTransaction,
  setCurrentPage,
}: {
  currentTransaction: Transaction[];
  setCurrentPage: (page: number) => void;
}) => {
  const { open, openModal, selectedTransaction } = useTransactionsStore();

  const { fetchSuggestions, onSelect } = useTransactionSearch({
    type: "client",
    pageSize: 5,
    onPageChange: (page: number) => setCurrentPage(page),
  });

  const formatCurrency = (value: number) => `₦${value.toLocaleString()}`;

  return (
    <div className="bg-white px-8 py-6 rounded-lg font-Inter">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
            <CardTitle className="text-[#1E1E1E] text-xl font-medium">
              Recent Sales
            </CardTitle>
            <div className="w-full sm:w-1/2">
              <SearchBar
                type="client"
                placeholder="Search by client name..."
                fetchSuggestions={fetchSuggestions}
                onSelect={onSelect}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-[#D9D9D9]">
                <TableHead className="text-[#333333] text-base">Time</TableHead>
                <TableHead className="text-[#333333] text-base">
                  Client
                </TableHead>
                <TableHead className="text-[#333333] text-base">
                  Items
                </TableHead>
                <TableHead className="text-[#333333] text-base">
                  Amount
                </TableHead>
                <TableHead className="text-[#333333] text-base">
                  Staff
                </TableHead>
                <TableHead className="text-[#333333] text-base">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentTransaction && currentTransaction.length > 0 ? (
                currentTransaction.map((transaction) => (
                  <TableRow
                    key={transaction._id}
                    id={`invoice-${transaction.invoiceNumber}`}
                  >
                    <TableCell className="text-sm text-gray-400">
                      {new Date(transaction.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell>
                      {toSentenceCaseName(
                        transaction.clientId?.name ||
                          transaction.walkInClient?.name ||
                          "No Name"
                      )}
                    </TableCell>
                    <TableCell>
                      {transaction.items.length > 0 && (
                        <>
                          <span>
                            {transaction.items[0].quantity}x{" "}
                            {transaction.items[0].productName}
                          </span>
                          {transaction.items.length > 1 && (
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="ml-1"
                                >
                                  <ChevronDown className="w-4 h-4" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="text-sm max-w-xs">
                                {transaction.items
                                  .slice(1)
                                  .map(
                                    (item, index) =>
                                      `${item.quantity}x ${item.productName}${
                                        index < transaction.items.length - 2
                                          ? ", "
                                          : ""
                                      }`
                                  )}
                              </PopoverContent>
                            </Popover>
                          )}
                        </>
                      )}
                    </TableCell>
                    <TableCell className="text-green-600">
                      {formatCurrency(transaction.total)}
                    </TableCell>
                    <TableCell>{transaction.userId.name}</TableCell>
                    <TableCell className="text-center text-[#3D80FF] text-sm">
                      <button
                        onClick={() => openModal(transaction)}
                        className="underline cursor-pointer hover:no-underline transition-all duration-150 ease-in-out"
                      >
                        View
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500">
                    Loading data...
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {open &&
            (selectedTransaction?.clientId ? (
              <ClientTransactionModal />
            ) : (
              <WalkinTransactionModal />
            ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesTableData;
