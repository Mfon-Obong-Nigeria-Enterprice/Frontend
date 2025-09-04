import React from "react";
import { useTransactionsStore } from "@/stores/useTransactionStore";
import { balanceTextClass, formatCurrency } from "@/utils/styles";
import { MdKeyboardArrowDown } from "react-icons/md";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react"; // subtle empty-state icon

const RecentSalesActivity: React.FC = () => {
  const { transactions } = useTransactionsStore();

  // sort recent
  const recentSales = [...(transactions || [])]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 4);

  return (
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full text-left border-t border-[#D9D9D9]">
        <thead className="bg-[#f9f9f9] text-sm text-[#666]">
          <tr>
            <th className="py-3 px-4">Client</th>
            <th className="py-3 px-4">Items</th>
            <th className="py-3 px-4">Amount</th>
            <th className="py-3 px-4">Time</th>
          </tr>
        </thead>
        <tbody>
          {recentSales.length > 0 ? (
            recentSales.map((sale, i) => (
              <tr key={i} className="border-t border-[#D9D9D9]">
                <td className="py-3 px-4">
                  {sale.clientName || sale.walkInClientName}
                </td>
                <td className="py-3 px-4">
                  {sale.items && sale.items.length > 0 && (
                    <>
                      {sale.items[0].quantity}x {sale.items[0].productName}
                      {sale.items.length > 1 && (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="ml-1"
                            >
                              <MdKeyboardArrowDown className="w-4 h-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="text-sm max-w-60">
                            {sale.items.slice(1).map((item, index) => (
                              <span key={index}>
                                {item.quantity}x {item.productName}
                                {index < sale.items.length - 2 ? ", " : ""}
                              </span>
                            ))}
                          </PopoverContent>
                        </Popover>
                      )}
                    </>
                  )}
                </td>
                <td
                  className={`py-3 px-4 font-semibold ${balanceTextClass(
                    sale.total
                  )}`}
                >
                  {formatCurrency(sale.total)}
                </td>
                <td className="py-3 px-4 text-xs text-[var(--cl-secondary)]">
                  {new Date(sale.createdAt).toLocaleTimeString("en-NG", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4}>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#F3F4F6] mb-4">
                    <FileText className="w-6 h-6 text-[#A1A1A1]" />
                  </div>
                  <p className="text-sm font-medium text-[#444]">
                    No recent sales activity
                  </p>
                  <p className="text-xs text-[#888] mt-1">
                    Your latest transactions will show up here once sales are
                    recorded.
                  </p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RecentSalesActivity;
