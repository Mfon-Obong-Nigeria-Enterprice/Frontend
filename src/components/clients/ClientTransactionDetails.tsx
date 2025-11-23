import type { Transaction } from "@/types/transactions";
import { calculateTransactionsWithBalance } from "@/utils/calculateOutstanding";
import { formatCurrency } from "@/utils/formatCurrency";
import {
  getTransactionDate,
  getTransactionDateString,
  getTransactionTimeString,
} from "@/utils/transactions";
import { useMemo } from "react";

interface clientTrasactionDetailsProps {
  clientTransactions: Transaction[];
  client: { balance: number };
}

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
  const transactionWithBalance = useMemo(() => {
    const transactionsWithBalance = calculateTransactionsWithBalance(
      clientTransactions,
      client
    );

    // Sort by date - NEWEST FIRST
    return transactionsWithBalance.sort((a, b) => {
      const dateA = getTransactionDate(a).getTime();
      const dateB = getTransactionDate(b).getTime();
      return dateB - dateA;
    });
  }, [clientTransactions, client]);

  return (
    <div className="font-sans text-[#333333]">
      
      {/* --- 1. FILTERS SECTION (New) --- */}

      {/* --- 2. RETURNED PRODUCTS SECTION (New) --- */}
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
                {/* Static Row from Screenshot - Data not available in API response yet */}
                <tr className="bg-[#FFE9E9]">
                  <td className="px-2 py-4 text-sm text-[#666666]">10 units</td>
                  <td className="px-2 py-4 text-sm text-[#666666]">₦8600/bags</td>
                  <td className="px-2 py-4 text-sm text-[#666666]">₦28,000</td>
                  <td className="px-2 py-4 text-sm text-[#666666]">Roofing Sheet</td>
                  <td className="px-2 py-4 text-sm text-[#666666]">Damaged</td>
                  <td className="px-2 py-4 text-sm text-[#666666]">May 27, 2025</td>
                </tr>
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
        <div className="flex flex-col gap-6">
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
                className="bg-white p-4 md:p-6"
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
                      <span className="text-[#7D7D7D] text-[10px] md:text-xs">
                        {getTransactionTimeString(txn)}
                      </span>
                    </div>

                    {/* Discount Label (Desktop only) */}
                    {/* {txn.discount && txn.discount > 0 && (
                      <span className="hidden md:inline text-[#2ECC71] text-sm font-medium">
                        {formatCurrency(txn.discount)} saved{" "}
                        <span className="text-[#666666] font-normal">
                          {txn.subtotal
                            ? ((txn.discount / txn.subtotal) * 100).toFixed(1)
                            : 0}
                          % discount
                        </span>
                      </span>
                    )} */}
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
                        {formatCurrency(txn.total || 0)}
                      </span>
                    </div>
                    {/* Only show Return button for tangible transactions */}
                    {(txn.type === "PURCHASE" || txn.type === "PICKUP") && (
                      <button className="border border-gray-300 text-[#444444] px-4 py-1.5 rounded-md text-sm font-medium hover:bg-gray-50 bg-white">
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
                        {formatCurrency(txn.total || 0)}
                      </li>
                      <li className="text-sm text-[#444444]">
                        <span className="font-medium text-[#444444]">
                          Method:{" "}
                        </span>
                        {txn.paymentMethod || "N/A"}
                      </li>
                      {txn.transportFare > 0 && (
                        <li className="text-sm text-[#444444]">
                          <span className="font-medium text-[#444444]">
                            Transport:{" "}
                          </span>
                          {formatCurrency(txn.transportFare)}
                        </li>
                      )}
                      {txn.loadingAndOffloading > 0 && (
                        <li className="text-sm text-[#444444]">
                          <span className="font-medium text-[#444444]">
                            Loading/Offloading:{" "}
                          </span>
                          {formatCurrency(txn.loadingAndOffloading)}
                        </li>
                      )}
                      {txn.loading > 0 && (
                        <li className="text-sm text-[#444444]">
                          <span className="font-medium text-[#444444]">
                            Loading:{" "}
                          </span>
                          {formatCurrency(txn.loading)}
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
                      <li className="text-sm text-[#444444]">
                        <span className="font-medium text-[#444444]">
                          Staff:{" "}
                        </span>
                        {txn.userId?.name || "Unknown"}
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
                            Subtotal
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
                                  Subtotal: {formatCurrency(item.subtotal)}
                                </span>
                              </div>
                              {index < txn.items.length - 1 && (
                                <div className="h-[1px] bg-gray-100 my-2"></div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                {/* B. Description/Note Banner */}
                {/* {(txn.type === "DEPOSIT" || txn.description) &&
                  !txn.items?.length && (
                    <div className="bg-[#F5F5F5] rounded-md p-4 mt-4">
                      <p className="text-[#444444] text-sm font-medium">
                        {txn.type === "DEPOSIT" ? "Deposit Details" : "Note"}
                      </p>
                      <p className="text-[#7D7D7D] text-xs mt-1">
                        {txn.description || "Customer deposit"}
                      </p>
                    </div>
                  )} */}

                  {/* --- FOOTER: DEPOSIT NOTE --- */}
                {/* {(!txn.items?.length && (txn.type === "DEPOSIT" || txn.description)) && !isPartialPayment && (
                   <div className="bg-[#F5F5F5] rounded-md p-4 mt-4">
                      <p className="text-[#444] text-sm font-medium">{txn.type === "DEPOSIT" ? "Deposit Details" : "Note"}</p>
                      <p className="text-[#7D7D7D] text-xs mt-1">{txn.description || "Customer deposit"}</p>
                   </div>
                )} */}

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
    </div>
  );
};