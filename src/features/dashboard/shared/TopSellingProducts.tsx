import useTransactionWithCategories from "@/hooks/useTransactionWithCategories";
import { isCategoryObject } from "@/utils/helpers";
import { Package, TrendingUp } from "lucide-react";

// Empty State Component
function EmptyProductsState() {
  return (
    <div className="w-full py-12 px-4 text-center">
      <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4 mx-auto">
        <Package className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        No Product Sales Yet
      </h3>
      <p className="text-sm text-gray-500 max-w-sm mx-auto mb-4">
        Start selling products to see your top-performing items appear here.
        This will help you track your best sellers.
      </p>
      <div className="flex items-center justify-center text-xs text-gray-400">
        <TrendingUp className="w-4 h-4 mr-1" />
        <span>Product performance will be tracked automatically</span>
      </div>
    </div>
  );
}

const TopSellingProducts = () => {
  const allItems = useTransactionWithCategories();
  const lastFive = allItems
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  const hasProducts = lastFive.length > 0;

  return (
    <div className="bg-white p-7 border border-[#d9d9d9] rounded-md">
      <h4 className="text-xl font-medium text-[#1E1E1E] mb-4">
        Top-selling products
      </h4>

      {!hasProducts ? (
        <EmptyProductsState />
      ) : (
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
            {lastFive.map((product, index) => (
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
                  {isCategoryObject(product.category)
                    ? product.category.name
                    : product.category}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TopSellingProducts;
