import type { Transaction } from "@/types/transactions";
import { calculateTransactionsWithBalance } from "@/utils/calculateOutstanding";
import { formatCurrency } from "@/utils/formatCurrency";
import {
  getTransactionDateString,
} from "@/utils/transactions";
import { useMemo, useState } from "react";
import ProcessProductReturnModal from "./ProcessProductReturnModal";

interface clientTrasactionDetailsProps {
  clientTransactions: Transaction[];
  client: { balance: number };
}

// Helper to format role for display
const formatRole = (role: string | undefined): string => {
  if (!role) return "Staff";
  return role
    .split("_")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

// Helper to get styles based on transaction type matching the screenshots
const getTypeStyles = (type: string) => {
  switch (type) {
    case "PURCHASE":
      return {
        badge: "bg-[#FFCACA] text-[#F95353] border border-[#F95353]",
        amount: "text-[#333333]", // Standard
      };
    case "DEPOSIT":
      return {
        badge: "bg-[#E2F3EB] text-[#2ECC71] border border-[#2ECC71]",
        amount: "text-[#2ECC71]", // Green text for positive impact
      };
    case "PICKUP":
      return {
        badge: "bg-[#FFF8E1] text-[#FFA500] border border-[#FFA500]",
        amount: "text-[#333333]",
      };
    default:
      return {
        badge: "bg-gray-100 text-gray-600",
        amount: "text-[#333333]",
      };
  }
};

export const ClientTransactionDetails: React.FC<clientTrasactionDetailsProps> = ({
  clientTransactions,
  client,
}) => {
  const [isReturnModalOpen, setReturnModalOpen] = useState(false);
  const [selectedTxnForReturn, setSelectedTxnForReturn] = useState<Transaction | null>(null);

  const handleOpenReturnModal = (transaction: Transaction) => {
    setSelectedTxnForReturn(transaction);
    setReturnModalOpen(true);
  };

  const handleCloseReturnModal = () => setReturnModalOpen(false);

  const transactionWithBalance = useMemo(() => {
    const transactionsWithBalance = calculateTransactionsWithBalance(
      clientTransactions,
      client
    );

    // Sort by createdAt - NEWEST FIRST
    return transactionsWithBalance.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA;
    });
  }, [clientTransactions, client]);

  // Filter RETURN transactions for this client
  const returnedProducts = useMemo(() => {
    return clientTransactions
      .filter((txn) => txn.type === "RETURN")
      .sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA;
      });
  }, [clientTransactions]);

  return (
    <div className="font-sans text-[#333333]">

      {/* --- 1. FILTERS SECTION (New) --- */}

      {/* --- 2. RETURNED PRODUCTS SECTION (Client-Specific) --- */}
      <div className="mb-10 border-b border-[#D9D9D9] pb-4 rounded-lg">
        <h2 className="text-[#333333] font-normal text-base mb-4">Returned Products</h2>
        <div className="bg-[#F9FAFB] rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left ">
              <thead>
                <tr className="bg-[#F5F5F5]">
                  <th className="px-2 py-4 text-sm font-normal text-[#333333]">Quantity</th>
                  <th className="px-2 py-4 text-sm font-normal text-[#333333]">Unit Price</th>
                  <th className="px-2 py-4 text-sm font-normal text-[#333333]">Amount Return</th>
                  <th className="px-2 py-4 text-sm font-normal text-[#333333]">Product</th>
                  <th className="px-2 py-4 text-sm font-normal text-[#333333]">Reason</th>
                  <th className="px-2 py-4 text-sm font-normal text-[#333333]">Date</th>
                </tr>
              </thead>
              <tbody>
                {returnedProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-2 py-8 text-sm text-[#7D7D7D] text-center">
                      No returned products for this client
                    </td>
                  </tr>
                ) : (
                  returnedProducts.map((returnTxn) => (
                    returnTxn.items && returnTxn.items.length > 0 ? (
                      returnTxn.items.map((item, idx) => (
                        <tr key={`${returnTxn._id}-${idx}`} className="bg-[#FFE9E9]">
                          <td className="px-2 py-4 text-sm text-[#666666]">
                            {item.quantity} {item.unit || 'units'}
                          </td>
                          <td className="px-2 py-4 text-sm text-[#666666]">
                            {formatCurrency(item.unitPrice)}/{item.unit || 'unit'}
                          </td>
                          <td className="px-2 py-4 text-sm text-[#666666]">
                            {formatCurrency(item.quantity * item.unitPrice)}
                          </td>
                          <td className="px-2 py-4 text-sm text-[#666666]">
                            {item.productName || 'Product'}
                          </td>
                          <td className="px-2 py-4 text-sm text-[#666666]">
                            {returnTxn.description || 'Return'}
                          </td>
                          <td className="px-2 py-4 text-sm text-[#666666]">
                            {getTransactionDateString(returnTxn)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr key={returnTxn._id} className="bg-[#FFE9E9]">
                        <td className="px-2 py-4 text-sm text-[#666666]">-</td>
                        <td className="px-2 py-4 text-sm text-[#666666]">-</td>
                        <td className="px-2 py-4 text-sm text-[#666666]">
                          {formatCurrency(returnTxn.total || 0)}
                        </td>
                        <td className="px-2 py-4 text-sm text-[#666666]">
                          {returnTxn.description || 'Returned items'}
                        </td>
                        <td className="px-2 py-4 text-sm text-[#666666]">Return</td>
                        <td className="px-2 py-4 text-sm text-[#666666]">
                          {getTransactionDateString(returnTxn)}
                        </td>
                      </tr>
                    )
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- 3. TRANSACTION LIST (Existing Logic) --- */}
      {transactionWithBalance.length === 0 ? (
        <p className="text-center text-sm text-[#7D7D7D] py-10">
          No transactions found for this client
        </p>
      ) : (
        <div className="flex flex-col gap-8">
          {transactionWithBalance.map((txn, i) => {
            const styles = getTypeStyles(txn.type);
            const isCredit = txn.type === "DEPOSIT";
            const isPartialPayment =
              (txn.type === "PURCHASE" || txn.type === "PICKUP") &&
              (txn.amountPaid ?? 0) > 0 &&
              (txn.amountPaid ?? 0) < (txn.total ?? 0);

            return (
              <div
                key={`${txn._id}-${getTransactionDateString(txn)}-${i}`}
                className="bg-white border border-gray-300 rounded-lg p-4 md:p-6 shadow-sm"
              >
                {/* --- HEADER --- */}
                <div className="border-b border-[#D9D9D9] pb-4 flex flex-wrap justify-between items-start md:items-center mb-6 gap-4">
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                    {/* Type Badge */}
                    <span
                      className={`${styles.badge} px-3 py-1 rounded-full text-xs font-medium w-fit uppercase`}
                    >
                      {txn.type}
                    </span>

                    {/* Date & Time */}
                    <div className="flex flex-col">
                      <span className="text-[#333333] text-sm font-medium">
                        {getTransactionDateString(txn)}
                      </span>
                    </div>
                  </div>

                  {/* Total & Actions */}
                  <div className="flex items-center gap-4 md:gap-6 ml-auto md:ml-0">
                    <div className="text-right">
                      <span className="text-[#7D7D7D] text-xs block">
                        Total:
                      </span>
                      <span
                        className={`text-lg text-[#444444] md:text-xl font-bold ${styles.amount}`}
                      >
                        {isCredit ? "+" : ""}
                        {formatCurrency(
                          txn.type === "RETURN" && txn.actualAmountReturned !== undefined
                            ? txn.actualAmountReturned
                            : txn.total || 0
                        )}
                      </span>
                    </div>
                    {/* Only show Return button for tangible transactions */}
                    {(txn.type === "PURCHASE" || txn.type === "PICKUP") && (
                      <button
                        onClick={() => handleOpenReturnModal(txn)}
                        className="border border-gray-300 text-[#444444] px-4 py-1.5 rounded-md text-sm font-medium hover:bg-gray-50 bg-white"
                      >
                        Return
                      </button>
                    )}
                  </div>
                </div>

                {/* --- MAIN GRID (Balance, Details, Process) --- */}
                <div className=" pb-4 grid grid-cols-1 md:grid-cols-[40%_30%_30%] gap-6 mb-6">
                  {/* 1. Balance Change */}
                  <div className="md:w-[204px]">
                    <h3 className="text-[#333333] text-[16px] mb-3">
                      Balance Change
                    </h3>
                    <div className="md:h-[49px] bg-[#F5F5F5] rounded-[8px] p-4 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[#7D7D7D] text-[9px] mb-1">
                          Previous
                        </span>
                        <span className="text-[#444444] text-[13px] font-medium">
                          {formatCurrency(txn.balanceBefore)}
                        </span>
                      </div>
                      <img src="/icons/forward-arrow.svg" alt="arrow right" className="mt-4 w-[13px] h-[9px]"/>
                      <div className="flex flex-col text-right">
                        <span className="text-[#7D7D7D] text-[9px] font-medium mb-1">
                          New
                        </span>
                        <span className="text-[#444444] text-[13px] font-medium">
                          {formatCurrency(txn.balanceAfter)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 2. Transaction Details */}
                  <div>
                    <h3 className="text-[#444444] text-[16px] mb-3">
                      Transaction Details
                    </h3>
                    <ul className="space-y-1.5">
                      <li className="text-sm text-[#444444]">
                        <span className="font-medium text-[#444444]">
                          Amount:{" "}
                        </span>
                        {formatCurrency(
                          txn.type === "RETURN" && txn.actualAmountReturned !== undefined
                            ? txn.actualAmountReturned
                            : txn.total || 0
                        )}
                      </li>
                      <li className="text-sm text-[#444444]">
                        <span className="font-medium text-[#444444]">
                          Method:{" "}
                        </span>
                        {(txn.amountPaid ?? 0) > 0 ? (txn.paymentMethod || "N/A") : "No payment"}
                      </li>
                      {(txn.amountPaid ?? 0) > 0 && (
                        <li className="text-sm text-[#444444]">
                          <span className="font-medium text-[#444444]">
                            Amount Paid:{" "}
                          </span>
                          {formatCurrency(txn.amountPaid ?? 0)}
                        </li>
                      )}
                      {txn.type !== "RETURN" && txn.total && (txn.amountPaid ?? 0) < txn.total && (
                        <li className="text-sm text-[#F95353]">
                          <span className="font-medium">
                            Outstanding:{" "}
                          </span>
                          {formatCurrency(txn.total - (txn.amountPaid ?? 0))}
                        </li>
                      )}
                      {Number(txn.transportFare || 0) > 0 && (
                        <li className="text-sm text-[#444444]">
                          <span className="font-medium text-[#444444]">
                            Transport:{" "}
                          </span>
                          {formatCurrency(Number(txn.transportFare || 0))}
                        </li>
                      )}
                      {Number(txn.loadingAndOffloading || 0) > 0 && (
                        <li className="text-sm text-[#444444]">
                          <span className="font-medium text-[#444444]">
                            Loading/Offloading:{" "}
                          </span>
                          {formatCurrency(Number(txn.loadingAndOffloading || 0))}
                        </li>
                      )}
                      {Number(txn.loading || 0) > 0 && (
                        <li className="text-sm text-[#444444]">
                          <span className="font-medium text-[#444444]">
                            Loading:{" "}
                          </span>
                          {formatCurrency(Number(txn.loading || 0))}
                        </li>
                      )}
                      {/* Amount Paid duplicate removed */}
                      {txn.type !== "RETURN" && (txn.amountPaid ?? 0) > (txn.total ?? 0) && (
                        <li className="text-sm text-[#2ECC71]">
                          <span className="font-medium">
                            Credit Added:{" "}
                          </span>
                          {formatCurrency((txn.amountPaid ?? 0) - (txn.total ?? 0))}
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* 3. Process By */}
                  <div>
                    <h3 className="text-[#333333] text-[13px] mb-3">
                      Process By
                    </h3>
                    <ul className="space-y-2">
                      <li className="text-sm text-[#444444] flex flex-col max-w-full">
                        <span className="font-medium text-[#444444]">
                          {formatRole(txn.userId?.role)}:
                        </span>
                        <span className="break-all whitespace-normal">
                          {txn.userId?.name || "Unknown"}
                        </span>
                      </li>
                      {txn.invoiceNumber && (
                        <li>
                          <span className="bg-[#E2F3EB] text-[#3D80FF] px-2 py-0.5 rounded text-xs font-medium">
                            {txn.invoiceNumber}
                          </span>
                        </li>
                      )}
                      {txn.waybillNumber && (
                        <li>
                          <span className="bg-[#E2F3EB] text-[#3D80FF] px-2 py-0.5 rounded text-xs font-medium">
                            {txn.waybillNumber}
                          </span>
                        </li>
                      )}
                      {txn.reference && (
                        <li className="text-xs text-[#7D7D7D]">
                          Ref: {txn.reference}
                        </li>
                      )}
                    </ul>
                  </div>
                </div>

                
                {/* --- FOOTER SECTIONS (Conditional) --- */}

                {/* A. Product Purchase Table */}
                {(txn.type === "PURCHASE" || txn.type === "PICKUP") &&
                  txn.items &&
                  txn.items.length > 0 && (
                    <div className="border-t border-gray-100 pt-6">
                      <h3 className="text-[#333333] text-[16px] mb-4">
                        Product {txn.type === "PICKUP" ? "Pickup" : "Purchase"}:
                      </h3>
                      <div className="bg-[#F9FAFB] overflow-hidden">
                        {/* Table Header */}
                        <div className="grid grid-cols-[1fr_1fr_1fr_auto] md:grid-cols-4 gap-4 p-4 bg-[#F5F5F5] border-b border-gray-100">
                          <span className="text-xs md:text-[16px] text-[#333333]">
                            Quantity
                          </span>
                          <span className="text-xs md:text-[16px] text-[#333333]">
                            Unit Price
                          </span>
                          <span className="text-xs md:text-[16px] text-[#333333]">
                            Product
                          </span>
                          <span className="text-xs md:text-[16px] text-[#333333] text-right">
                            Amount
                          </span>
                        </div>
                        {/* Table Body */}
                        <div className="bg-white border-b border-[#F5F5F5] border-[1px] pt-4  grid grid-cols-1 gap-2">
                          {txn.items.map((item, index) => (
                            <div key={`${item.productId}-${index}`}>
                              <div className="grid grid-cols-[1fr_1fr_1fr_auto] md:grid-cols-4 px-4 gap-4 items-center">
                                <span className="text-xs md:text-sm text-[#444444]">
                                  {item.quantity}{" "}
                                  {item.unit?.split(" ")[0]?.toLowerCase() ||
                                    "units"}
                                </span>
                                <span className="text-xs md:text-sm text-[#444444] font-medium">
                                  {formatCurrency(item.unitPrice)}/
                                  {item.unit?.split(" ")[0]?.toLowerCase() ||
                                    "unit"}
                                </span>
                                <span className="text-xs md:text-sm text-[#444444]">
                                  {item.productName}
                                </span>
                                <span className="text-xs md:text-sm text-[#444444] text-right">
                                  {formatCurrency(item.subtotal)}
                                </span>
                              </div>
                              {index < txn.items.length - 1 && (
                                <div className="h-[1px] bg-gray-100 my-2"></div>
                              )}
                            </div>
                          ))}
                          {/* Subtotal */}
                          <div className="bg-[#F5F5F5] flex justify-end px-4 gap-4 items-center py-3 border-t border-gray-100">
                            <span className="text-xs md:text-sm text-[#333333] font-medium">
                              Subtotal:
                            </span>
                            <span className="text-xs md:text-sm text-[#333333] font-bold">
                              {formatCurrency(
                                txn.items.reduce(
                                  (sum, item) => sum + (item.subtotal || 0),
                                  0
                                )
                              )}
                            </span>
                          </div>

                          {/* Transport */}
                          {(() => {
                            const transport = Number(txn.transportFare || 0);
                            return transport > 0 ? (
                              <div className="bg-[#F5F5F5] flex justify-end px-4 gap-4 items-center py-3">
                                <span className="text-xs md:text-sm text-[#333333] font-medium">
                                  Transport:
                                </span>
                                <span className="text-xs md:text-sm text-[#333333] font-bold">
                                  {formatCurrency(transport)}
                                </span>
                              </div>
                            ) : null;
                          })()}

                          {/* Loading */}
                          {(() => {
                            const loading = Number(txn.loading || 0);
                            return loading > 0 ? (
                              <div className="bg-[#F5F5F5] flex justify-end px-4 gap-4 items-center py-3">
                                <span className="text-xs md:text-sm text-[#333333] font-medium">
                                  Loading:
                                </span>
                                <span className="text-xs md:text-sm text-[#333333] font-bold">
                                  {formatCurrency(loading)}
                                </span>
                              </div>
                            ) : null;
                          })()}

                          {/* Loading & Offloading */}
                          {(() => {
                            const loadingOff = Number(txn.loadingAndOffloading || 0);
                            return loadingOff > 0 ? (
                              <div className="bg-[#F5F5F5] flex justify-end px-4 gap-4 items-center py-3">
                                <span className="text-xs md:text-sm text-[#333333] font-medium">
                                  Loading & Offloading:
                                </span>
                                <span className="text-xs md:text-sm text-[#333333] font-bold">
                                  {formatCurrency(loadingOff)}
                                </span>
                              </div>
                            ) : null;
                          })()}

                          {/* Discount */}
                          {(() => {
                            const discount = Number(txn.discount || 0);
                            return discount > 0 ? (
                              <div className="bg-[#F5F5F5] flex justify-end px-4 gap-4 items-center py-3">
                                <span className="text-xs md:text-sm text-[#333333] font-medium">
                                  Discount:
                                </span>
                                <span className="text-xs md:text-sm text-[#333333] font-bold">
                                  -{formatCurrency(discount)}
                                </span>
                              </div>
                            ) : null;
                          })()}

                          {/* Total */}
                          <div className="bg-[#F5F5F5] flex justify-end px-4 gap-4 items-center py-3 border-t-2 border-gray-300">
                            <span className="text-xs md:text-sm text-[#333333] font-bold">
                              Total:
                            </span>
                            <span className="text-xs md:text-sm text-[#333333] font-bold">
                              {formatCurrency(txn.total || 0)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}


                {/* --- FOOTER: PARTIAL PAYMENT BANNER --- */}
                {isPartialPayment && (
                   <div className="bg-[#F5F5F5] rounded-md p-4 mb-4 mt-8">
                      <p className="text-[#444444] text-[16px] font-medium">Partial Payment Received</p>
                      <p className="text-[#444444] text-[10px] mt-1">Payment towards outstanding balance</p>
                   </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      <ProcessProductReturnModal
        isOpen={isReturnModalOpen}
        onClose={handleCloseReturnModal}
        transaction={selectedTxnForReturn}
      />
    </div>
  );
};