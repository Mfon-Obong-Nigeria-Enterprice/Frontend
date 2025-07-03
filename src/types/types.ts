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
