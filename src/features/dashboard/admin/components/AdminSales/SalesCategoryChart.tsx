/** @format */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   ChartContainer,
//   ChartTooltip,
//   ChartTooltipContent,
// } from "@/components/ui/chart";
// import { Cell, Pie, PieChart } from "recharts";

interface CategoryData {
  name: string;
  value: number;
}

interface SalesCategoryChartProps {
  data: CategoryData[];
}

const COLORS = ["#3D80FF", "#FFA500", "#F95353"];

const SalesCategoryChart: React.FC<SalesCategoryChartProps> = ({ data }) => {
  //   const chartConfig = {
  //     Building: { label: "Building materials", color: "#FFA500" },
  //     Construction: { label: "Construction services", color: "#3D80FF" },
  //     Equipment: { label: "Equipment rental", color: "#F95353" },
  //   };
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
            {/* Chart Container - responsive sizing */}
            {/* <div className="flex-1 lg:flex-none  min-h-[200px] sm:min-h-[350px] lg:min-h-[160px] ">
              <ChartContainer
                config={chartConfig}
                className=" lg:w-[250px] p-0 min-h-[200px] sm:min-h-[350px] lg:min-h-[160px]"
              >
                <PieChart>
                  <Pie
                    data={data}
                    outerRadius={80}
                    fill="#3D80FF"
                    dataKey="value"
                  >
                    {data.map((index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
            </div> */}

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

    // <div className="mt-4 lg:mt-0">
    //   <Card className="relative w-full">
    //     <CardHeader className="pb-2">
    //       <CardTitle className="text-start text-[#1E1E1E] text-lg sm:text-xl font-medium">
    //         Sales by Category
    //       </CardTitle>
    //     </CardHeader>
    //     <CardContent className="p-2 sm:p-4">
    //       {/* Mobile - centered pie chart */}
    //       <ChartContainer
    //         config={chartConfig}
    //         className="h-49.5 block md:hidden"
    //       >
    //         <PieChart>
    //           <Pie
    //             data={data}
    //             cx="50%"
    //             cy="50%"
    //             // labelLine={false}
    //             outerRadius={80}
    //             fill="#3D80FF"
    //             dataKey="value"
    //           >
    //             {data.map((entry, index) => (
    //               <Cell
    //                 key={`cell-${index}`}
    //                 fill={COLORS[index % COLORS.length]}
    //               />
    //             ))}
    //           </Pie>
    //           <ChartTooltip content={<ChartTooltipContent />} />
    //         </PieChart>
    //       </ChartContainer>

    //       {/* MD and up - pie chart at start */}
    //       <ChartContainer config={chartConfig} className="h-43 hidden md:block">
    //         <PieChart>
    //           <Pie
    //             data={data}
    //             cx="25%"
    //             cy="50%"
    //             labelLine={false}
    //             outerRadius={80}
    //             fill="#FFA500"
    //             dataKey="value"
    //           >
    //             {data.map((entry, index) => (
    //               <Cell
    //                 key={`cell-${index}`}
    //                 fill={COLORS[index % COLORS.length]}
    //               />
    //             ))}
    //           </Pie>
    //           <ChartTooltip content={<ChartTooltipContent />} />
    //         </PieChart>
    //       </ChartContainer>

    //       {/* Category Summary */}
    //       <div className="mt-4 space-y-2 absolute right-1 bottom-0.5 flex flex-wrap sm:block">
    //         {data.map((category, index) => (
    //           <div
    //             key={category.name}
    //             className="flex items-center bg-transparent p-1"
    //           >
    //             <div className="flex items-center pr-1">
    //               <div
    //                 className="mr-2 h-3 w-3"
    //                 style={{ backgroundColor: COLORS[index % COLORS.length] }}
    //               />
    //               <span className="text-sm font-medium">{category.name}</span>
    //             </div>
    //             <div>
    //               <p className="text-sm">({category.value}%)</p>
    //             </div>
    //           </div>
    //         ))}
    //       </div>
    //     </CardContent>
    //   </Card>
    // </div>
  );
};

export default SalesCategoryChart;
