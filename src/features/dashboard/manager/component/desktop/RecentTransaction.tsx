import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
// store
import { useTransactionsStore } from "@/stores/useTransactionStore";

// hooks
import { useMergedTransactions } from "@/hooks/useMergedTransactions";

// utils
import { balanceClassT, formatCurrency } from "@/utils/styles";

const RecentTransactions = () => {
  const { transactions } = useTransactionsStore();
  const mergedTransactions = useMergedTransactions(transactions ?? []);

  return (
    <section className="hidden xl:block">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr className="border-b border-gray-200">
              <th className="py-3 text-base text-[#333333] font-normal text-start pl-1">
                Invoice
              </th>
              <th className="py-3 text-base text-[#333333] font-normal text-start pl-1">
                Date/Time
              </th>
              <th className="py-3 text-base text-[#333333] font-normal text-start pl-1">
                Items
              </th>
              <th className="py-3 text-base text-[#333333] font-normal text-start pl-1">
                Type
              </th>
              <th className="py-3 text-base text-[#333333] font-normal text-start pl-1">
                Amount
              </th>
              <th className="py-3 text-base text-[#333333] font-normal text-start pl-1">
                Location
              </th>
              <th className="py-3 text-base text-[#333333] font-normal text-start pl-1">
                Balance
              </th>
            </tr>
          </thead>

          <tbody>
            {[...(mergedTransactions || [])]
              .sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
              )
              .slice(0, 5)
              .map((transaction) => (
                <tr key={transaction._id} className="border-b border-[#d9d9d9]">
                  <td className="text-start pl-1 text-[#444444] text-sm font-normal py-3">
                    {transaction.invoiceNumber}
                  </td>

                  <td className="text-start pl-1 text-[#444444] text-sm font-normal py-3 ">
                    <div className="flex flex-col">
                      <span>
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </span>
                      <span className="text-sm text-[#7D7D7D]">
                        {new Date(transaction.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </td>

                  <td className="flex items-center justify-start text-[#444444] text-sm font-normal py-3 ">
                    {transaction.items.length > 0 && (
                      <>
                        <span>
                          {transaction.items[0].quantity}x{" "}
                          {transaction.items[0].productName}
                        </span>
                        {transaction.items.length > 1 && (
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <ChevronDown className="w-4 h-4" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="text-sm max-w-38">
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

                  <td className="text-start pl-1">
                    <p
                      className={`border text-[0.625rem] py-1.5 px-3 rounded-[6.25rem] max-w-18 text-center ${
                        transaction.type === "PURCHASE"
                          ? "border-[#F95353] bg-[#FFCACA] text-[#F95353]"
                          : transaction.type === "PICKUP"
                          ? "border-[#FFA500] bg-[#FFE7A4] text-[#FFA500]"
                          : " border-[#2ECC71] bg-[#C8F9DD] text-[#2ECC71]"
                      }`}
                    >
                      {transaction.type}
                    </p>
                  </td>

                  <td
                    className={`text-sm text-start pl-1 ${
                      transaction.total < 0
                        ? "text-[#F95353]"
                        : "text-[#2ECC71]"
                    }`}
                  >
                    {formatCurrency(transaction.total)}
                  </td>

                  <td className="text-start pl-1 text-[#444444] text-sm font-normal py-3">
                    {transaction.branchName}
                  </td>

                  <td
                    className={`text-sm text-start pl-1 ${balanceClassT(
                      transaction.client?.balance
                    )} 
                      `}
                  >
                    {formatCurrency(transaction.client?.balance ?? 0)}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default RecentTransactions;
