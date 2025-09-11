/** @format */
/* eslint-disable react-hooks/exhaustive-deps */
import { useRef, useMemo } from "react";
import { useDebouncedCallback } from "use-debounce";

import DashboardTitle from "../shared/DashboardTitle";
import InventoryTab from "../admin/components/InventoryTab";

import { useInventoryStore } from "@/stores/useInventoryStore";

import { IoIosSearch } from "react-icons/io";

import type { Product } from "@/types/types";

import EmptyInventory from "../shared/EmptyInventory";

const Stock = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // set the search query from zustand store

  const { products, categories, searchQuery, setSearchQuery } =
    useInventoryStore();

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearchQuery(value);
  }, 300);

  const getCategoryName = (product: Product): string => {
    if (!product.categoryId) return "Uncategorized";
    if (typeof product.categoryId === "object") {
      return product.categoryId.name;
    }
    const category = categories.find((c) => c._id === product.categoryId);
    return category?.name || "Uncategorized";
  };

  const suggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return products
      .filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          getCategoryName(product).toLowerCase().includes(query)
      )
      .map((prod) => ({ type: "product" as const, item: prod }));
  }, [searchQuery, products, categories]);

  const handleSuggestionClick = (suggestion: {
    type: "product";
    item: Product;
  }) => {
    const id = suggestion.item._id;
    if (id) {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        setSearchQuery("");
      }
    }
  };

  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        const categoryName =
          typeof product.categoryId === "object"
            ? product.categoryId.name.toLowerCase()
            : "";

        return (
          product.name.toLowerCase().includes(searchQuery) ||
          categoryName.includes(searchQuery)
        );
      }),
    [products, searchQuery]
  );

  return (
    <main>
      <DashboardTitle
        heading="Stock Levels"
        description="View current inventory and availability"
      />
      {products.length > 0 ? (
        <section className="bg-white xl:rounded-xl mt-5  lg:max-w-4xl xl:max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center py-5 px-4 sm:px-5 bg-[#f0f0f3] border-b border-[#d9d9d9] md:border-0">
            <h3 className="text-xl font-medium text-text-dark">
              Product & Categories
            </h3>
          </div>

          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 px-4 md:px-5 py-5 border">
            <div className="relative bg-[#F5F5F5] max-w-lg w-full flex items-center gap-1 md:w-1/2 px-4 rounded-md">
              <IoIosSearch size={18} />
              <input
                type="search"
                placeholder="Search products, categories..."
                onChange={(e) => debouncedSearch(e.target.value)}
                className="py-2 outline-0 w-full"
              />
              {searchQuery.trim() && suggestions.length > 0 && (
                <div className="absolute top-full left-0 w-full bg-white shadow-lg z-10 border border-gray-200 rounded-b-md">
                  {suggestions.map((suggestion, i) => (
                    <div
                      key={i}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                    >
                      {suggestion.item.name}
                      <span className="text-xs text-gray-500 ml-2">
                        ({getCategoryName(suggestion.item)})
                      </span>
                    </div>
                  ))}
                </div>
              )}
              {searchQuery.trim() && suggestions.length === 0 && (
                <div className="absolute top-full left-0 w-full bg-white shadow-lg z-10 p-4 italic text-center text-gray-500 border border-gray-200 rounded-b-md">
                  No matching products found for{" "}
                  <span className="text-gray-700">"{searchQuery}"</span>
                </div>
              )}
            </div>
          </div>

          <div className="my-5" ref={containerRef}>
            <InventoryTab
              products={filteredProducts}
              categories={categories}
              stockStatus={""}
              priceRange={""}
            />
          </div>
        </section>
      ) : (
        <EmptyInventory />
      )}
    </main>
  );
};

export default Stock;

// import React from "react";
// import DashboardTitle from "@/features/dashboard/shared/DashboardTitle";
// import { Button } from "@/components/ui/button";
// import InventoryTab from "../admin/components/InventoryTab";
// import { IoIosSearch } from "react-icons/io";

// const Stock: React.FC = () => {
//   // Filtering logic for stock status
//   function filterByStockStatus(product: Product) {
//     if (stockStatus === "all") return true;
//     if (stockStatus === "high") return product.stock >= product.minStockLevel;
//     if (stockStatus === "low")
//       return product.stock > 0 && product.stock < product.minStockLevel;
//     if (stockStatus === "out") return product.stock === 0;
//     return true;
//   }

//   // Filtering logic for price range
//   function filterByPriceRange(product: Product) {
//     if (priceRange === "all") return true;
//     const price = product.unitPrice;
//     if (priceRange === "under-1000") return price < 1000;
//     if (priceRange === "1000-5000") return price >= 1000 && price <= 5000;
//     if (priceRange === "5000-10000") return price > 5000 && price <= 10000;
//     if (priceRange === "10000-50000") return price > 10000 && price <= 50000;
//     if (priceRange === "above-50000") return price > 50000;
//     return true;
//   }

//   const filteredProducts = useMemo(
//     () =>
//       products.filter((product) => {
//         const categoryName =
//           typeof product.categoryId === "object"
//             ? product.categoryId.name.toLowerCase()
//             : "";

//         return (
//           (product.name.toLowerCase().includes(searchQuery) ||
//             categoryName.includes(searchQuery)) &&
//           filterByStockStatus(product) &&
//           filterByPriceRange(product)
//         );
//       }),
//     [products, searchQuery, stockStatus, priceRange]
//   );

//   return (
//     <main>
//       <div className="flex justify-between items-end">
//         <DashboardTitle
//           heading="Stock levels"
//           description="View current inventory and availability "
//         />
//         <Button className="bg-white hover:bg-[#f5f5f5] text-[#333333] border border-[var(--cl-secondary)] font-Inter font-medium transition-colors duration-200 ease-in-out">
//           Refresh
//         </Button>
//       </div>

//       <section className="bg-white rounded-xl mt-5 overflow-hidden">
//         {/* search */}
//         <div className="flex justify-between items-center px-4 py-5 border">
//           <div className="bg-[#F5F5F5] flex items-center gap-1 w-1/2 px-4 rounded-md">
//             <IoIosSearch size={18} />
//             <input
//               type="search"
//               placeholder="Search products, categories..."
//               className="py-2 outline-0 w-full"
//             />
//           </div>
//         </div>

//         {/* tabbed section */}
//         <div className="my-5 px-4">
//           <InventoryTab
//             products={filteredProducts}
//             categories={categories}
//             stockStatus={stockStatus}
//             priceRange={priceRange}
//           />
//         </div>
//       </section>
//     </main>
//   );
// };

// export default Stock;
