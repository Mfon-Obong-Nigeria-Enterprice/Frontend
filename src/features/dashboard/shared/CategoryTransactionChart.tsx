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

export default function SalesByCategoryChart() {
  const data = useCategoryChartData();

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
              paddingBottom: "10px",
            }}
            content={({ payload }) => (
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
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
                        margin: "4px 5px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          width: 10,
                          height: 10,
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
