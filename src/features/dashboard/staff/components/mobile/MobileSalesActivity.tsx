//type
import type { Transaction } from "@/types/transactions";

// utils
import { formatCurrency, balanceTextClass } from "@/utils/styles";

// ui
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

//  icons
import { ChevronDown } from "lucide-react";

const MobileSalesActivity = ({
  filteredTransactions,
}: {
  filteredTransactions: Transaction[];
}) => {
  return (
    <div className="md:hidden">
      <table className="w-full">
        <tbody>
          {filteredTransactions && filteredTransactions?.length > 0 ? (
            filteredTransactions?.map((transaction, i) => (
              <tr
                key={transaction._id + i}
                className="h-[65px] border-b border-[#D9D9D9]"
              >
                <td className="text-[#444444] text-base pl-5 md:pl-10">
                  {transaction.clientId?.name || transaction.walkInClientName}
                </td>
                <td className="text-[#444444] text-base min-w-30">
                  {transaction.items.length > 0 && (
                    <>
                      <span>
                        {transaction.items[0].quantity}x{" "}
                        {transaction.items[0].productName}
                      </span>
                      {transaction.items.length > 1 && (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="ml-1"
                            >
                              <ChevronDown className="w-4 h-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="text-sm max-w-60">
                            {transaction.items
                              .slice(1)
                              .map(
                                (item, index) =>
                                  `${item.quantity}x ${item.productName}${
                                    index < transaction.items.length - 2
                                      ? ", "
                                      : ""
                                  }`
                              )}
                          </PopoverContent>
                        </Popover>
                      )}
                    </>
                  )}
                </td>
                <td className={balanceTextClass(transaction.total)}>
                  {formatCurrency(transaction.total)}
                </td>
                <td className="uppercase text-[#444444] text-base text-right pr-5 md:pr-10">
                  {new Date(transaction.createdAt).toLocaleTimeString("en-NG", {
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
                <div className="flex flex-col items-center justify-center py-10 text-center text-[#666]">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-full bg-[#F5F5F5] flex items-center justify-center mb-3">
                    <ChevronDown className="w-6 h-6 text-[#A1A1A1] rotate-90" />
                  </div>
                  {/* Title */}
                  <p className="text-sm font-medium">No transactions yet</p>
                  {/* Subtitle */}
                  <p className="text-xs text-[#999] mt-1">
                    Your sales activity will appear here once transactions are
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

export default MobileSalesActivity;
