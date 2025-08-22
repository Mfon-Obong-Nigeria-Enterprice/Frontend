/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from "zustand";
import { updateProductPrice } from "@/lib/api";
import type { Product } from "@/types/types";

// Interface for the Zustand store's state
interface PriceUpdateState {
  products: Product[];
  editingPrices: { [key: string]: number };
  loadingProductId: string | null;
  
  initializeProducts: (initialProducts: Product[]) => void;
  onPriceChange: (id: string, value: number) => void;
  onUpdate: (productId: string, newPrice: number) => Promise<void>;
  onReset: (productId: string) => void;
}



// The Zustand store
export const usePriceStore = create<PriceUpdateState>((set, _get) => ({
  products: [],
  editingPrices: {},
  loadingProductId: null,

  initializeProducts: (initialProducts) => {
    set({ products: initialProducts });
  },

  onPriceChange: (id, value) => {
    set((state) => ({
      editingPrices: {
        ...state.editingPrices,
        [id]: value
      }
    }));
  },

  onUpdate: async (productId, newPrice) => {
    set({ loadingProductId: productId });

    try {
      await updateProductPrice({ productId, newPrice });

      set(state => {
        const newEditingPrices = { ...state.editingPrices };
        delete newEditingPrices[productId];
        return {
          editingPrices: newEditingPrices,
          loadingProductId: null
        };
      });

      set(state => ({
        products: state.products.map(p => 
          p._id === productId ? { ...p, unitPrice: newPrice } : p
        )
      }));

    } catch (error) {
      console.error('Failed to update price:', error);
      set({ loadingProductId: null });
    }
  },

  onReset: (productId) => {
    set(state => {
      const newEditingPrices = { ...state.editingPrices };
      delete newEditingPrices[productId];
      return { editingPrices: newEditingPrices };
    });
  },
}));