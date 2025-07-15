/** @format */

import React, { useState, useMemo } from "react";

import { cn } from "@/lib/utils";
import ProductDisplayTab from "./ProductDisplayTab";
import CategoryModal from "./CategoryModal";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info } from "lucide-react";
import { useInventoryStore } from "@/stores/useInventoryStore";
import type { Product } from "@/types/types";

interface InventoryTabProps {
  stockStatus: string;
  priceRange: string;
}

const InventoryTab = React.memo(
  ({ stockStatus, priceRange }: InventoryTabProps) => {
    const [openCategory, setOpenCategory] = useState<{
      name: string;
      count: number;
      description?: string;
    } | null>(null);

    const { products, categories, searchQuery } = useInventoryStore();

    // Filtering logic for stock status
    function filterByStockStatus(product: Product) {
      if (stockStatus === "all") return true;
      if (stockStatus === "high") return product.stock > 20;
      if (stockStatus === "low")
        return product.stock > 0 && product.stock <= 20;
      if (stockStatus === "out") return product.stock === 0;
      return true;
    }

    // Filtering logic for price range
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

    const filteredProducts = useMemo(
      () =>
        products.filter(
          (product) =>
            (product.name.toLowerCase().includes(searchQuery) ||
              product.categoryId?.name?.toLowerCase().includes(searchQuery)) &&
            filterByStockStatus(product) &&
            filterByPriceRange(product)
        ),
      [products, searchQuery, stockStatus, priceRange]
    );

    // Helper for category tab filtering
    function filterCategoryProducts(categoryName: string) {
      return products.filter(
        (prod) =>
          prod.categoryId.name === categoryName &&
          (prod.name.toLowerCase().includes(searchQuery) ||
            prod.categoryId?.name?.toLowerCase().includes(searchQuery)) &&
          filterByStockStatus(prod) &&
          filterByPriceRange(prod)
      );
    }

    console.log("Stock Status:", stockStatus, "Price Range:", priceRange);

    return (
      <div className="px-5 min-h-30">
        <Tabs defaultValue="allProducts">
          <div className="w-full max-w-[970px]">
            <TabsList className="w-full bg-[#F5F5F5] gap-3 overflow-x-auto whitespace-nowrap h-16">
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
              {/* display data for categories */}
              {categories?.map((category) => {
                // const categoryName = category.name.toLowerCase();
                const categoryName = category.name;
                console.log(categoryName);
                const count = products.filter((prod) => {
                  if (
                    typeof prod.categoryId === "object" &&
                    prod.categoryId?.name
                  ) {
                    console.log(prod.categoryId);
                    return prod.categoryId.name === categoryName;
                  }
                }).length;
                return (
                  <TabsTrigger
                    key={category.name}
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
                      onClick={() =>
                        setOpenCategory({
                          name: category.name,
                          count,
                          description: category.description,
                        })
                      }
                    >
                      <Info className="text-[#D9D9D9]" />
                    </p>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>
          {/* All Products Tab */}
          <TabsContent value="allProducts">
            <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8 pb-5">
              {filteredProducts.map((prod) => (
                <ProductDisplayTab key={prod._id} product={prod} />
              ))}
            </div>
          </TabsContent>
          {/* Individual Category Tabs */}
          {categories?.map((category) => {
            const categoryName = category.name;
            // const categoryName = category.name.toLowerCase();
            const productInCategory = filterCategoryProducts(categoryName);

            return (
              <TabsContent key={categoryName} value={categoryName}>
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

        {/* when the info button is clicked, the modal opens */}
        {openCategory && (
          <CategoryModal
            setOpenModal={() => setOpenCategory(null)}
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
