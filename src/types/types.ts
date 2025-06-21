import { z } from "zod";
import {
  adminProductSetupSchema,
  adminCategorySetupSchema,
  adminSetupSchema,
  adminClientSetupSchema,
} from "../lib/zodUtils";

export type AdminSetupData = z.infer<typeof adminSetupSchema>;
export type AdminSetupCatData = z.infer<typeof adminCategorySetupSchema>;
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
