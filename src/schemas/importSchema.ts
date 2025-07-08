import { z } from "zod";

export const productImportSchema = z.object({
  "Product Name": z.string().min(1),
  Category: z.string().min(1),
  "Stock Qunatity": z.union([z.string(), z.number()]),
  "Price per unit": z.union([z.string(), z.number()]),
});

export type ProductImportRow = z.infer<typeof productImportSchema>;
