import { z } from "zod";
import {
  adminProductSetupSchema,
  categorySchema,
  adminSetupSchema,
  adminClientSetupSchema,
} from "../lib/zodUtils";

export type AdminSetupData = z.infer<typeof adminSetupSchema>;
export type CategoryData = z.infer<typeof categorySchema>;
export type AdminSetupProdData = z.infer<typeof adminProductSetupSchema>;
export type AdminSetupClientData = z.infer<typeof adminClientSetupSchema>;

export type Role = "SUPER_ADMIN" | "ADMIN" | "STAFF";

export type SetupTitleProps = {
  title: string;
  description: string;
};

export interface AdminSetupProd {
  productName: string;
  categoryName: string;
  productUnit: string;
  secondUnit?: string;
  unitConversion?: string;
  initialQuantity: string;
  unitPrice: string;
  lowStockAlert: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  branch: string;
  isSetupComplete?: boolean;
}

export interface LoginResponse {
  status: number;
  message: string;
  data: {
    user: {
      id: string;
      email: string;
      role: Role;
      name: string;
      branch: string;
      isSetupComplete?: boolean;
    };
    token: string;
  };
}
// This file defines the types used in the application, including user roles, setup data, and product categories.

export interface Client {
  _id: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  balance: number;
  transactions: TransactionItem[];
  isActive: boolean;
  isRegistered: boolean;
  createdAt: string;
  updatedAt: string;
  lastTransactionDate?: string;
}

export interface TransactionItem {
  _id: string;
  type: "DEPOSIT";
  amount: number;
  description?: string;
  date: string;
  reference: string;
}

export interface ClientWithTransactions {
  _id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  balance: number;
  transactions: TransactionItem[];
  isActive: boolean;
  isRegistered: boolean;
  createdAt: string;
  updatedAt: string;
  lastTransactionDate?: string;
}

export interface CreateTransactionPayload {
  type: "DEPOSIT";
  amount: number;
  description?: string;
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
  categoryId: Category[];
  minStockLevel: number;
  stock: number;
  unit: string;
  unitPrice: number;
  priceHistory: priceHistory[];
  isActive: boolean;
};

export type priceHistory = {
  price: number;
  date: string;
  _id: string;
};

export type NewProduct = {
  name: string;
  categoryId: string;
  unit: string;
  unitPrice: number;
  stock: number;
  minStockLevel: number;
};
