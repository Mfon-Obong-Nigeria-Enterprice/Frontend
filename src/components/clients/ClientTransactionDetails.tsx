import type { Transaction } from "@/types/transactions";
import { calculateTransactionsWithBalance } from "@/utils/calculateOutstanding";
// import type { Client } from "@/types/types";
import { balanceTextClass } from "@/utils/format";
import { formatCurrency } from "@/utils/formatCurrency";
import { getTypeDisplay, getTypeStyles } from "@/utils/helpersfunction";
import { ArrowRight, X } from "lucide-react";
import { useMemo } from "react";

interface clientTrasactionDetailsProps {
  clientTransactions: Transaction[];
}

export const ClientTransactionDetails: React.FC<
  clientTrasactionDetailsProps
> = ({ clientTransactions }) => {
  //
  const transactionWithBalance = useMemo(() => {
    return calculateTransactionsWithBalance(clientTransactions, 0).reverse();
  }, [clientTransactions]);

  return (
    <div>
      {/* display data */}
      {transactionWithBalance.length === 0 ? (
        <p className="text-center text-sm text-[#7D7D7D] py-10">
          No transactions found for this client
        </p>
      ) : (
        <ul className="space-y-10">
          {transactionWithBalance.map((txn, i) => (
            <li
              key={`${txn._id}-${txn.createdAt}-${i}`} // More unique key
              className="border rounded-lg px-5 py-3 shadow"
            >
              {/* type, date and time, balance */}
              <header className="py-4 border-b border-[#d7d7d7] flex justify-between flex-wrap">
                <div className="flex gap-3 items-center mb-2 sm:mb-0">
                  <div>
                    {" "}
                    <span
                      className={`text-xs p-[6px] rounded-lg ${getTypeStyles(
                        txn.type
                      )}`}
                    >
                      {getTypeDisplay(txn.type)}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs">
                      {new Date(txn.createdAt).toLocaleDateString()}
                    </span>
                    <span className="text-xs">
                      {new Date(txn.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div>
                      {txn.discount && (
                        <p className="text-[#2ECC71] font-normal font-Inter text-lg">
                          ₦{txn.discount?.toLocaleString()} saved
                        </p>
                      )}
                    </div>
                    <div>
                      {txn?.total > 0 ? (
                        <p className="text-[#7D7D7D] text-sm font-Inter">
                          {(
                            ((txn?.discount ?? 0) / (txn?.subtotal ?? 0)) *
                            100
                          ).toFixed(1)}
                          % discount
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <p className={`${balanceTextClass(txn.balanceAfter)}`}>
                    {/* {txn.balanceAfter < 0 ? "-" : ""} ₦
                    {Math.abs(Number(txn.balanceAfter)).toLocaleString()} 
                    */}
                    {formatCurrency(txn.balanceAfter)}
                  </p>
                </div>
              </header>

              <div className="w-full max-w-7xl mx-auto py-4">
                {/* Single card containing all transaction details sections */}
                <section className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                  <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 px-4 sm:px-3 py-5 sm:py-6">
                    {/* Balance Change Section */}
                    <div className="space-y-3 sm:space-y-4">
                      <h6 className="text-[#333333] font-medium text-base ">
                        Balance Change
                      </h6>

                      <div className="bg-[#F5F5F5] rounded-lg py-3 sm:py-4 px-3 sm:px-4">
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-xs  text-[#7D7D7D] font-medium">
                            Previous
                          </p>
                          <p className="text-xs sm:text-sm text-[#7D7D7D] font-medium">
                            New
                          </p>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-[#444444] text-sm font-medium flex-1 text-left truncate md:text-clip md:whitespace-normal">
                            {formatCurrency(txn.balanceBefore)}
                          </span>
                          <span className="mx-2 sm:mx-3 flex-shrink-0">
                            <ArrowRight size={14} className="text-[#666]" />
                          </span>
                          <span className="text-[#444444] text-sm  font-medium flex-1 text-right truncate md:text-clip md:whitespace-normal ">
                            {formatCurrency(txn.balanceAfter)}
                            {/* {txn.balanceAfter || 0} */}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Transaction Details Section */}
                    <div className="space-y-3 sm:space-y-4">
                      <h6 className="text-[#333333] font-medium text-base ">
                        Transaction Details
                      </h6>
                      <ul className="space-y-2 sm:space-y-3">
                        <li className="font-medium text-[#444444] text-sm ">
                          Amount:{" "}
                          <span className="font-normal">
                            {formatCurrency(txn.subtotal || 0)}
                          </span>
                        </li>
                        <li className="font-medium text-[#444444] text-sm ">
                          Amount Paid:{" "}
                          <span className="font-normal">
                            {formatCurrency(txn.amountPaid || 0)}
                          </span>
                        </li>

                        <li className="font-medium text-[#444444] text-sm ">
                          Method:{" "}
                          <span className="font-normal">
                            {txn.paymentMethod || "N/A"}
                          </span>
                        </li>
                        {txn.reference && (
                          <li className="font-medium text-[#444444] text-sm ">
                            Reference:{" "}
                            <span className="font-normal text-xs bg-gray-100 px-2 py-1 rounded">
                              {txn.reference}
                            </span>
                          </li>
                        )}

                        {/* Show item count for PICKUP/PURCHASE transactions */}
                        {(txn.type === "PICKUP" || txn.type === "PURCHASE") && (
                          <li className="font-medium text-[#444444] text-sm">
                            Items:{" "}
                            <span className="font-normal">
                              {txn.items?.length || 0} item(s)
                            </span>
                          </li>
                        )}
                      </ul>
                    </div>

                    {/* Process By Section - Enhanced to show staff details */}
                    <div className="space-y-3 sm:space-y-4">
                      <h6 className="text-[#333333] font-medium text-base">
                        Processed By
                      </h6>
                      <ul className="space-y-2 sm:space-y-3">
                        <li className="flex items-center gap-2">
                          <div className="flex flex-col">
                            <span className="font-medium text-[#444444] text-sm">
                              {txn.userId?.name || "Unknown Staff"}
                            </span>
                          </div>
                        </li>

                        {/* Invoice and Waybill numbers */}
                        <div className="flex flex-col gap-2">
                          {txn.invoiceNumber && (
                            <div className="inline-block rounded-sm bg-[#E2F3EB] px-2 py-1 text-center w-fit">
                              <span className="text-[#3D80FF] text-xs sm:text-sm font-medium">
                                {txn.invoiceNumber}
                              </span>
                            </div>
                          )}
                          {txn.waybillNumber && (
                            <div className="inline-block rounded-sm bg-[#E2F3EB] px-2 py-1 text-center w-fit">
                              <span className="text-[#3D80FF] text-xs sm:text-sm font-medium">
                                {txn.waybillNumber}
                              </span>
                            </div>
                          )}
                        </div>
                      </ul>
                    </div>
                  </div>
                </section>
              </div>

              {/* Footer section - conditional rendering based on transaction type */}
              {txn.type === "DEPOSIT" ? (
                <footer className="bg-[#F5F5F5] py-4 px-6 rounded-[8px] ">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h6 className="text-base text-[#333333] font-medium mb-2">
                        Payment Details
                      </h6>
                      <p className="text-sm text-[#666666]">
                        {txn.description || "Debt Payment Received"}
                      </p>
                      {txn.reference && (
                        <p className="text-xs text-[#7D7D7D] mt-1">
                          Reference: {txn.reference}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-[#7D7D7D]">Processed by:</p>
                      <p className="text-sm font-medium text-[#333333]">
                        {txn.userId?.name || "Unknown"}
                      </p>
                    </div>
                  </div>
                </footer>
              ) : (txn.type === "PICKUP" || txn.type === "PURCHASE") &&
                txn.items?.length > 0 ? (
                <footer className="space-y-3 border-t-[1px] border-[#d7d7d7] ">
                  <div className="flex justify-between items-center px-3 pt-8">
                    <h6 className="text-base text-[#333333] font-normal">
                      Product{" "}
                      {txn.type === "PICKUP" ? "Picked Up" : "Purchased"}:
                    </h6>
                  </div>
                  <ul className="flex flex-wrap gap-4 items-start ">
                    {txn.items.map((item, itemIndex) => (
                      <li
                        key={item.productId || itemIndex}
                        className="flex-1 min-w-full md:min-w-[150px] max-w-[200px] bg-[#F5F5F5] py-2.5 px-3 border-l-4 border-[#2ECC71] rounded-[8px]"
                      >
                        <p className="text-xs font-medium text-[#333333]">
                          {item.unit} {item.productName}
                        </p>
                        <p className="flex items-center gap-1.5 text-[9px] text-[#7D7D7D]">
                          {item.unit} <X size={10} /> {item.quantity}
                        </p>
                        <p className="text-[13px] font-medium text-[#2ECC71]">
                          {formatCurrency(item.unitPrice)}
                        </p>
                        {item.subtotal && (
                          <p className="text-[11px] text-[#666666]">
                            Subtotal: {formatCurrency(item.subtotal)}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </footer>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
