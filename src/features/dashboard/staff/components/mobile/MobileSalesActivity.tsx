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
              <td colSpan={4} className="text-[#333] text-center py-5">
                No transactions
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MobileSalesActivity;
