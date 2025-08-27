import React from "react";
import { Link } from "react-router-dom";
import { useTransactionsStore } from "@/stores/useTransactionStore";
import { balanceTextClass, formatCurrency } from "@/utils/styles";

import { MdKeyboardArrowRight, MdKeyboardArrowDown } from "react-icons/md";
// ui
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

const RecentSalesActivity: React.FC = () => {
  const { transactions } = useTransactionsStore();

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

      {/* sales data */}
      <div>
        {[...(transactions || [])]
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .slice(0, 4)
          .map((sale, i) => (
            <div key={i} className="p-4 border-t border-[#D9D9D9]">
              <div className="flex justify-between items-center">
                <div>
                  <div className="flex flex-col">
                    <p className="text-[#333333] mb-2">
                      {sale.clientName || sale.walkInClientName}
                    </p>
                    <p
                      className={`md:hidden text-sm font-semibold ${balanceTextClass(
                        sale.total
                      )}`}
                    >
                      {formatCurrency(sale.total)}
                    </p>
                  </div>
                  {sale.items && (
                    <div className="p-2 md:border rounded md:border-[#D9D9D9] w-fit flex gap-1 items-center">
                      <p className="text-[#444444B2] text-xs md:text-sm">
                        {sale.items.length > 0 && (
                          <>
                            <span>
                              {sale.items[0].quantity}x{" "}
                              {sale.items[0].productName}
                            </span>
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
                                  {sale.items
                                    .slice(1)
                                    .map(
                                      (item, index) =>
                                        `${item.quantity}x ${item.productName}${
                                          index < sale.items.length - 2
                                            ? ", "
                                            : ""
                                        }`
                                    )}
                                </PopoverContent>
                              </Popover>
                            )}
                          </>
                        )}
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex gap-1.5 items-center">
                  <p
                    className={`hidden md:flex text-sm font-semibold ${balanceTextClass(
                      sale.total
                    )}`}
                  >
                    {formatCurrency(sale.total)}
                  </p>
                  <span className="text-xs text-[var(--cl-secondary)]">
                    {new Date(sale.createdAt).toLocaleTimeString("en-NG", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default RecentSalesActivity;
