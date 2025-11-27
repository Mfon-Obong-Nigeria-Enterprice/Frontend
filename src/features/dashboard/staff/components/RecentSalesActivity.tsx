import React from "react";
import { useTransactionsStore } from "@/stores/useTransactionStore";
import { balanceTextClass, formatCurrency } from "@/utils/styles";
import { ChevronDown, ChevronRight, FileText } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

const RecentSalesActivity: React.FC = () => {
  const { transactions } = useTransactionsStore();

  // Sort transactions by date (newest first) and take the top 4
  const recentSales = [...(transactions || [])]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 4);

  // Helper to render the item list (used in both views to avoid duplication logic)
  const renderItems = (items: any[]) => {
    if (!items || items.length === 0) return null;
    return (
      <div className="flex items-center gap-1 text-sm text-[#555]">
        <span>
          {items[0].quantity}x {items[0].productName}
        </span>
        {items.length > 1 && (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 p-0 text-gray-400 hover:text-gray-600 hover:bg-transparent"
              >
                <ChevronDown className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="text-sm w-auto p-3 shadow-lg">
              <div className="flex flex-col gap-1">
                {items.slice(1).map((item: any, index: number) => (
                  <span key={index} className="whitespace-nowrap">
                    {item.quantity}x {item.productName}
                  </span>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    );
  };

  return (
    <div className="hidden md:block w-full bg-white border border-[#E4E4E7] rounded-lg shadow-sm">
      {/* --- Header (Shared) --- */}
      <div className="md:hidden flex justify-between items-center px-4 md:px-6 py-5 border-b border-[#E4E4E7]">
        <h2 className="text-[#111] text-base font-medium">
          Your Recent Sales Activity
        </h2>
        <a
          href="#"
          className="text-[#3D80FF] text-sm flex items-center font-medium hover:underline"
        >
          View all Sales
          <ChevronRight className="w-4 h-4 ml-1" />
        </a>
      </div>

      {recentSales.length > 0 ? (
        <>
          {/* =========================================================
              VIEW 1: DESKTOP TABLE (Hidden on Tablet/Mobile, Visible on LG+)
             ========================================================= */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#F9FAFB] text-[#666]">
                <tr>
                  <th className="py-4 px-6 text-sm font-medium">Clients</th>
                  <th className="py-4 px-6 text-sm font-medium">Products</th>
                  <th className="py-4 px-6 text-sm font-medium">Amount</th>
                  <th className="py-4 px-6 text-sm font-medium text-right">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm text-[#333]">
                {recentSales.map((sale, i) => (
                  <tr
                    key={i}
                    className="border-b border-[#E4E4E7] last:border-b-0 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-5 px-6 font-normal">
                      {sale.clientName ||
                        sale.walkInClientName ||
                        "Walk-in client"}
                    </td>
                    <td className="py-5 px-6">{renderItems(sale.items)}</td>
                    <td
                      className={`py-5 px-6 font-medium ${balanceTextClass(
                        sale.total
                      )}`}
                    >
                      {formatCurrency(sale.total)}
                    </td>
                    <td className="py-5 px-6 text-[#555] text-right">
                      {new Date(sale.createdAt).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* =========================================================
              VIEW 2: TABLET/MOBILE LIST (Visible on Mobile/Tablet, Hidden on LG+)
             ========================================================= */}
          <div className="block lg:hidden">
            <div className="flex flex-col">
              {recentSales.map((sale, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-2 p-4 border-b border-[#E4E4E7] last:border-b-0 hover:bg-gray-50"
                >
                  <div className="flex justify-between items-start">
                    {/* Top Row: Client Name & Time */}
                    <span className="text-[#333] font-normal text-[15px]">
                      {sale.clientName ||
                        sale.walkInClientName ||
                        "Walk-in client"}
                    </span>
                    <span className="text-xs text-[#666]">
                      {new Date(sale.createdAt).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </span>
                  </div>

                  <div className="flex justify-between items-end mt-1">
                    {/* Bottom Row: Items & Amount */}
                    <div className="flex-1">
                       {renderItems(sale.items)}
                    </div>
                    
                    <span
                      className={`text-[15px] font-bold ${balanceTextClass(
                        sale.total
                      )}`}
                    >
                      {formatCurrency(sale.total)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        /* Empty State (Shared) */
        <div className="py-12 text-center">
          <div className="flex flex-col items-center justify-center">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#F3F4F6] mb-4">
              <FileText className="w-6 h-6 text-[#A1A1A1]" />
            </div>
            <p className="text-sm font-medium text-[#444]">
              No recent sales activity
            </p>
            <p className="text-xs text-[#888] mt-1">
              Your latest transactions will show up here once sales are recorded.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentSalesActivity;