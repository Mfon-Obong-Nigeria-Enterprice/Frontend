// components
import ClientTransactionModal from "./ClientTransactionModal";
import WalkinTransactionModal from "./WalkinTransactionModal";

//utils
import { balanceClass } from "@/utils/styles";
import { getTypeStyles } from "@/utils/helpersfunction";
import { formatCurrency } from "@/utils/styles";
// types
import type { Transaction } from "@/types/transactions";

// stores
import { useTransactionsStore } from "@/stores/useTransactionStore";

const TransactionTable = ({
  currentTransaction,
}: {
  currentTransaction: Transaction[];
}) => {
  const { open, openModal, selectedTransaction } = useTransactionsStore();

  return (
    <div className="bg-white border">
      <h5 className="text-[#1E1E1E] text-xl font-medium py-6 pl-8">
        All Transactions
      </h5>
      <table className="w-full overflow-x-scroll">
        <thead className="bg-[#F5F5F5] border border-[#d9d9d9]">
          <tr>
            <th className="py-3 text-base text-[#333333] font-normal text-center">
              Invoice
            </th>
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
              Status
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
                  {transaction.clientId?.name ||
                    transaction.walkInClientName ||
                    "Not found"}
                </td>
                <td className="text-center">
                  {transaction.type && (
                    <span
                      className={`border text-xs py-1.5 px-3 rounded-[6.25rem] ${getTypeStyles(
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

                <td className={balanceClass(transaction.total)}>
                  {formatCurrency(transaction.total ?? 0).toLocaleString()}
                </td>

                <td className={balanceClass(transaction.client?.balance)}>
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
                className="text-gray-400 text-center font-normal text-sm py-10"
              >
                {/* {searchTerm ?
                 "No transactions found matching your search"
                  : "Loading transactions..."} */}
                Loading transactions...
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
