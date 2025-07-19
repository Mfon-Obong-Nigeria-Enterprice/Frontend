import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SalesCategory from "./SalesCategory";
import { salesData } from "../data/SalesData";

interface Product {
  prodName: string;
  soldUnit: number;
  revenue: number;
  category: string;
}

interface SalesAnalyticProps {
  topProduct?: Product[];
}

const SalesAnalytic: React.FC<SalesAnalyticProps> = ({
  topProduct = [],
}) => {
  return (
    <div>
      <div className="lg:grid lg:grid-cols-5 gap-2 mb-4 py-9">
        
        <div className="lg:col-span-3 h-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Top-selling products
              </CardTitle>
            </CardHeader>

            <CardContent className="p-0">
              
              <div className="grid grid-cols-4 divide-x divide-gray-300 text-sm text-left">
                
                <div> 
                  <div className="px-4 py-3 font-semibold text-gray-500">
                    Product
                  </div>
                  {topProduct.map((product) => (
                    <div key={product.prodName} className="px-4 py-3 text-gray-800">
                      {product.prodName}
                    </div>
                  ))}
                </div>

                <div> 
                  <div className="px-4 py-3 font-semibold text-gray-500">
                    Units Sold
                  </div>
                  {topProduct.map((product) => (
                    <div key={product.prodName} className="px-4 py-3 text-gray-600">
                      {product.soldUnit} {product.prodName === "Cement" ? "bags" : product.prodName === "Rods" ? "Units" : "Boxes"}
                    </div>
                  ))}
                </div>

                
                <div> 
                  <div className="px-4 py-3 font-semibold text-gray-500">
                    Revenue
                  </div>
                  {topProduct.map((product) => (
                    <div key={product.prodName} className="px-4 py-3 text-gray-700">
                      ₦{product.revenue.toLocaleString()}
                    </div>
                  ))}
                </div>

                
                <div> 
                  <div className="px-4 py-3 font-semibold text-gray-500">
                    Category
                  </div>
                  {topProduct.map((product) => (
                    <div key={product.prodName} className="px-4 py-3 text-gray-600">
                      {product.category}
                    </div>
                  ))}
                </div>
              </div>

             
              {topProduct.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No product data available
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <SalesCategory data={salesData} />
        </div>
      </div>
    </div>
  );
};

export default SalesAnalytic;