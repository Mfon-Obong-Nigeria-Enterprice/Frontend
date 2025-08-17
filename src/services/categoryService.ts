import api from "./baseApi";
import { type Category } from "@/types/types";

export const getAllCategories = async (): Promise<Category[]> => {
  const response = await api.get("/categories");
  return response.data;
};

export const getAllCategoriesByProduct = async (
  id: string
): Promise<Category[]> => {
  const response = await api.get(`/products/${id}/category`);
  return response.data;
};

export const getCategoryById = async (id: string): Promise<Category> => {
  const response = await api.get(`/categories/${id}`);
  return response.data;
};

export const createCategory = async (data: Category): Promise<Category> => {
  const response = await api.post("/categories", data);
  return response.data;
};

export const updateCategory = async (id: string, data: { name: string }) => {
  return api.patch(`/categories/${id}`, data);
};

export const deleteCategory = async (id: string) => {
  return api.delete(`/categories/${id}`);
};
