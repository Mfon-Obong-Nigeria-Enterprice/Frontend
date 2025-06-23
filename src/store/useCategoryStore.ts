import { create } from "zustand";
import { type AdminSetupCatData } from "../types/types";

type CategoryStore = {
  categories: AdminSetupCatData[];
  setCategories: (cats: AdminSetupCatData[]) => void;
  addCategory: (cat: AdminSetupCatData) => void;
  // removeCategory: (categoryId: string | number) => void;
};

export const useCategoryStore = create<CategoryStore>((set) => ({
  categories: [],
  setCategories: (cats) => set({ categories: cats }),
  addCategory: (cat) =>
    set((state) => ({ categories: [...state.categories, cat] })),
  // removeCategory: (categoryId) =>
  //   set((state) => ({
  //     categories: state.categories.filter((cat) => cat.id !== categoryId),
  //   })),
}));
