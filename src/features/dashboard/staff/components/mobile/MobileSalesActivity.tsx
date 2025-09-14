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
import { Card, CardContent } from "@/components/ui/card";

//  icons
import { ChevronDown, Package } from "lucide-react";

const MobileSalesActivity = ({
  filteredTransactions,
}: {
  filteredTransactions: Transaction[];
}) => {
  return (
    <div className="md:hidden space-y-2 mt-2">
      {filteredTransactions && filteredTransactions?.length > 0 ? (
        filteredTransactions?.map((transaction, i) => (
          <Card key={transaction._id + i} className="border-[#D9D9D9]">
            <CardContent className="py-2 px-4">
              {/* Client Name */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[#444444] text-base font-medium capitalize">
                  {transaction.clientId?.name || transaction.walkInClientName}
                </span>
                <div className="flex items-center gap-1 text-[#666] text-sm">
                  <span className="uppercase">
                    {new Date(transaction.createdAt).toLocaleTimeString(
                      "en-NG",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      }
                    )}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div className="flex items-start gap-2 mb-3">
                <Package className="w-4 h-4 text-[#666] mt-0.5" />
                <div className="text-[#444444] text-base">
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
                              size="sm"
                              className="ml-1 h-auto p-1"
                            >
                              <ChevronDown className="w-4 h-4" />
                              <span className="ml-1 text-sm">
                                +{transaction.items.length - 1} more
                              </span>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="text-sm max-w-60">
                            <div className="space-y-1">
                              {transaction.items.slice(1).map((item, index) => (
                                <div key={index}>
                                  {item.quantity}x {item.productName}
                                </div>
                              ))}
                            </div>
                          </PopoverContent>
                        </Popover>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Total and Time */}
              <div className="flex items-center justify-between">
                <div
                  className={`text-lg font-semibold ${balanceTextClass(
                    transaction.total
                  )}`}
                >
                  {formatCurrency(transaction.total)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <Card className="border-[#D9D9D9]">
          <CardContent className="py-16">
            <div className="flex flex-col items-center justify-center text-center text-[#666]">
              {/* Icon */}
              <div className="w-16 h-16 rounded-full bg-[#F5F5F5] flex items-center justify-center mb-4">
                <Package className="w-8 h-8 text-[#A1A1A1]" />
              </div>
              {/* Title */}
              <p className="text-lg font-medium mb-2">No transactions yet</p>
              {/* Subtitle */}
              <p className="text-sm text-[#999] max-w-xs">
                Your sales activity will appear here once transactions are
                recorded.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MobileSalesActivity;
