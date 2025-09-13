// @/services/productService.ts
import api from "./baseApi";
import type { Product, NewProduct } from "@/types/types";
import { useAuthStore } from "@/stores/useAuthStore";

export const getAllProducts = async (): Promise<Product[]> => {
  const response = await api.get("/products");
  return response.data;
};

export const getAllProductsByBranch = async (
  branchId?: string
): Promise<Product[]> => {
  const url = branchId ? `/products/branch/${branchId}` : `/products/branch/`; // Let interceptor handle this
  const response = await api.get(url);
  return response.data;
};

export const createProduct = async (product: NewProduct) => {
  const branchId = useAuthStore.getState().user?.branchId;
  if (!branchId) {
    throw new Error("Branch ID is required to create a product");
  }
  const response = await api.post("/products", { ...product, branchId });
  return response.data;
};

export const updateProduct = async (
  id: string,
  updatedData: Partial<NewProduct>
) => {
  const response = await api.patch(`/products/${id}`, updatedData);
  return response.data;
};

// New delete product function
export const deleteProduct = async (id: string): Promise<void> => {
  const response = await api.delete(`/products/${id}/delete`);
  return response.data;
};
