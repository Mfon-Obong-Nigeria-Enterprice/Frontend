import { useMemo } from "react";
import useTransactionWithCategories from "@/hooks/useTransactionWithCategories";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { isCategoryObject } from "@/utils/helpers";
import { TrendingUp, BarChart3 } from "lucide-react";

// Colors matched from the Figma screenshots
const COLORS = ["#3B82F6", "#FFA500", "#EF4444", "#2ECC71", "#8C1C13"];

function useCategoryChartData() {
  const transactionsWithCategories = useTransactionWithCategories();

  return useMemo(() => {
    const categoryTotals: Record<string, number> = {};

    transactionsWithCategories.forEach((item) => {
      let category = "Uncategorized";

      if (isCategoryObject(item.category)) {
        category = item.category.name || "Uncategorized";
      }
      const amount = item.subtotal || 0;

      if (!categoryTotals[category]) {
        categoryTotals[category] = 0;
      }
      categoryTotals[category] += amount;
    });

    return Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      value,
    }));
  }, [transactionsWithCategories]);
}

// Empty State Component
function EmptyChartState() {
  return (
    <div className="w-full h-full min-h-[200px] flex flex-col items-center justify-center p-6 bg-white rounded-[10px] border border-[#E5E7EB]">
      <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
        <BarChart3 className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        No Sales Data Available
      </h3>
      <p className="text-sm text-gray-500 text-center max-w-sm mb-4">
        There are no sales transactions to display in the chart. Start making
        sales to see your category breakdown here.
      </p>
      <div className="flex items-center text-xs text-gray-400">
        <TrendingUp className="w-4 h-4 mr-1" />
        <span>Sales data will appear here once you have transactions</span>
      </div>
    </div>
  );
}

export default function SalesByCategoryChart() {
  const data = useCategoryChartData();

  const hasData = data.length > 0 && data.some((item) => item.value > 0);

  if (!hasData) {
    return <EmptyChartState />;
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);

  const chartData = data
    .map((item) => ({
      ...item,
      percent: total > 0 ? (item.value / total) * 100 : 0,
    }))
    .sort((a, b) => b.value - a.value);

  return (
    <div className="w-full bg-white rounded-[10px] border border-[#E5E7EB] p-5 h-full">
      <h4 className="text-[16px] md:text-lg font-medium text-[#1F2937] mb-4">
        Sales by Category
      </h4>

      {/* LAYOUT CONTAINER:
         - Mobile & Tablet: flex-col (Stacked)
         - Desktop: flex-row (Side-by-Side)
      */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        
        {/* CHART SECTION */}
        <div className="w-full lg:w-1/2 h-[220px] flex items-center justify-center relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={0} 
                outerRadius="80%" 
                paddingAngle={0}
                dataKey="value"
                stroke="none"
              >
                {chartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `₦${value.toLocaleString()}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* LEGEND SECTION */}
        <div className="w-full lg:w-1/2">
          <ul className="flex flex-col gap-4">
            {chartData.map((entry, index) => {
              const percentageStr = `(${entry.percent?.toFixed(0)}%)`;
              
              return (
                <li
                  key={`item-${index}`}
                  className="flex items-center w-full text-sm text-[#4B5563]"
                >
                  {/* Color Box (Always visible) */}
                  <span
                    className="w-4 h-4 rounded-[2px] mr-3 shrink-0"
                    style={{
                      backgroundColor: COLORS[index % COLORS.length],
                    }}
                  />

                  {/* --- 1. MOBILE VIEW (Visible ONLY on Mobile) --- 
                      Text and Percentage are INLINE (no gap) 
                  */}
                  <div className="flex items-center md:hidden">
                    <span className="text-[#1F2937] mr-1">
                        {entry.name}
                    </span>
                    <span className="text-[#6B7280] font-normal">
                        {percentageStr}
                    </span>
                  </div>

                  {/* --- 2. TABLET & DESKTOP VIEW (Visible on md and up) --- 
                      Name on Left, Percentage on Right (Space between)
                  */}
                  <div className="hidden md:flex flex-1 items-center justify-between">
                    <span className="text-[#1F2937] truncate" title={entry.name}>
                        {entry.name}
                    </span>
                    <span className="text-[#6B7280] font-normal ml-auto">
                        {percentageStr}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}