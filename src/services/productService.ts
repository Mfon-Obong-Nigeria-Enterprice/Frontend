import api from "./baseApi";
import { type AxiosError } from "axios";
import { type Product, type NewProduct } from "@/types/types";

export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const response = await api.get("/products");

    return response.data ?? [];
  } catch (error) {
    const err = error as AxiosError;
    console.error(
      "Error fetching products:",
      err.response?.data || err.message
    );
    throw error;
  }
};

export const getAllProductsByBranch = async () => {
  try {
    const response = await api.get(`/api/products/branch/`);
    return response.data ?? [];
  } catch (error) {
    console.error("error fetching", error);
  }
};

// export const getAllProductsByBranch = async (branchId: string) => {
//   try {
//     const response = await api.get(`/api/products/branch/${branchId}`);
//     return response.data ?? [];
//   } catch (error) {
//     console.error("error fetching", error);
//   }
// };

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
