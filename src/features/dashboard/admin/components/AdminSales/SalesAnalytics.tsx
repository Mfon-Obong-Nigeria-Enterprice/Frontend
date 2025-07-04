import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SalesCategoryChart from "./SalesCategoryChart";
import { BsArrowUp } from "react-icons/bs";

const salesByCategory = [
  { name: "Building Materials", value: 45 },
  { name: "Construction services", value: 32 },
  { name: "Equipment rental", value: 23 },
];

type SalesMetrics = {
  totalSales: number;
  transactionCount: number;
  activeClients: number;
  averageTransaction: number;
};

type TopProduct = {
  prodName: string;
  soldUnit: number;
  revenue: number;
  category: string;
};
interface SalesAnalyticsProps {
  metrics: SalesMetrics;
  topProduct: TopProduct[];
}

const SalesAnalytics: React.FC<SalesAnalyticsProps> = ({
  metrics,
  topProduct,
}) => {
  // Add loading state or default values
  // if (!metrics) {
  //   return (
  //     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-5">
  //       {[...Array(4)].map((_, index) => (
  //         <Card key={index}>
  //           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
  //             <CardTitle className="text-sm font-medium text-gray-500">
  //               Loading...
  //             </CardTitle>
  //           </CardHeader>
  //           <CardContent>
  //             <div className="text-2xl font-bold text-gray-300">--</div>
  //             <p className="text-xs text-gray-400">Loading data...</p>
  //           </CardContent>
  //         </Card>
  //       ))}
  //     </div>
  //   );
  // }
  //
  //
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-normal text-[#7D7D7D]">
              Total sales(Today)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <div className="text-2xl font-bold text-gray-900">
                ₦{metrics.totalSales.toLocaleString()}
              </div>
              <p className="text-xs text-[#2ECC71] font-normal leading-4 flex items-center">
                <BsArrowUp />
                15% from yesterday
              </p>
            </div>
          </CardContent>
        </Card>
        {/*  */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-normal text-[#7D7D7D]">
              Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <div className="text-2xl font-bold text-gray-900">
                {metrics.transactionCount}
              </div>
              <p className="text-xs text-[#2ECC71] font-normal leading-4 flex items-center">
                <BsArrowUp />
                8% more than yesterday
              </p>
            </div>
          </CardContent>
        </Card>
        {/*  */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-normal text-[#7D7D7D]">
              Active clients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <div className="text-2xl font-bold text-gray-900">
                {metrics.activeClients}
              </div>
              <p className="text-xs text-[#2ECC71] font-normal leading-4 flex items-center">
                <BsArrowUp />
                Today's completed sales
              </p>
            </div>
          </CardContent>
        </Card>
        {/* Average Transaction Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-normal text-[#7D7D7D]">
              Avg. Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <div className="text-2xl font-bold text-gray-900">
                ₦{metrics.averageTransaction.toLocaleString()}
              </div>
              <p className="text-xs text-[#F95353] flex items-center">
                {" "}
                <BsArrowUp />
                %5 from last week
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* top selling sales and category chart */}
      <div className="lg:grid lg:grid-cols-5 gap-2 mb-4">
        {/* Top products Section */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-[20px] font-medium text-[#1E1E1E]">
                Top-selling products
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Headers - Desktop Only */}
              <div className=" border-b border-gray-200 pb-3 grid grid-cols-4 ">
                <div>
                  <h4 className=" xl:text-base lg:text-sm md:text-xs font-normal tracking-wide text-[#1E1E1E]">
                    Product
                  </h4>
                </div>
                <div>
                  <h4 className=" xl:text-base lg:text-sm md:text-xs font-normal tracking-wide text-[#1E1E1E]">
                    Units Sold
                  </h4>
                </div>
                <div>
                  <h4 className=" xl:text-base lg:text-sm md:text-xs font-normal tracking-wide text-[#1E1E1E]">
                    Revenue Generated
                  </h4>
                </div>
                <div>
                  <h4 className=" xl:text-base lg:text-sm md:text-xs font-normal tracking-wide text-[#1E1E1E]">
                    Category
                  </h4>
                </div>
              </div>
              {topProduct && topProduct.length > 0 ? (
                <div className="space-y-0 divide-y divide-gray-200 md:divide-y-0 md:divide-x-4">
                  <>
                    {topProduct.map((product) => (
                      <div
                        key={product.prodName}
                        className={`border-b-2 border-gray-100 last:border-b-0 md:border-b-0 `}
                      >
                        {/* Desktop layout */}
                        <div className="hidden py-3 md:grid md:grid-cols-4 first:pl-0">
                          <div>
                            <h4 className="text-sm font-normal text-[#444444]  ">
                              {product.prodName}
                            </h4>
                          </div>
                          <div className="">
                            <p className="text-sm text-[#444444] font-normal">
                              {product.soldUnit} bags
                            </p>
                          </div>
                          <div className="flex items-center ">
                            <p className="text-sm text-[#444444] font-normal">
                              {product.revenue.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-[#444444] font-normal">
                              {product.category}
                            </p>
                          </div>
                        </div>

                        {/* mobile layout */}
                        <div className="space-y-3 py-4 md:hidden">
                          <div className="grid">
                            <div className="grid-cols-4 grid">
                              <div>
                                <p className="text-sm font-medium text-gray-700">
                                  {product.prodName}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">
                                  {product.soldUnit} bags
                                </p>
                              </div>
                              {/*  */}
                              <div>
                                <p className="text-sm text-gray-600">
                                  {product.revenue.toLocaleString()}
                                </p>
                              </div>
                              {/*  */}
                              <div>
                                <p className="text-sm text-gray-600">
                                  {product.category}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/*  */}
                      </div>
                    ))}
                  </>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No product data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2">
          <SalesCategoryChart data={salesByCategory} />
        </div>
      </div>
      {/*  */}
    </div>
  );
};

export default SalesAnalytics;
