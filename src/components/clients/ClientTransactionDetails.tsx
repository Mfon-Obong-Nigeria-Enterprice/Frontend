import type { Transaction } from "@/types/transactions";
import type { Client } from "@/types/types";
import { balanceTextClass } from "@/utils/format";
import { getTypeDisplay, getTypeStyles } from "@/utils/helpersfunction";
import { ArrowRight } from "lucide-react";
import { useMemo } from "react";

interface clientTrasactionDetailsProps {
  clientTransactions: Transaction[];
  client: Client;
}
export const ClientTransactionDetails: React.FC<
  clientTrasactionDetailsProps
> = ({ clientTransactions, client }) => {
  //
  const transactionWithBalance = useMemo(() => {
    let runningBal = client.balance;
    return [...clientTransactions]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .map((txn) => {
        const transactionImpact =
          txn.type === "DEPOSIT" ? -txn.total : txn.total;

        const balanceAfter = runningBal;
        runningBal -= transactionImpact;
        return {
          ...txn,
          balanceAfter,
          balanceBefore: runningBal,
        };
      })
      .reverse(); //show oldest transactions first
  }, [client.balance, clientTransactions]);
  //
  return (
    <div>
      {/* display data */}
      {transactionWithBalance.length === 0 ? (
        <p className="text-center text-sm text-[#7D7D7D] py-10">
          No transactions found for this client
        </p>
      ) : (
        transactionWithBalance.map((txn) => {
          // const previousBalance = client.balance - (txn.total || 0);
          return (
            <div
              key={txn._id}
              className="border rounded-lg px-5 py-3 mb-10 shadow"
            >
              {/* type, date and time, balance */}
              <div className=" py-4 border-b border-[#d7d7d7] flex justify-between">
                <div className="flex gap-3 items-center">
                  <p
                    className={`text-xs p-[6px] rounded-lg ${getTypeStyles(
                      txn.type
                    )}`}
                  >
                    {getTypeDisplay(txn.type)}
                  </p>
                  <div className="flex flex-col">
                    <span className="text-xs">
                      {new Date(txn.createdAt).toLocaleDateString()}
                    </span>
                    <span className="text-xs">
                      {new Date(txn.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
                <p className={`${balanceTextClass(txn.balanceAfter)}`}>
                  {txn.balanceAfter < 0 ? "-" : ""} ₦
                  {Math.abs(Number(txn.balanceAfter)).toLocaleString()}
                </p>
              </div>
              {/* details */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 px-2 py-5 ">
                <div className=" space-y-3 px-3 ">
                  <h6 className="text-[#333333] font-normal text-base">
                    Balance Change
                  </h6>

                  <div className="bg-[#F5F5F5] rounded py-2 ">
                    <div className="flex justify-evenly">
                      <p className="text-[9px] text-[#7D7D7D]">Previous</p>
                      <p className="text-[9px] text-[#7D7D7D]">New</p>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-[#444444] text-[13px]">
                        {`₦ ${txn.balanceBefore.toLocaleString()}`}
                      </span>
                      <span>
                        <ArrowRight size={13} />
                      </span>
                      <span className="text-[#444444] text-[13px]">
                        ₦{(client?.balance || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                {/* transaction details */}
                <div className="space-y-3  px-3">
                  <h6 className="text-[#333333] font-normal text-base">
                    Transaction Details
                  </h6>
                  <div>
                    <p className="font-medium text-[#444444] text-[13px]">
                      Amount:{" "}
                      <span className="font-normal">
                        ₦{(txn.total || 0).toLocaleString()}
                      </span>
                    </p>
                    <p className="font-medium text-[#444444] text-[13px]">
                      Method:{" "}
                      <span className="font-normal">
                        {txn.paymentMethod || "N/A"}
                      </span>{" "}
                    </p>
                    {/* show reference for payments */}
                    {txn.type === "DEPOSIT" && txn.reference && (
                      <p className="font-medium text-[#444444] text-[13px]">
                        Reference:{" "}
                        <span className="font-normal">{txn.reference}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* process by */}
                <div className="space-y-3 px-3">
                  <h6 className="text-[#333333] font-normal text-base">
                    Process By
                  </h6>
                  <p className="font-medium text-[#444444] text-[13px]">
                    Staff:
                    <span className="font-normal">
                      {txn.userId?.name || "Unknown"}
                    </span>
                  </p>
                  <p className="rounded-[2px] bg-[#E2F3EB] p-0.5 text-center">
                    <span className="text-[#3D80FF] text-xs">
                      {txn.invoiceNumber || "N/A"}
                    </span>
                  </p>
                </div>
              </div>

              {/* partial payment block */}
              {txn.type === "DEPOSIT" && (
                <div className="bg-[#F5F5F5] py-4 px-6 rounded-[8px]">
                  <h6 className="text-base text-[#333333] font-normal">
                    {txn.description || "Partial Payment Received"}
                  </h6>
                  {txn.reference && (
                    <p className="text-[0.625rem] text-[#333333]">
                      {txn.reference}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};
