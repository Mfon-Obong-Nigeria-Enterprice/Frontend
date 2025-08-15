import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(1, { message: "Category name is required" }),
  units: z
    .array(z.string().min(1))
    .min(1, { message: "At least one unit is required" }),
  description: z.string().optional(),
});

export const notificationSchema = z.object({
  id: z.string(),
  type: z.enum(["payment", "transaction", "system", "client"]),
  title: z.string(),
  description: z.string(),
  author: z.string().optional(),
  location: z.string().optional(),
  amount: z.number().optional(),
  daysOverdue: z.number().optional(),
  timestamp: z.string(),
  read: z.boolean().default(false),
});

export type Notification = z.infer<typeof notificationSchema>;
