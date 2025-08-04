import { z } from "zod";
import { settingsSchema, updateSettingsSchema } from "@/schemas/SettingsSchemas";

// ==================== CORE TYPES ====================
export type Role = "SUPER_ADMIN" | "MAINTAINER" | "ADMIN" | "STAFF";

export interface PriceHistoryItem {
  price: number;
  date: string;
  _id: string;
}

// ==================== SETTINGS TYPES ====================
export type Settings = z.infer<typeof settingsSchema>;
export type UpdateSettingsPayload = z.infer<typeof updateSettingsSchema>;

// ==================== PRODUCT TYPES ====================
export interface Product {
  _id: string;
  name: string;
  categoryId: string | { _id: string; name: string; units: string[] };
  minStockLevel: number;
  stock: number;
  unit: string;
  unitPrice: number;
  priceHistory?: PriceHistoryItem[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// ==================== API RESPONSE TYPE ====================
export interface ApiResponse<T = unknown> {
  success: never;
  status: number;
  message: string;
  data: T;
}

// ==================== AUTH TYPES ====================
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

// ==================== CLIENT TYPES ====================
export interface TransactionItem {
  _id: string;
  type: "DEPOSIT";
  amount: number;
  description?: string;
  date: string;
  reference: string;
}

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

// ==================== OTHER TYPES ====================
export interface CreateTransactionPayload {
  type: "Credit" | "partial" | "debit";
  amount: number;
  description?: string;
}

export interface NewProduct {
  name: string;
  categoryId: string;
  unit: string;
  unitPrice: number;
  stock: number;
  minStockLevel: number;
}

export interface ProductUpdatePricePayload {
  productId: string;
  newPrice: number;
}

export interface AppSetupResponse {
  settings: Settings;
  // ... other app setup data
}

// ==================== COMPOSITE TYPES ====================
export interface UpdateStockProduct extends Product {
  id: string;
  newQuantity?: number;
  selected?: boolean;
  category: string;
  shieldStatus: "high" | "low";
}

export interface ClientWithTransactions extends Client {
  phone: string;
  email: string;
  address: string;
}