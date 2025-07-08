import { z } from "zod";
import { categorySchema } from "@/schemas/categorySchema";

export type CategoryData = z.infer<typeof categorySchema>;

export type Role = "SUPER_ADMIN" | "MAINTAINER" | "ADMIN" | "STAFF";

export type SetupTitleProps = {
  title: string;
  description: string;
};

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
    // user: {
    //   id: string;
    //   email: string;
    //   role: Role;
    //   name: string;
    //   branch: string;
    //   isSetupComplete?: boolean;
    // };
    token: string;
  };
}

export type Category = {
  _id: string;
  name: string;
  units: string[];
  description?: string;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Product = {
  _id: string;
  name: string;
  categoryId: {
    name: string;
    _id: string;
    units: [];
  };
  minStockLevel: number;
  stock: number;
  unit: string;
  unitPrice: number;
  priceHistory: [
    {
      price: number;
      date: string;
      _id: string;
    }
  ];
  isActive: boolean;
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
