import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SalesCategoryChart from "./SalesCategoryChart";

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

const salesByCategory = [
  { name: "Building Materials", value: 45 },
  { name: "Construction services", value: 32 },
  { name: "Equipment rental", value: 23 },
];

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
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total sales(Today)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              ₦{metrics.totalSales.toLocaleString()}
            </div>
            <p className="text-xs text-green-600">+15% from yesterday</p>
          </CardContent>
        </Card>
        {/*  */}
        <Card>
          <CardHeader className="flex fle-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-gray-500">
              Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {metrics.transactionCount}
            </div>
            <p className="text-xs text-green-600">Today's completed sales</p>
          </CardContent>
        </Card>
        {/*  */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-gray-500">
              Active clients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {metrics.activeClients}
            </div>
            <p className="text-xs text-green-600">Today's completed sales</p>
          </CardContent>
        </Card>
        {/* Average Transaction Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Average Transaction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              ₦{metrics.averageTransaction.toLocaleString() || 0}
            </div>
            <p className="text-xs text-gray-600">Per transaction value</p>
          </CardContent>
        </Card>
      </div>

      {/* top selling sales and category chart */}
      <div className="lg:grid lg:grid-cols-5 gap-2 mb-4">
        {/* Top products Section */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Top-selling products
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Headers - Desktop Only */}
              <div className=" gap-4 border-b border-gray-200 pb-3 grid grid-cols-4 ">
                <div>
                  <h4 className="text-xs font-medium tracking-wide text-gray-500">
                    Product
                  </h4>
                </div>
                <div>
                  <h4 className="text-xs font-medium tracking-wide text-gray-500">
                    Units Sold
                  </h4>
                </div>
                <div>
                  <h4 className="text-xs font-medium tracking-wide text-gray-500">
                    Revenue Generated
                  </h4>
                </div>
                <div>
                  <h4 className="text-xs font-medium tracking-wide text-gray-500">
                    Category
                  </h4>
                </div>
              </div>
              {topProduct && topProduct.length > 0 ? (
                <div className="space-y-0 ">
                  <>
                    {topProduct.map((product) => (
                      <div
                        key={product.prodName}
                        className={`border-b-2 border-gray-100 last:border-b-0 md:border-b-0 $`}
                      >
                        {/* Desktop layout */}
                        <div className="hidden gap-4 py-3 md:grid md:grid-cols-4 px-4 first:pl-0">
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 flex items-center ">
                              {product.prodName}
                            </h4>
                          </div>
                          <div className="flex items-center">
                            <p className="text-xs text-gray-500">
                              {product.soldUnit} bags
                            </p>
                          </div>
                          <div className="flex items-center ">
                            <p className="text-lg text-gray-500">
                              {product.revenue.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">
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
