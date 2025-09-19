import { useMemo } from "react";
import useTransactionWithCategories from "@/hooks/useTransactionWithCategories";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { isCategoryObject } from "@/utils/helpers";
import { TrendingUp, BarChart3 } from "lucide-react";

const COLORS = ["#4285F4", "#FBBC05", "#EA4335"];

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
    <div className="w-[100%] h-[100%] min-h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            nameKey="name"
            cx="50%" // center horizontally
            cy="50%" // center vertically
            outerRadius="80%" // relative to container
            label={({ payload }) => ` (${payload.percent.toFixed(0)}%)`}
          >
            {chartData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip />

          <Legend
            layout="vertical" // better for mobile
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{
              paddingBottom: "0px",
            }}
            content={({ payload }) => (
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-evenly",
                }}
              >
                {payload?.map((entry, index) => {
                  const payloadWithPercent = entry.payload as {
                    percent?: number;
                    value: string;
                  };
                  return (
                    <li
                      key={`item-${index}`}
                      style={{
                        margin: "0px 0px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          width: 12,
                          height: 12,
                          backgroundColor: entry.color,
                          marginRight: 2,
                        }}
                      />
                      {entry.value} (
                      {payloadWithPercent?.percent?.toFixed(0) ?? 0}
                      %)
                    </li>
                  );
                })}
              </ul>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
