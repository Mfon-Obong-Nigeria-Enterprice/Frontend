import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useTransactionsStore } from "@/stores/useTransactionStore";

// Helper to format currency with the specific sign and style
const formatAmount = (amount: number, type: string) => {
  // FIX 1: Removed unused 'isPositive' variable

  const isGreen = type === "DEPOSIT"; // Example logic to match "Akpan construction +150,000"
  const sign = isGreen ? "+" : "-";
  
  const formatted = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);

  return (
    <span className={isGreen ? "text-[#22C55E]" : "text-[#EF4444]"}>
      {sign}{formatted.replace("NGN", "₦")}
    </span>
  );
};

export const RecentSalesWidget = () => {
  const navigate = useNavigate();
  const { transactions } = useTransactionsStore();

  // Get the 4 most recent transactions
  // FIX 2: Safer sorting. We default undefined dates to 0 (epoch) so they go to the bottom.
  const recentItems = [...(transactions || [])]
    .sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 4);

  return (
    <div className="bg-white rounded-[10px] border border-[#E5E7EB] shadow-sm p-5 h-full flex flex-col">
      <h2 className="text-lg font-semibold text-[#1F2937] mb-4">Recent Sales</h2>

      <div className="flex-1 flex flex-col gap-0">
        {recentItems.length > 0 ? (
          <>
            {/* --- MOBILE / TABLET VIEW (List Style) --- */}
            <div className="lg:hidden flex flex-col">
              {recentItems.map((item, index) => (
                <div
                  key={`mobile-${item._id || index}`}
                  className="flex justify-between items-center py-4 border-b border-[#F3F4F6] last:border-0"
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-[#374151]">
                      {item.clientName || item.walkInClient?.name || "Unknown Client"}
                    </span> 
                    <span className="text-xs text-[#9CA3AF]">
                      {/* FIX 3: Check if item.date exists before creating Date object */}
                      {item.date ? new Date(item.date).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                      }) : "N/A"}
                    </span>
                  </div>
                  <div className="text-sm font-medium">
                    {formatAmount(item.total, item.type)}
                  </div>
                </div>
              ))}
            </div>

            {/* --- DESKTOP VIEW (Table Style) --- */}
            <div className="hidden lg:block w-full mt-2">
              {/* Desktop Header */}
              <div className="flex w-full bg-[#F3F4F6] py-2 px-4 rounded-t-[4px]">
                <span className="w-1/3 text-sm font-normal text-[#333333]">Clients</span>
                <span className="w-1/3 text-sm font-normal text-[#333333] text-center">Amounts</span>
                <span className="w-1/3 text-sm font-normal text-[#333333] text-right">Time</span>
              </div>
              
              {/* Desktop Rows */}
              <div className="flex flex-col">
                {recentItems.map((item, index) => (
                  <div
                    key={`desktop-${item._id || index}`}
                    className={`flex items-center w-full py-3 px-4 ${
                      index % 2 !== 0 ? "bg-[#F3F4F6]" : "bg-white"
                    }`}
                  >
                    {/* Client */}
                    <div className="w-1/3 truncate pr-2">
                      <span className="text-[12px] text-[#333333]">
                        {item.clientName || item.walkInClient?.name || "Unknown"}
                      </span>
                    </div>

                    {/* Amount */}
                    <div className="w-1/3 text-center text-[12px] font-medium">
                      {formatAmount(item.total, item.type)}
                    </div>

                    {/* Time */}
                    <div className="w-1/3 text-right">
                      <span className="text-[12px] text-[#7D7D7D]">
                        {/* FIX 3 (Repeated): Check if item.date exists */}
                        {item.date ? new Date(item.date).toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                        }) : "N/A"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="text-sm text-gray-400 py-8 text-center">
            No recent sales found
          </div>
        )}
      </div>

      <div className="mt-auto pt-4">
        <button
          onClick={() => navigate("/manager/dashboard/manage-transactions")}
          className="w-full flex items-center justify-between text-sm font-medium text-[#3D80FF] hover:text-blue-700 transition-colors bg-[#F9FAFB] hover:bg-[#F3F4F6] py-3 px-4 rounded-md lg:bg-transparent lg:hover:bg-transparent lg:justify-start lg:w-auto lg:p-0 lg:mt-2"
        >
          <span className="lg:mr-1">View all Sales</span>
          <ChevronRight className="w-4 h-4 md:block hidden" />
        </button>
      </div>
    </div>
  );
};