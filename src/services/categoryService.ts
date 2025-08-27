import api from "./baseApi";
import { type Category } from "@/types/types";
// import axios from "axios";
export const getAllCategories = async (): Promise<Category[]> => {
  const response = await api.get("/categories");
  return response.data;
};

// In your categoryService.ts
// export const getAllCategories = async (): Promise<Category[]> => {
//   try {
//     console.log("🔍 Making API call to /categories");
//     console.log("🔍 API base URL:", import.meta.env.VITE_API_URL);

//     const response = await api.get("/categories");

//     console.log("✅ Categories API response status:", response.status);
//     console.log("✅ Categories API response data:", response.data);
//     console.log("✅ Categories API response headers:", response.headers);

//     return response.data;
//   } catch (error: any) {
//     console.error("❌ Error fetching categories:", error);
//     console.error("❌ Error details:", {
//       message: error.message,
//       response: error.response?.data,
//       status: error.response?.status,
//     });
//     throw error;
//   }
// };
// Option 1: Make the API call without Authorization header for categories
// export const getAllCategories = async (): Promise<Category[]> => {
//   try {
//     // Use axios directly without the interceptor for public endpoints
//     const response = await axios.get(
//       `${import.meta.env.VITE_API_URL}/categories`
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching categories:", error);
//     throw error;
//   }
// };

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
