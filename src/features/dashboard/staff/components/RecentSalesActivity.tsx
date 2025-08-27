import React from "react";
import { Link } from "react-router-dom";
import { useTransactionsStore } from "@/stores/useTransactionStore";
import { balanceTextClass, formatCurrency } from "@/utils/styles";
import { MdKeyboardArrowRight, MdKeyboardArrowDown } from "react-icons/md";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

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
    <div className="bg-white rounded-[0.625rem] border border-[#D9D9D9] py-1 font-Inter">
      <div className="flex justify-between items-center p-4 gap-4">
        <h5 className="font-medium text-[var(--cl-text-dark)] text-base md:text-lg">
          Your Recent Sales Activity
        </h5>
        <Link
          to="/staff/dashboard/s-sales"
          className="flex md:gap-1 items-center text-[#3D80FF]"
        >
          <button className="text-sm cursor-pointer">
            View all <span className="hidden md:flex">Sales</span>
          </button>
          <MdKeyboardArrowRight />
        </Link>
      </div>

      {/* ===== DESKTOP VIEW (table) ===== */}
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
            {recentSales.map((sale, i) => (
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentSalesActivity;
