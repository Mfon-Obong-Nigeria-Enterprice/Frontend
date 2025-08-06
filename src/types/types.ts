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

// ==================== CATEGORY TYPE ====================
export interface Category {
  description: string | undefined;
  _id: string;
  name: string;
  units: string[];
}

// ==================== API RESPONSE TYPE ====================
export interface ApiResponse<T = unknown> {
  success: boolean;
  status: number;
  message: string;
  data: T;
}

// ==================== AUTH TYPES ====================
export interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
  branch: string;
  branchId: string;
  createdAt: string;
}

export interface LoginResponse {
  status: number;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export type TransactionType = "PURCHASE" | "PICKUP" | "DEPOSIT";

// ==================== CLIENT TYPES ====================
export interface TransactionItem {
  _id: string;
  type: TransactionType;
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
  description?: string;
  transactions: TransactionItem[];
  isActive: boolean;
  isRegistered: boolean;
  createdAt: string;
  updatedAt: string;
  lastTransactionDate?: string;
}

interface BaseTransactionPayload {
  type: TransactionType;
}

// ==================== TRANSACTION PAYLOAD TYPES ====================
export interface PaymentTransactionPayload extends BaseTransactionPayload {
  type: "DEPOSIT";
  amount: number;
  paymentMethod: string;
  reference: string;
}

export interface ProductTransactionPayload extends BaseTransactionPayload {
  type: "PURCHASE" | "PICKUP";
  items: {
    productId: string;
    quantity: number;
    unitPrice: number;
    discount?: number;
  }[];
}

export type CreateTransactionPayload = 
  | PaymentTransactionPayload 
  | ProductTransactionPayload;

// ==================== PRODUCT RELATED TYPES ====================
export interface NewProduct {
  name: string;
  categoryId: string;
  unit: string;
  unitPrice: number;
  stock: number;
  minStockLevel: number;
}

export type ProductImportRow = {
  "Product Name": string;
  Category: string;
  "Stock Quantity": number | string;
  "Price per unit": number | string;
};

export interface ProductUpdatePricePayload {
  productId: string;
  newPrice: number;
}

// ==================== INVENTORY STATE TYPE ====================
export interface InventoryState {
  products: Product[];
  categories: Category[];
  searchQuery: string;
  selectedCategoryId: string;
  categoryUnits: string[];
}

// ==================== APP SETUP TYPE ====================
export interface AppSetupResponse {
  settings: Settings;
  // ... other app setup data
}

// ==================== COMPOSITE TYPES ====================
export interface UpdateStockProduct extends Product {
  newQuantity?: number;
  selected?: boolean;
  category: string;
  shieldStatus: "high" | "low";
}

export interface ClientWithTransactions extends Client {
  transactions: TransactionItem[];
}