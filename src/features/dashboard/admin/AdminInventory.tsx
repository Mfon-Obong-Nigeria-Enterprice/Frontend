/** @format */

// @/pages/AdminInventory.tsx
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";

import DashboardTitle from "../../../components/dashboard/DashboardTitle";
import InventoryTab from "./components/InventoryTab";
import Modal from "@/components/Modal";
import AddCategory from "@/components/inventory/AddCategory";

import { useInventoryStore } from "@/stores/useInventoryStore";

import { IoIosArrowUp, IoIosSearch } from "react-icons/io";
import { CiImport } from "react-icons/ci";
import { Plus, ChevronRight, RotateCcw } from "lucide-react";

import type { Product } from "@/types/types";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import UpdateStock from "./components/UpdateStock"; // Ensure this import path is correct

const AdminInventory = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState({ xPercent: 80, yPercent: 80 });
  const [dragging, setDragging] = useState(false);
  const [rel, setRel] = useState({ x: 0, y: 0 });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addCategoryModalOpen, setAddCategoryModalOpen] = useState(false);
  const [stockStatus, setStockStatus] = useState("all");
  const [priceRange, setPriceRange] = useState("all");

  // set the search query from zustand store

  const { products, categories, searchQuery, setSearchQuery, updateProducts } =
    useInventoryStore();

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearchQuery(value);
  }, 300);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const getCategoryName = (product: Product): string => {
    if (!product.categoryId) return "Uncategorized";
    if (typeof product.categoryId === "object") {
      return product.categoryId.name;
    }
    const category = categories.find((c) => c._id === product.categoryId);
    return category?.name || "Uncategorized";
  };

  const productsForUpdateStock: Product[] = useMemo(() => {
    return products;
  }, [products]);

  //
  const handleSave = (updatedProducts: Product[]) => {
    console.log(
      "AdminInventory: Saving updated products to store:",
      updatedProducts
    );
    updateProducts(updatedProducts); // This now correctly calls the bulk update action
    setIsModalOpen(false);
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

  // Filtering logic for stock status
  function filterByStockStatus(product: Product) {
    if (stockStatus === "all") return true;
    if (stockStatus === "high") return product.stock >= product.minStockLevel;
    if (stockStatus === "low")
      return product.stock > 0 && product.stock < product.minStockLevel;
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

  // to close both modals
  const closeBothModals = () => {
    setIsAddModalOpen(false);
    setAddCategoryModalOpen(false);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    setDragging(true);
    const button = e.currentTarget.getBoundingClientRect();
    setRel({ x: e.clientX - button.left, y: e.clientY - button.top });
  };

  const handleMouseUp = () => setDragging(false);

  const handleExportExcel = () => {
    const data = filteredProducts.map((prod) => ({
      Name: prod.name,
      Category:
        typeof prod.categoryId === "object"
          ? prod.categoryId.name
          : prod.categoryId,
      Unit: prod.unit,
      Stock: prod.stock,
      "Unit Price": prod.unitPrice,
      "Min Stock Level": prod.minStockLevel,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory");
    XLSX.writeFile(workbook, "inventory_export.xlsx");
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();

    const columns = [
      { header: "Product Name", dataKey: "name" },
      { header: "Category", dataKey: "category" },
      { header: "Unit", dataKey: "unit" },
      { header: "Stock", dataKey: "stock" },
      { header: "Unit Price", dataKey: "unitPrice" },
      { header: "Min Stock Level", dataKey: "minStockLevel" },
    ];

    const rows = filteredProducts.map((prod) => ({
      name: prod.name,
      category:
        typeof prod.categoryId === "object"
          ? prod.categoryId.name
          : prod.categoryId,
      unit: prod.unit,
      stock: prod.stock,
      unitPrice: prod.unitPrice,
      minStockLevel: prod.minStockLevel,
    }));

    doc.text("Inventory Export", 14, 16);
    autoTable(doc, {
      startY: 22,
      columns,
      body: rows,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [44, 204, 113] },
    });
    doc.save("inventory_export.pdf");
  };

  // sets initial position of the button
  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = rect.left + rect.width - 80;
      const y = rect.top + rect.height - 80;
      const xPercent = (x / window.innerWidth) * 100;
      const yPercent = (y / window.innerHeight) * 100;
      setPosition({ xPercent, yPercent });
    }
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragging) return;
      const newX = e.clientX - rel.x;
      const newY = e.clientY - rel.y;
      const xPercent = (newX / window.innerWidth) * 100;
      const yPercent = (newY / window.innerHeight) * 100;
      setPosition({
        xPercent: Math.min(98, Math.max(2, xPercent)),
        yPercent: Math.min(98, Math.max(2, yPercent)),
      });
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, rel]);

  return (
    <main>
      <DashboardTitle
        heading="Inventory Management"
        description="Manage your products and categories"
      />
      <section className="bg-white xl:rounded-xl mt-5">
        <div className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center py-5 px-4 sm:px-5 bg-[#f0f0f3] border-b border-[#d9d9d9] md:border-0">
          <h3 className="text-xl font-medium text-text-dark">
            Product & Categories
          </h3>
          <div className="flex gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <button className="w-40 bg-white text-[#333333] flex gap-1.5 items-center justify-center rounded-md py-2 px-4 border border-[#7d7d7d]">
                  <IoIosArrowUp size={24} />
                  <span>Export</span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="p-0 w-48">
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={handleExportPDF}
                >
                  Export as PDF
                </button>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={handleExportExcel}
                >
                  Export as Excel
                </button>
              </PopoverContent>
            </Popover>
            <div>
              <button
                onClick={handleOpenModal}
                className="w-40 bg-white text-[#333333] flex gap-1.5 items-center rounded-md py-2 px-4 border border-[#7d7d7d]"
              >
                <RotateCcw size={24} />
                Update Stock
              </button>
            </div>
            <button
              onClick={() => navigate("/import-stock")}
              className="w-40 bg-white text-[#333333] flex gap-1.5 items-center rounded-md py-2 px-4 border border-[#7d7d7d]"
            >
              <CiImport size={24} />
              <span>Import Stock</span>
            </button>
          </div>
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

          <div className="flex items-center gap-4">
            <Select value={stockStatus} onValueChange={setStockStatus}>
              <SelectTrigger className="w-40 bg-[#D9D9D9] text-[#444444] border border-[#7d7d7d]">
                <SelectValue placeholder="Stock status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All products</SelectItem>
                <SelectItem value="high">High stock</SelectItem>
                <SelectItem value="low">Low stock</SelectItem>
                <SelectItem value="out">Out of stock</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="max-w-40 w-full bg-[#D9D9D9] text-[#444444] border border-[#7d7d7d]">
                <SelectValue placeholder="Price range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All prices</SelectItem>
                <SelectItem value="under-1000">Under ₦1,000</SelectItem>
                <SelectItem value="1000-5000">₦1,000-₦5,000</SelectItem>
                <SelectItem value="5000-10000">₦5,000-₦10,000</SelectItem>
                <SelectItem value="10000-50000">₦10,000-₦50,000</SelectItem>
                <SelectItem value="above-50000">Above ₦50,000</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="my-5" ref={containerRef}>
          <InventoryTab
            products={filteredProducts}
            categories={categories}
            stockStatus={stockStatus}
            priceRange={priceRange}
          />

          {/* draggable button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            onMouseDown={handleMouseDown}
            className="fixed z-50 flex justify-center items-center bg-[#2ECC71] hover:bg-[#2cCC79] w-16 h-16 rounded-full text-white shadow-2xl cursor-move"
            style={{
              left: `${position.xPercent}vw`,
              top: `${position.yPercent}vh`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <Plus className="h-8 w-8" />
          </button>
        </div>

        <UpdateStock
          products={productsForUpdateStock}
          categories={categories} // Now passing categories to UpdateStock
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSave}
        />

        <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
          <h6 className="text-lg font-medium text-[#333333] ml-5 mb-3">
            What would you like to add?
          </h6>
          <div className="flex flex-col gap-4 px-7 pt-4 pb-6 border-t border-[#d9d9d9]">
            <Link
              to="/add-product"
              className="flex justify-between items-center border py-3 px-6 rounded-[0.625rem] hover:shadow-2xl transition-all duration-100 ease-in-out"
              onClick={() => setIsAddModalOpen(false)}
            >
              <div>
                <p className="text-[#333333] text-sm">Add Product</p>
                <p className="text-[#7D7D7D] text-[0.625rem]">
                  Add a new product to your inventory
                </p>
              </div>
              <ChevronRight size={18} />
            </Link>
            <div
              onClick={() => {
                setIsAddModalOpen(false);
                setAddCategoryModalOpen(true);
              }}
              className="flex justify-between items-center border py-3 px-6 rounded-[0.625rem] hover:shadow-2xl transition-all duration-100 ease-in-out cursor-pointer"
            >
              <div>
                <p className="text-[#333333] text-sm">Add Category</p>
                <p className="text-[#7D7D7D] text-[0.625rem]">
                  Create a new product category
                </p>
              </div>
              <ChevronRight size={18} />
            </div>
          </div>
        </Modal>

        <Modal
          isOpen={addCategoryModalOpen}
          onClose={() => setAddCategoryModalOpen(false)}
          size="xxl"
        >
          <AddCategory closeBothModals={closeBothModals} />
        </Modal>
      </section>
    </main>
  );
};

export default AdminInventory;
