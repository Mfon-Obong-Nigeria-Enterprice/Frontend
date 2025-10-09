import { useMemo } from "react";
import useTransactionWithCategories from "@/hooks/useTransactionWithCategories";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { isCategoryObject } from "@/utils/helpers";
import { TrendingUp, BarChart3 } from "lucide-react";

// The colors correspond to the image: Blue, Orange, Red
const COLORS = ["#4285F4", "#FBBC05", "#EA4335", "#2ECC71", "#8C1C1380"];

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
    <div className="w-full h-full min-h-[200px] flex flex-col items-center justify-center p-6">
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

  // Check if we have any data
  const hasData = data.length > 0 && data.some((item) => item.value > 0);

  // If no data, show empty state
  if (!hasData) {
    return <EmptyChartState />;
  }

  // Calculate total once
  const total = data.reduce((sum, item) => sum + item.value, 0);

  // Add percentage field
  const chartData = data.map((item) => ({
    ...item,
    percent: total > 0 ? (item.value / total) * 100 : 0,
  }));

  return (
    // Main container uses flex to arrange chart and legend side-by-side on large screens
    <div className="w-full h-full min-h-[300px] flex flex-col lg:flex-row items-center justify-center gap-4 p-4">
      
      {/* Pie Chart Container: Takes up more space (lg:w-3/5) to be larger */}
      <div className="w-full lg:w-3/5 h-[300px] lg:h-[350px] flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              nameKey="name"
              dataKey="value"
              cx="50%" // Center the pie chart within its container
              cy="50%"
              outerRadius="90%" // Make the pie chart even bigger
            >
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip formatter={(_value, name, props) => [`${(props.payload.percent).toFixed(2)}%`, name]} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Custom Legend/List: Takes up less space (lg:w-2/5) and is styled to look like the image */}
      <div className="w-full lg:w-2/5 flex flex-col items-start justify-center p-2 lg:h-[350px]">
        {/* ul list box container - adjusted max-width for containment */}
        <ul className="space-y-3 w-full max-w-sm mx-auto lg:mx-0">
          {chartData.map((entry, index) => {
            // Format the category name (45%)
            const legendText = `${entry.name} (${entry.percent?.toFixed(0) ?? 0}%)`;
            return (
              <li
                key={`item-${index}`}
                // Use smaller font size (text-sm) for the legend
                className="flex items-center text-sm" 
              >
                {/* Color Box: Increased size (w-5 h-5) for better prominence */}
                <span
                  className="w-5 h-5 rounded-sm flex-shrink-0" 
                  style={{
                    backgroundColor: COLORS[index % COLORS.length],
                    marginRight: '10px', // Adjusted space
                  }}
                />
               
                <span className="text-gray-800 font-normal">
                  {legendText}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}