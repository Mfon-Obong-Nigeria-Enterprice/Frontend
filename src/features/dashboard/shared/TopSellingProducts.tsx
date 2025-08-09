import useTransactionWithCategories from "@/hooks/useTransactionWithCategories";
// import { useTransactionsStore } from "@/stores/useTransactionStore";
// import { getTopSellingProducts } from "@/utils/transactions";

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

const TopSellingProducts: React.FC<SalesAnalyticsProps> = () => {
  // const { transactions } = useTransactionsStore();
  const allItems = useTransactionWithCategories();
  // const topProducts = getTopSellingProducts(transactions || [], 5);
  const lastFive = allItems
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  console.log(allItems);

  return (
    <div className="bg-white p-7 border border-[#d9d9d9] rounded-md">
      <h4 className="text-xl font-medium text-[#1E1E1E] mb-4">
        Top-selling products
      </h4>
      <table className="w-full">
        <thead className="border-b md:border-0 border-[#d9d9d9]">
          <tr>
            <th className="text-xs md:text-sm text-[#333333] font-medium md:font-normal pb-2 text-left">
              Product
            </th>
            <th className="text-xs md:text-sm text-[#333333] font-medium md:font-normal pb-2 text-center">
              Units Sold
            </th>
            <th className="flex items-center justify-center gap-1 text-xs md:text-sm text-[#333333] font-medium md:font-normal px-2 pb-2 text-center">
              Revenue
              <span className="hidden md:block">Generated</span>
            </th>
            <th className="text-xs md:text-sm text-[#333333] font-medium md:font-normal pb-2 text-center">
              Category
            </th>
          </tr>
        </thead>
        <tbody>
          {lastFive.length > 0 ? (
            lastFive.map((product, index) => (
              <tr
                key={index}
                className="border-b md:border-b-0 last:border-0 border-[#d9d9d9]"
              >
                <td className="text-xs md:text-sm text-[#333333] font-normal p-2 text-left md:border-r md:border-[#d9d9d9]">
                  {product.productName}
                </td>
                <td className="text-xs md:text-sm text-[#333333] font-normal p-2 text-left md:border-r md:border-[#d9d9d9]">
                  {product.quantity} {product.unit}
                </td>
                <td className="text-xs md:text-sm text-[#333333] font-normal p-2 text-center md:border-r md:border-[#d9d9d9]">
                  ₦{(product.subtotal ?? 0).toLocaleString()}
                </td>
                <td className="text-xs md:text-sm text-[#333333] font-normal p-2 text-center">
                  {product.category.name}
                </td>
              </tr>
            ))
          ) : (
            <tr className="text-center py-8 text-gray-500">
              <td>No product data available</td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="lg:col-span-2">
        {/* <SalesCategoryChart data={salesByCategory} /> */}
      </div>
    </div>
  );
};

export default TopSellingProducts;
