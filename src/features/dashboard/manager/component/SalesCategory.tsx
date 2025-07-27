'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { Cell, Pie, PieChart } from "recharts";

interface CategoryData {
  name: string;
  value: number; 
}

interface ChartConfig {
  [key: string]: {
    label: string;
    color: string;
  };
}

interface SalesCategoryChartProps {
  data: CategoryData[];
}

const COLORS = ["#FFA500", "#3D80FF", "#F95353", "#8A2BE2", "#20B2AA"];

const chartConfig: ChartConfig = {
  "Building Materials": { label: "Building Materials", color: COLORS[0] },
  "Construction Services": { label: "Construction Services", color: COLORS[1] },
  "Equipment rental": { label: "Equipment Rental", color: COLORS[2] },
};

const SalesCategory: React.FC<SalesCategoryChartProps> = ({ data }) => {

  const getCategoryColor = (categoryName: string, index: number): string => {
    return chartConfig[categoryName]?.color || COLORS[index % COLORS.length];
  };

  const renderCustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: { value: number | string; name: string }[];
  }) => {
    if (active && payload && payload.length > 0) {
      const { name, value } = payload[0];
      const parsed = typeof value === "number" ? value : parseFloat(value);
      return (
        <div className="bg-white p-2 rounded shadow text-sm text-gray-700">
          {name}: {parsed}%
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mt-4 lg:mt-0">
      <Card className="relative">
        <CardHeader>
          <CardTitle className="flex items-start">
            Sales Distribution by Category
          </CardTitle>
        </CardHeader>
        <CardContent>
         
          <ChartContainer config={chartConfig} className="h-49.5 block md:hidden">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-mobile-${index}`}
                    fill={getCategoryColor(entry.name, index)}
                  />
                ))}
              </Pie>
              <ChartTooltip content={renderCustomTooltip} />
            </PieChart>
          </ChartContainer>

         
          <ChartContainer config={chartConfig} className="h-49.5 hidden md:block">
            <PieChart>
              <Pie
                data={data}
                cx="25%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-desktop-${index}`}
                    fill={getCategoryColor(entry.name, index)}
                  />
                ))}
              </Pie>
              <ChartTooltip content={renderCustomTooltip} />
            </PieChart>
          </ChartContainer>

          
          <div className="mt-4 space-y-2 absolute right-1 bottom-0.5 flex flex-wrap sm:block">
            {data.map((category, index) => {
              const color = getCategoryColor(category.name, index);
              const label = chartConfig[category.name]?.label || category.name;

              return (
                <div key={category.name} className="flex items-center bg-transparent p-1">
                  <div className="flex items-center pr-1">
                    <div
                      className="mr-2 h-3 w-3 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-sm font-medium">{label}</span>
                  </div>
                  <div>
                    <p className="text-sm">{category.value}%</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesCategory;
