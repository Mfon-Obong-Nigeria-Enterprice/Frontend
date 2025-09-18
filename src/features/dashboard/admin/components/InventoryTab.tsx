/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import ProductDisplayTab from "./ProductDisplayTab";
import CategoryModal from "./CategoryModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info } from "lucide-react";
import type { Product, Category } from "@/types/types";
import { useInventoryStore } from "@/stores/useInventoryStore";

interface InventoryTabProps {
  products: Product[];
  categories: Category[];
  stockStatus: string;
  priceRange: string;
}

const InventoryTab = React.memo(
  ({ products = [], categories = [], stockStatus, priceRange }: InventoryTabProps) => {
    const [openCategory, setOpenCategory] = useState<{
      _id: string;
      name: string;
      count: number;
      description?: string;
    } | null>(null);

    // Only get searchQuery from store
    const { searchQuery } = useInventoryStore();

    // ✅ Helper to get safe category name
    const getCategoryNameForProduct = (
      categoryId: string | { _id: string; name: string; units: string[] }
    ): string => {
      if (typeof categoryId === "object" && categoryId.name) {
        return categoryId.name;
      }
      const id = typeof categoryId === "string" ? categoryId : categoryId._id;
      const foundCategory = categories.find((c) => c._id === id);
      return foundCategory?.name || "Uncategorized";
    };

    // ✅ Stock filter
    function filterByStockStatus(product: Product) {
      if (stockStatus === "all") return true;
      if (stockStatus === "high") return product.stock > 20;
      if (stockStatus === "low") return product.stock > 0 && product.stock <= 20;
      if (stockStatus === "out") return product.stock === 0;
      return true;
    }

    // ✅ Price filter
    function filterByPriceRange(product: Product) {
      if (priceRange === "all") return true;
      const price = product.unitPrice;
      if (priceRange === "under-1000") return price < 1000;
      if (priceRange === "1000-5000") return price >= 1000 && price <= 5000;
      if (priceRange === "5000-10000") return price > 5000 && price <= 10000;
      if (priceRange === "10000-50000") return price > 10000 && price <= 50000;
      if (priceRange === "above-50000") return price > 50000;
      return true;
    }

    // ✅ Filter products for All Products tab
    const filteredProducts = useMemo(
      () =>
        products.filter((product) => {
          const productCategoryName = getCategoryNameForProduct(product.categoryId);
          return (
            (product.name.toLowerCase().includes(searchQuery) ||
              productCategoryName.toLowerCase().includes(searchQuery)) &&
            filterByStockStatus(product) &&
            filterByPriceRange(product)
          );
        }),
      [products, searchQuery, stockStatus, priceRange, categories]
    );

    // ✅ Filter products by category
    function filterCategoryProducts(categoryName: string) {
      return products.filter((prod) => {
        const productCategoryName = getCategoryNameForProduct(prod.categoryId);
        return (
          productCategoryName === categoryName &&
          (prod.name.toLowerCase().includes(searchQuery) ||
            productCategoryName.toLowerCase().includes(searchQuery)) &&
          filterByStockStatus(prod) &&
          filterByPriceRange(prod)
        );
      });
    }

    return (
      <div className="px-5 min-h-30">
        <Tabs defaultValue="allProducts">
          {/* Tabs Header */}
          <div className="flex w-full overflow-x-auto">
            <TabsList className="bg-[#F5F5F5] gap-3 overflow-x-auto whitespace-nowrap h-16 hide-scrollbar lg:max-w-[65vw] 2xl:max-w-full">
              {/* All Products tab */}
              <TabsTrigger
                value="allProducts"
                className={cn(
                  "!bg-white px-3 data-[state=active]:[&_span]:bg-green-400 data-[state=active]:[&_span]:text-white data-[state=active]:shadow-xl text-sm"
                )}
              >
                <p>
                  All Products
                  <span className="ml-1 rounded-2xl text-[#7d7d7d] bg-gray-300 py-1 px-2">
                    {products.length}
                  </span>
                </p>
              </TabsTrigger>

              {/* Category tabs */}
              {categories?.map((category) => {
                const categoryName = category.name;
                const count = products.filter((prod) => {
                  const productCategoryName = getCategoryNameForProduct(prod.categoryId);
                  return productCategoryName === categoryName;
                }).length;

                return (
                  <TabsTrigger
                    key={category._id}
                    value={categoryName}
                    className={cn(
                      "!bg-white px-3 border border-gray-200 data-[state=active]:shadow-xl data-[state=active]:[&_span]:bg-green-400 data-[state=active]:[&_span]:text-white hover:border-dashed hover:border-green-400 data-[state=active]:border-green-400 text-sm"
                    )}
                  >
                    {category.name}
                    <span className="mx-0.5 bg-gray-300 rounded-2xl text-[0.625rem] text-[#7d7d7d] py-1 px-2">
                      {count}
                    </span>
                    <p
                      onClick={(e) => {
                        e.stopPropagation(); // prevent switching tab
                        setOpenCategory({
                          _id: category._id,
                          name: category.name,
                          count,
                          description: category.description,
                        });
                      }}
                      className="ml-1"
                    >
                      <Info className="text-[#D9D9D9] h-4 w-4" />
                    </p>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          {/* All Products content */}
          <TabsContent value="allProducts">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8 pb-5">
              {filteredProducts?.map((prod) => (
                <ProductDisplayTab key={prod._id} product={prod} />
              ))}
            </div>
          </TabsContent>

          {/* Category-specific content */}
          {categories?.map((category) => {
            const categoryName = category.name;
            const productInCategory = filterCategoryProducts(categoryName);

            return (
              <TabsContent key={category._id} value={categoryName}>
                {productInCategory.length === 0 ? (
                  <div className="flex justify-center items-center text-sm p-5 text-gray-500 italic">
                    No product in this category.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8 pb-5">
                    {productInCategory.map((prod) => (
                      <ProductDisplayTab key={prod._id} product={prod} />
                    ))}
                  </div>
                )}
              </TabsContent>
            );
          })}
        </Tabs>

        {/* Category Info Modal */}
        {openCategory && (
          <CategoryModal
            setOpenModal={() => setOpenCategory(null)}
            categoryId={openCategory._id}
            categoryName={openCategory.name}
            description={openCategory.description}
            productCount={openCategory.count}
          />
        )}
      </div>
    );
  }
);

export default InventoryTab;
