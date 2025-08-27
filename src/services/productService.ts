import api from "./baseApi";
import { type Product, type NewProduct } from "@/types/types";

export const getAllProducts = async (): Promise<Product[]> => {
  const response = await api.get("/products");

  return response.data ?? [];
};

export const getAllProductsByBranch = async (
  branchId?: string
): Promise<Product[]> => {
  const url = branchId ? `/products/branch/${branchId}` : `/products/branch/`; // Let interceptor handle this

  const response = await api.get(url);
  return response.data ?? [];
};

export const createProduct = async (product: NewProduct) => {
  const response = await api.post("/products", product);
  return response.data;
};

export const updateProduct = async (
  id: string,
  updatedData: Partial<NewProduct>
) => {
  const response = await api.patch(`/products/${id}`, updatedData);
  return response.data;
};
