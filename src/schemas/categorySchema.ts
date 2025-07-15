import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(1, { message: "Category name is required" }),
  units: z
    .array(z.string().min(1))
    .min(1, { message: "At least one unit is required" }),
  description: z.string().optional(),
});
