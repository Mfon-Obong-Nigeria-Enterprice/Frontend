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
