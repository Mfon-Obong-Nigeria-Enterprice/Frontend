import { useMemo, useState } from "react";

// 1. IMPORT the shared type instead of defining it locally
// Make sure this path matches your project aliases (usually @/types/...)
// or use relative path: "../../../../types/transactions"
import type { Transaction } from "@/types/transactions"; 

// Keep this only if it is NOT exported from your main types file. 
// If Transaction.items uses this, you might not need it here.
// interface TransactionItem {
//   subtotal: number;
//   quantity: number;
// }

interface SalesOverviewProps {
  transactions?: Transaction[] | null;
}

// --- Helper: Format Currency ---
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    notation: "compact", 
    compactDisplay: "short",
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(amount);
};

export const SalesOverview = ({ transactions }: SalesOverviewProps) => {
  const tx = transactions ?? [];
  const [filter, setFilter] = useState<"Daily" | "Weekly" | "Monthly">("Daily");

  // --- Core Logic: Process Data based on Filter ---
  const chartData = useMemo(() => {
    // 2. SAFEGUARD: Filter out items without dates before sorting
    const validTransactions = tx.filter(t => t.date);

    // Determine the "Current" date based on data
    const latestTransactionDate = validTransactions.length > 0 
      ? new Date(
          validTransactions.sort((a, b) => 
            new Date(b.date!).getTime() - new Date(a.date!).getTime()
          )[0].date!
        )
      : new Date();

    const dataMap = new Map<string, number>();
    let labels: string[] = [];

    // 1. Setup Time Frames & Labels
    if (filter === "Daily") {
      for (let i = 6; i >= 0; i--) {
        const d = new Date(latestTransactionDate);
        d.setDate(d.getDate() - i);
        const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        labels.push(label);
        dataMap.set(label, 0); 
      }
    } else if (filter === "Weekly") {
      for (let i = 3; i >= 0; i--) {
        const d = new Date(latestTransactionDate);
        d.setDate(d.getDate() - (i * 7));
        const label = `Wk ${getWeekNumber(d)}`; 
        labels.push(label);
        dataMap.set(label, 0);
      }
    } else if (filter === "Monthly") {
      for (let i = 5; i >= 0; i--) {
        const d = new Date(latestTransactionDate);
        d.setMonth(d.getMonth() - i);
        const label = d.toLocaleDateString("en-US", { month: "short" });
        labels.push(label);
        dataMap.set(label, 0);
      }
    }

    // 2. Aggregate Transactions
    tx.forEach((t) => {
      // 3. CHECK: Ensure date exists before processing
      if (t.status !== "COMPLETED" || !t.date) return;

      const tDate = new Date(t.date);
      let key = "";

      if (filter === "Daily") {
        key = tDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      } else if (filter === "Weekly") {
        key = `Wk ${getWeekNumber(tDate)}`;
      } else if (filter === "Monthly") {
        key = tDate.toLocaleDateString("en-US", { month: "short" });
      }

      if (dataMap.has(key)) {
        const currentVal = dataMap.get(key) || 0;
        if (t.type === "RETURN") {
          dataMap.set(key, currentVal - t.total);
        } else {
          dataMap.set(key, currentVal + t.total);
        }
      }
    });

    return labels.map((label) => ({
      label,
      value: Math.max(0, dataMap.get(label) || 0),
    }));

  }, [transactions, filter]);

  // --- Helper to calculate Scale ---
  const maxValue = Math.max(...chartData.map((d) => d.value), 100);
  const yAxisLabels = [1, 0.8, 0.6, 0.4, 0.2].map(factor => formatCurrency(maxValue * factor));

  return (
    <div className="bg-white rounded-[10px] border border-[#E5E7EB] shadow-sm p-4 md:p-6 h-full flex flex-col">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-6 gap-3 md:gap-4 shrink-0">
        <h2 className="text-[16px] md:text-lg font-semibold text-[#1F2937]">Sales Overview</h2>

        {/* Timeframe Tabs */}
        <div className="flex items-center self-start sm:self-auto bg-transparent rounded-lg">
          {(["Daily", "Weekly", "Monthly"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-medium rounded-[4px] transition-colors ${
                filter === tab
                  ? "bg-[#E6F0FF] text-[#3D80FF]"
                  : "text-[#6B7280] hover:bg-gray-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Container */}
      <div className="bg-[#F9FAFB] rounded-lg p-3 md:p-6 relative flex-1 min-h-[250px] flex items-end">
        
        {/* Y-Axis Labels */}
        <div className="absolute left-3 md:left-6 top-6 bottom-10 flex flex-col justify-between text-[10px] md:text-xs text-[#9CA3AF] h-[calc(100%-60px)]">
          {yAxisLabels.map((label, i) => (
            <span key={i}>{label}</span>
          ))}
        </div>

        {/* Chart Bars Area */}
        <div className="flex-1 flex items-end justify-between pl-8 md:pl-12 pr-1 md:pr-2 h-[calc(100%-40px)] mb-2 md:mb-0 gap-1 md:gap-4 w-full">
          {chartData.map((item, index) => {
            const heightPercentage = (item.value / maxValue) * 100;
            
            return (
              <div key={index} className="flex flex-col items-center gap-1 md:gap-3 group flex-1 h-full justify-end min-w-0">
                {/* Bar Container */}
                <div className="relative w-full flex justify-center items-end h-full">
                  <div
                    className="w-full max-w-[12px] md:max-w-[20px] lg:max-w-[32px] bg-[#DA291C] rounded-t-[2px] md:rounded-t-[4px] transition-all duration-500 ease-out group-hover:opacity-90 relative"
                    style={{ height: `${heightPercentage}%` }}
                  >
                    {/* Tooltip */}
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 md:-top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[9px] md:text-[10px] px-1.5 py-0.5 md:px-2 md:py-1 rounded shadow-lg transition-opacity whitespace-nowrap z-20 pointer-events-none">
                      {formatCurrency(item.value)}
                    </div>
                  </div>
                </div>
                {/* X-Axis Label */}
                <span className="text-[9px] md:text-[10px] lg:text-xs text-[#9CA3AF] font-normal text-center whitespace-nowrap overflow-hidden text-ellipsis w-full">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Helper for Weekly Logic
function getWeekNumber(d: Date): number {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}