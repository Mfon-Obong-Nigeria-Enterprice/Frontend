import localforage from "localforage";
import api from "./baseApi";
import { type AxiosError } from "axios";
import { type Product, type NewProduct } from "@/types/types";

export const getAllProducts = async (): Promise<Product[]> => {
  const token = await localforage.getItem<string>("access_token");
  if (!token) throw new Error("No access token found");

  try {
    const response = await api.get("/products", {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    console.error(
      "Error fetching products:",
      err.response?.data || err.message
    );
    throw error;
  }
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
