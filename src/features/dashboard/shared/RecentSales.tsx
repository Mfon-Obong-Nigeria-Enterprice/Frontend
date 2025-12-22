/** @format */

import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MdKeyboardArrowRight } from "react-icons/md";
import { useTransactionsStore } from "@/stores/useTransactionStore";
import { toSentenceCaseName } from "@/utils/styles";
import { formatCurrency } from "@/utils/formatCurrency";

const RecentSales: React.FC = () => {
  const navigate = useNavigate();
  const { transactions } = useTransactionsStore();

  // filter for purchase/pickup, then sort + slice for recent 5
  const recentTxns = [...(transactions || [])]
    .filter((txn) => txn.type === "PURCHASE" || txn.type === "PICKUP")
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  return (
    <div className="bg-white p-4 sm:px-8 sm:py-6  rounded-lg font-Inter">
      <h4 className="font-medium text-lg sm:text-xl text-text-dark mb-4 sm:mb-0">
        Recent sales
      </h4>

      {recentTxns.length === 0 ? (
        // 🔹 Empty state
        <div className="flex items-center justify-center text-center text-gray-500 ">
          <p className="text-sm sm:text-base text-center pt-10">
            No recent sales yet
          </p>
        </div>
      ) : (
        <>
          {/* ------------------- TABLET & DESKTOP VIEW (Table) ------------------- */}
          <div className="hidden md:block mt-5 sm:mt-8 border border-[#F0F0F3] rounded-t-xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#F0F0F3]">
                  <TableHead className="w-[100px] text-center text-[#444444]">
                    Clients
                  </TableHead>
                  <TableHead className="text-center text-[#444444]">
                    Amount
                  </TableHead>
                  <TableHead className="text-center text-[#444444]">
                    Time
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTxns.map((txn, index) => (
                  <TableRow
                    key={txn._id}
                    className={index % 2 !== 0 ? "bg-[#F0F0F3]" : ""}
                  >
                    <TableCell className="font-medium pl-4 text-xs text-[var(--cl-secondary)]">
                      {toSentenceCaseName(
                        typeof txn?.clientId === "object" && txn?.clientId?.name
                          ? txn.clientId.name
                          : txn?.walkInClient?.name || ""
                      )}
                    </TableCell>
                    <TableCell
                      className={`text-center text-xs ${
                        txn.total > 0 ? "text-green-400" : "text-[#F95353]"
                      }`}
                    >
                      {formatCurrency(txn.total)}
                    </TableCell>
                    <TableCell className="text-center text-xs text-[var(--cl-secondary)]">
                      {new Date(txn.createdAt).toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* ------------------- MOBILE VIEW (List) ------------------- */}
          <div className="block md:hidden mt-2">
            {recentTxns.map((txn) => (
              <div
                key={txn._id}
                className="flex justify-between items-center border-b border-[#F0F0F3] py-3 last:border-0"
              >
                <div className="flex flex-col gap-1">
                  <span className="font-medium text-sm text-[#333333] capitalize">
                    {toSentenceCaseName(
                      typeof txn?.clientId === "object" && txn?.clientId?.name
                        ? txn.clientId.name
                        : txn?.walkInClient?.name || ""
                    )}
                  </span>
                  <span className="text-xs text-[#888888]">
                    {new Date(txn.createdAt).toLocaleTimeString([], {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <span
                  className={`font-medium text-sm ${
                    txn.total > 0 ? "text-[#2ECC71]" : "text-[#F95353]"
                  }`}
                >
                  {txn.total > 0 ? "+" : ""}
                  {formatCurrency(txn.total)}
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Footer always visible - Adjusted styling for mobile consistency */}
      <div className="flex justify-center md:justify-between items-center bg-transparent md:bg-[#f0f0f3] mt-6 md:mt-10 py-3 md:py-0 rounded-b-lg">
        <div className="pl-0 md:pl-3 py-2 text-sm font-medium">
          <span
            onClick={() => navigate("/admin/dashboard/sales")}
            className="text-[#3D80FF] hover:text-[#3D80FF] cursor-pointer"
          >
            View all Sales
          </span>
        </div>
        <MdKeyboardArrowRight
          size={24}
          className="text-[#3D80FF] mr-5 hidden md:block"
        />
      </div>
    </div>
  );
};

export default RecentSales;