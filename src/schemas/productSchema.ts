import { z } from "zod";

export const newProductSchema = z.object({
  name: z.string().min(1, { message: "Enter product name" }),
  categoryId: z.string().min(1, { message: "Choose a category" }),
  unit: z.string().min(1, { message: "Choose a unit" }),
  unitPrice: z.number().min(1, { message: "Enter a value" }),
  stock: z.number().min(0, { message: "Enter a value" }),
  minStockLevel: z.number().min(0, { message: "Enter a value" }),
});
