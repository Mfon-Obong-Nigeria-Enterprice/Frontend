import { create } from "zustand";
import { type CategoryData } from "../types/types";

type CategoryStore = {
  categories: CategoryData[];
  setCategories: (cats: CategoryData[]) => void;
  addCategory: (cat: CategoryData) => void;
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
