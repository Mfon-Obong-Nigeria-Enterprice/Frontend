import { useMemo } from "react";
import useTransactionWithCategories from "@/hooks/useTransactionWithCategories";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
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

  // Add percentage field for both label and legend
  const chartData = data.map((item) => ({
    ...item,
    percent: total > 0 ? (item.value / total) * 100 : 0, // number, not normalized
  }));

  return (
    <PieChart width={450} height={200}>
      <Pie
        data={chartData}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={70}
        label={({ name, payload }) =>
          `${name} (${payload.percent.toFixed(0)}%)`
        }
      >
        {chartData.map((_, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>

      <Tooltip />

      <Legend
        layout="vertical"
        align="right"
        content={({ payload }) => (
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {payload?.map((entry, index) => {
              const payloadWithPercent = entry.payload as {
                percent?: number;
                value: string;
              };
              return (
                <li key={`item-${index}`} style={{ marginBottom: 8 }}>
                  <span
                    style={{
                      display: "inline-block",
                      width: 10,
                      height: 10,
                      backgroundColor: entry.color,
                      marginRight: 8,
                    }}
                  />
                  {entry.value} ({payloadWithPercent?.percent?.toFixed(0) ?? 0}
                  %)
                </li>
              );
            })}
          </ul>
        )}
      />
    </PieChart>
  );
}

// import { useMemo } from "react";
// import useTransactionWithCategories from "@/hooks/useTransactionWithCategories";
// import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
// import { isCategoryObject } from "@/utils/helpers";

// const COLORS = ["#4285F4", "#FBBC05", "#EA4335"];

// function useCategoryChartData() {
//   const transactionsWithCategories = useTransactionWithCategories();

//   return useMemo(() => {
//     const categoryTotals: Record<string, number> = {};

//     transactionsWithCategories.forEach((item) => {
//       let category = "Uncategorized";

//       if (isCategoryObject(item.category)) {
//         category = item.category.name || "Uncategorized";
//       }
//       const amount = item.subtotal || 0;

//       if (!categoryTotals[category]) {
//         categoryTotals[category] = 0;
//       }
//       categoryTotals[category] += amount;
//     });

//     return Object.entries(categoryTotals).map(([name, value]) => ({
//       name,
//       value,
//     }));
//   }, [transactionsWithCategories]);
// }

// export default function SalesByCategoryChart() {
//   const data = useCategoryChartData();

//   // Compute percentages here so they are in the Pie's data
//   const total = data.reduce((sum, item) => sum + item.value, 0);
//   const chartData = data.map((item) => ({
//     ...item,
//     percent: total > 0 ? (item.value / total) * 100 : 0, // number %
//   }));

//   return (
//     <PieChart width={500} height={300}>
//       <Pie
//         data={chartData} // ✅ pass chartData with percent
//         dataKey="value"
//         nameKey="name"
//         cx="50%"
//         cy="50%"
//         outerRadius={100}
//         label={({ name, percent = 0 }) =>
//           `${name} (${(percent * 100).toFixed(0)}%)`
//         }
//       >
//         {chartData.map((_, index) => (
//           <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//         ))}
//       </Pie>

//       <Tooltip />

//       <Legend
//         layout="vertical"
//         align="right"
//         // verticalAlign="middle"
//         content={({ payload }) => (
//           <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
//             {payload?.map((entry, index) => (
//               <li key={`item-${index}`} style={{ marginBottom: 8 }}>
//                 <span
//                   style={{
//                     display: "inline-block",
//                     width: 10,
//                     height: 10,
//                     backgroundColor: entry.color,
//                     marginRight: 8,
//                   }}
//                 />
//                 {entry.value} ({entry.payload?.percent?.toFixed(0) ?? 0}%)
//               </li>
//             ))}
//           </ul>
//         )}
//       />
//     </PieChart>
//   );
// }
