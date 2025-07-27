import { create } from "zustand";
import {
  type Product,
  type InventoryState,
  type Category,
} from "@/types/types";

type InventoryStoreState = InventoryState & {
  isCategoriesLoaded: boolean;
  isProductsLoaded: boolean;
};

type InventoryActions = {
  setProducts: (products: Product[]) => void;
  setCategories: (categories: Category[]) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategoryId: (id: string) => void;
  setProductsLoaded: (loaded: boolean) => void; // Added
  setCategoriesLoaded: (loaded: boolean) => void; // Added
  updateProduct: (updated: Product) => void;
  updateProductsBulk: (updatedProducts: Product[]) => void; // Renamed for clarity
  addProduct: (product: Product) => void;
  addCategory: (category: Category) => void;
  removeProduct: (productId: string) => void; // Added
};

export const useInventoryStore = create<InventoryStoreState & InventoryActions>(
  (set) => ({
    products: [], // Initialized as empty
    categories: [], // Initialized as empty
    searchQuery: "",
    selectedCategoryId: "",
    categoryUnits: [],
    isCategoriesLoaded: false, // Added
    isProductsLoaded: false, // Added

    setProducts: (products) => {
      set({ products, isProductsLoaded: true }); // Set loaded flag
    },
    setCategories: (categories) => {
      set({ categories, isCategoriesLoaded: true }); // Set loaded flag
    },
    setSearchQuery: (query) => set({ searchQuery: query }),
    setProductsLoaded: (loaded) => set({ isProductsLoaded: loaded }), // Added
    setCategoriesLoaded: (loaded) => set({ isCategoriesLoaded: loaded }), // Added

    setSelectedCategoryId: (id) =>
      set((state) => {
        const category = state.categories.find((c) => c._id === id);
        return {
          selectedCategoryId: id,
          categoryUnits: category?.units || [],
        };
      }),

    updateProduct: (updated) =>
      set((state) => ({
        products: state.products.map((p) =>
          p._id === updated._id ? updated : p
        ),
      })),

    updateProductsBulk: (updatedProducts) =>
      set((state) => {
        // Renamed from updateProducts
        const updatedMap = new Map(updatedProducts.map((p) => [p._id, p]));
        return {
          products: state.products.map((p) => {
            const updated = updatedMap.get(p._id);
            if (updated) {
              // Only update the stock (and any other relevant fields if needed)
              return { ...p, stock: updated.stock };
            }
            return p;
          }),
        };
      }),

    addProduct: (product) =>
      set((state) => ({
        products: [...state.products, product],
      })),

    addCategory: (category) =>
      set((state) => ({
        categories: [...state.categories, category],
      })),

    removeProduct: (productId) =>
      set((state) => ({
        // Added
        products: state.products.filter((p) => p._id !== productId),
      })),
  })
);
