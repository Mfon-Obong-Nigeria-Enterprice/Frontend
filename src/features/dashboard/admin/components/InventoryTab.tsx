import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { AiOutlineInfo } from "react-icons/ai";
import ProductDisplayTab from "./ProductDisplayTab";
import CategoryModal from "./CategoryModal";

const displayData = [
  {
    value: "cement",
    ProductTitle: "Dangote cement",
    category: "cement",
    stockValue: "200 bags",
    unitPrice: "4,500",
    totalValue: "900000",
    minLevel: "40",
    stock: "high",
  },
  {
    value: "steel rod",
    ProductTitle: "16mm Steel Rod",
    category: "Steel rod",
    stockValue: "150 pcs",
    unitPrice: "8600",
    totalValue: "90000",
    minLevel: "50",
    stock: "high",
  },
  {
    value: "nails",
    ProductTitle: "3-inch Nails",
    category: "Nails",
    stockValue: "5 bags",
    unitPrice: "2,800",
    totalValue: "14,000",
    minLevel: "10",
    stock: "low",
  },
  {
    value: "paints",
    ProductTitle: "Banger Paint White",
    category: "Paints",
    stockValue: "100 buckets",
    unitPrice: "10,500",
    totalValue: "35,000",
    minLevel: "20",
    stock: "high",
  },
  {
    value: "marine board",
    ProductTitle: "10x Marine Board",
    category: "marine board",
    stockValue: "100 buckets",
    unitPrice: "10,500",
    totalValue: "35,000",
    minLevel: "20",
    stock: "low",
  },
];

const InventoryTab: React.FC = () => {
  const [openCategory, setOpenCategory] = useState<{
    name: string;
    count: number;
  } | null>(null);
  useEffect(() => {}, []);

  const categories = [...new Set(displayData.map((item) => item.category))];
  const inventoryTabData = categories.map((category) => ({
    value: category.toLowerCase(),
    label: category,
    count: displayData.filter((item) => item.category === category).length,
  }));

  return (
    <div>
      <Tabs defaultValue="allProducts" className="w-full">
        <TabsList className="bg-[#F5F5F5] gap-6 justify-between">
          <TabsTrigger
            value="allProducts"
            className={cn(
              "!bg-white px-3 data-[state=active]:[&_span]:bg-green-400 data-[state=active]:[&_span]:text-white data-[state=active]:shadow-xl"
            )}
          >
            <p>
              All Products
              <span
                className={cn(
                  "ml-1 rounded-2xl text-[#7d7d7d] bg-gray-300 py-1 px-2"
                )}
              >
                {displayData.length}
              </span>
            </p>
          </TabsTrigger>
          {inventoryTabData.map((data) => (
            <TabsTrigger
              key={data.value}
              value={data.value}
              className={cn(
                "!bg-white px-3 border border-gray-200 data-[state=active]:shadow-xl data-[state=active]:[&_span]:bg-green-400 data-[state=active]:[&_span]:text-white hover:border-dashed hover:border-green-400 data-[state=active]:border-green-400"
              )}
            >
              {data.label}
              <span className="mx-1 bg-gray-300 rounded-2xl text-[0.625rem] text-[#7d7d7d] py-1 px-2">
                {data.count}
              </span>
              <div className="bg-blue-100 text-text-dark p-1 rounded-sm hover:bg-blue-300">
                <div
                  onClick={() =>
                    setOpenCategory({ name: data.label, count: data.count })
                  }
                  className="relative"
                >
                  <AiOutlineInfo size={20} />
                </div>
              </div>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* display data for all products */}
        <div className="grid grid-cols-2 gap-8">
          {displayData.map((prod, index) => (
            <TabsContent key={index} value="allProducts" className="">
              <ProductDisplayTab
                ProductTitle={prod.ProductTitle}
                category={prod.category}
                stockValue={prod.stockValue}
                unitPrice={prod.unitPrice}
                totalValue={prod.totalValue}
                minLevel={prod.minLevel}
                stock={prod.stock}
              />
            </TabsContent>
          ))}

          {/* display data for the tabbed component */}
          {displayData.map((prod, index) => (
            <TabsContent key={index} value={prod.category.toLowerCase()}>
              <ProductDisplayTab
                ProductTitle={prod.ProductTitle}
                category={prod.category}
                stockValue={prod.stockValue}
                unitPrice={prod.unitPrice}
                totalValue={prod.totalValue}
                minLevel={prod.minLevel}
                stock={prod.stock}
              />
            </TabsContent>
          ))}
        </div>
      </Tabs>

      {/* set the open category to the selected category */}
      {openCategory && (
        <CategoryModal
          setOpenModal={() => setOpenCategory(null)}
          categoryName={openCategory.name}
          productCount={openCategory.count}
        />
      )}
    </div>
  );
};

export default InventoryTab;
