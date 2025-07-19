// @/types/types.ts
import { z } from "zod";
import { categorySchema } from "@/schemas/categorySchema"; // Assuming you have this schema

export type CategoryData = z.infer<typeof categorySchema>;

export type Role = "SUPER_ADMIN" | "MAINTAINER" | "ADMIN" | "STAFF";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  branch: string;
  branchId: string;
  created_at: string;
}

export interface LoginResponse {
  status: number;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export type Category = {
  _id: string;
  name: string;
  units: string[]; // New field
  description?: string;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Product = {
  _id: string; // Mongo ID
  name: string;
  categoryId: string | { _id: string; name: string; units: string[] }; // Can be string or object, with units
  minStockLevel: number;
  stock: number; // Current stock
  unit: string;
  unitPrice: number;
  priceHistory?: Array<{
    price: number;
    date: string;
    _id: string;
  }>;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type UpdateStockProduct = Product & {
  id: string; // Used for React keys and local identification in UpdateStock
  newQuantity?: number; // The quantity being updated by the user
  selected?: boolean; // For checkbox selection
  category: string; // The category name, derived for display
  shieldStatus: "high" | "low"; // Standardized to "high" | "low"
};

export type NewProduct = {
  name: string;
  categoryId: string;
  unit: string;
  unitPrice: number;
  stock: number;
  minStockLevel: number;
};

export type ProductImportRow = {
  "Product Name": string;
  Category: string;
  "Stock Quantity": number | string;
  "Price per unit": number | string;
};

export type InventoryState = {
  products: Product[];
  categories: Category[];
  searchQuery: string;
  selectedCategoryId: string;
  categoryUnits: string[];
};