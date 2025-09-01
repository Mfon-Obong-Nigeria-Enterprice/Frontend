// components
import ClientTransactionModal from "../ClientTransactionModal";
import WalkinTransactionModal from "../WalkinTransactionModal";

//utils
import { balanceClassT } from "@/utils/styles";
import { getTypeStyles } from "@/utils/helpersfunction";
import { formatCurrency, toSentenceCaseName } from "@/utils/styles";

// types
import type { Transaction } from "@/types/transactions";

// stores
import { useTransactionsStore } from "@/stores/useTransactionStore";
import { useAuthStore } from "@/stores/useAuthStore";

// ui
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

//  icons
import { ChevronDown } from "lucide-react";

const TransactionTable = ({
  currentTransaction,
}: {
  currentTransaction: Transaction[];
}) => {
  const { open, openModal, selectedTransaction } = useTransactionsStore();
  const { user } = useAuthStore();

  return (
    <div className="hidden xl:block">
      <table className=" w-full overflow-x-scroll">
        <thead className="bg-[#F5F5F5] border border-[#d9d9d9]">
          <tr>
            <th className="py-3 text-base text-[#333333] font-normal text-center">
              Payment ID
            </th>
            <th className="py-3 text-base text-[#333333] font-normal text-center">
              Date/Time
            </th>
            {user?.role === "SUPER_ADMIN" ? (
              <th className="py-3 text-base text-[#333333] font-normal text-center">
                Items
              </th>
            ) : (
              <th className="py-3 text-base text-[#333333] font-normal text-center">
                Clients
              </th>
            )}
            <th className="py-3 text-base text-[#333333] font-normal text-center">
              Type
            </th>
            <th className="py-3 text-base text-[#333333] font-normal text-center">
              Status
            </th>
            <th className="py-3 text-base text-[#333333] font-normal text-center">
              Amount
            </th>
            {user?.role === "SUPER_ADMIN" && (
              <th className="py-3 text-base text-[#333333] font-normal text-center">
                Location
              </th>
            )}
            <th className="py-3 text-base text-[#333333] font-normal text-center">
              Balance
            </th>
            <th className="py-3 text-base text-[#333333] font-normal text-center">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {currentTransaction?.length > 0 ? (
            currentTransaction.map((transaction) => (
              <tr
                key={transaction._id ?? transaction.invoiceNumber}
                id={`invoice-${transaction.invoiceNumber}`}
                className="border-b border-[#d9d9d9]"
              >
                <td className=" text-center text-[#444444] text-sm font-normal py-3">
                  {transaction.invoiceNumber}
                </td>
                <td className="flex flex-col text-center  font-normal py-3">
                  <span className="text-xs text-[#444444]">
                    {new Date(transaction.createdAt).toLocaleDateString()}
                  </span>
                  <span className="text-[0.625rem] text-[#7D7D7D]">
                    {new Date(transaction.createdAt).toLocaleTimeString()}
                  </span>
                </td>
                <td className=" text-center text-[#444444] text-sm font-normal py-3">
                  {user?.role === "SUPER_ADMIN" ? (
                    <div className="flex items-center justify-center text-[#444444] text-xs font-normal py-3">
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
                              <PopoverContent className="text-sm max-w-60">
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
                    </div>
                  ) : (
                    <p>
                      {toSentenceCaseName(
                        transaction.clientId?.name ||
                          transaction.walkInClientName ||
                          "Not found"
                      )}
                    </p>
                  )}
                </td>
                <td className="text-center">
                  {transaction.type && (
                    <span
                      className={`border text-xs py-1.5 px-3 rounded-[6.25rem]  ${getTypeStyles(
                        transaction.type
                      )}`}
                    >
                      {transaction.type}
                    </span>
                  )}
                </td>
                <td
                  className={`text-xs text-center ${
                    transaction.status === "COMPLETED"
                      ? "text-[#2ECC71]"
                      : "text-[#F95353]"
                  }`}
                >
                  {transaction.status}
                </td>

                <td className={balanceClassT(transaction.total)}>
                  {formatCurrency(transaction.total ?? 0).toLocaleString()}
                </td>
                {user?.role === "SUPER_ADMIN" && (
                  <td className=" text-center text-[#444444] text-sm font-normal py-3">
                    {transaction.branchName}
                  </td>
                )}
                <td className={balanceClassT(transaction.client?.balance)}>
                  {formatCurrency(transaction.client?.balance ?? 0)}
                </td>
                <td className="text-center text-[#3D80FF] text-sm">
                  <button
                    onClick={() => openModal(transaction)}
                    className="underline cursor-pointer hover:no-underline transition-all duration-150 ease-in-out"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={7}
                className="text-gray-400 text-center font-normal text-sm py-10 "
              >
                {/* {searchTerm ?
                 "No transactions found matching your search"
                  : "Loading transactions..."} */}
                No transactions found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {open && selectedTransaction?.clientId ? (
        <ClientTransactionModal />
      ) : (
        <WalkinTransactionModal />
      )}
    </div>
  );
};

export default TransactionTable;
