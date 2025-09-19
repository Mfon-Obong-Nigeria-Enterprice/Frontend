/** @format */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CategoryData {
  name: string;
  value: number;
}

interface SalesCategoryChartProps {
  data: CategoryData[];
}

const COLORS = ["#3D80FF", "#FFA500", "#F95353"];

const SalesCategoryChart: React.FC<SalesCategoryChartProps> = ({ data }) => {
  return (
    <div className="mt-4 lg:mt-0">
      <Card className="w-full relative">
        <CardHeader>
          <CardTitle className="text-start text-[#1E1E1E] text-lg sm:text-xl font-medium">
            Sales by Category
          </CardTitle>
        </CardHeader>
        <CardContent className="md:p-0 m-0">
          {/* Responsive layout container */}
          <div className="flex items-center justify-center lg:flex-row lg:items-start lg:justify-start min-h-[200px] sm:min-h-[170px] ">
            {/* Category Summary */}
            <div className="mt-4 space-y-2 absolute right-1 bottom-0.5 flex flex-wrap sm:block">
              {data.map((category, index) => (
                <div
                  key={category.name}
                  className="flex items-center bg-transparent p-1"
                >
                  <div className="flex items-center pr-1">
                    <div
                      className="mr-2 h-3 w-3"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm font-medium">{category.name}</span>
                  </div>
                  <div>
                    <p className="text-sm">({category.value}%)</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesCategoryChart;
