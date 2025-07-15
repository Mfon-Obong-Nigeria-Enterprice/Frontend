import { create } from "zustand";
import { type Product, type Category } from "@/types/types";

type InventoryState = {
  products: Product[];
  categories: Category[];
  filteredProducts: Product[];
  selectedCategoryId: string;
  categoryUnits: string[];
  setSelectedCategoryId: (id: string) => void;
  setCategoryUnits: (units: string[]) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setProducts: (products: Product[]) => void;
  updateProduct: (updated: Product) => void;
  setCategories: (categories: Category[]) => void;
};

export const useInventoryStore = create<InventoryState>((set) => ({
  products: [],
  categories: [],
  filteredProducts: [],
  selectedCategoryId: "",
  categoryUnits: [],
  setSelectedCategoryId: (id) =>
    set((state) => {
      const selected = state.categories.find((cat) => cat._id === id);
      return {
        selectedCategoryId: id,
        categoryUnits: selected?.units || [],
      };
    }),

  setCategoryUnits: (units) => set({ categoryUnits: units }),
  searchQuery: "",
  setSearchQuery: (query) =>
    set((state) => {
      const filtered = query
        ? state.products.filter(
            (product) =>
              product.name
                .toLocaleLowerCase()
                .includes(query.toLocaleLowerCase()) ||
              product.categoryId?.name
                .toLocaleLowerCase()
                .includes(query.toLocaleLowerCase())
          )
        : state.products;

      return {
        searchQuery: query,
        filteredProducts: filtered,
      };
    }),

  setProducts: (products) => set({ products }),
  updateProduct: (updated: Product) =>
    set((state) => ({
      products: state.products.map((p) =>
        p._id === updated._id ? updated : p
      ),
    })),

  setCategories: (categories) => set({ categories }),
}));
