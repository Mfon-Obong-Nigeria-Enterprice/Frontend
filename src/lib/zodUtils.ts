import { z } from "zod";

export type LoginFormInputs = z.infer<typeof loginSchema>;

export const loginSchema = z.object({
  username: z.string().min(1, "Please enter a valid Username"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(
      /^(?=.*[a-z])(?=.)/,
      "Password must contain one uppercase and one lowercase"
    ),
});

export const adminSetupSchema = z.object({
  phoneNumber: z
    .string()
    .min(11, { message: "Phone number should be at least 11 numbers" }),
  businessEmail: z
    .string()
    .optional()
    .refine((val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
      message: "Email must be a valid email address",
    }),
  businessAddress: z
    .string()
    .min(1, { message: "Business address is required" }),
});

// for admin set up screen 02
export const categorySchema = z.object({
  name: z.string().min(1, { message: "Category name is required" }),
  units: z
    .array(z.string().min(1))
    .min(1, { message: "At least one unit is required" }),
  description: z.string().optional(),
});

// for admin set up screen 03
export const adminProductSetupSchema = z.object({
  productName: z.string().min(1, { message: "Enter product name" }),
  categoryName: z.string().min(1, { message: "Choose a category" }),
  productUnit: z.string().min(1, { message: "Unit is required" }),
  secondUnit: z.string().optional(),
  unitConversion: z.string().optional(),
  initialQuantity: z.string().min(1, { message: "Enter quantity" }),
  unitPrice: z.string().min(1, { message: "Enter price per unit" }),
  lowStockAlert: z.string().min(1, { message: " Enter a value" }),
});

// for admin client setup screen 04
export const adminClientSetupSchema = z.object({
  clientName: z.string().min(1, { message: "Name is required" }),
  clientNumber: z
    .string()
    .min(11, { message: "Phone number should be at least 11 numbers" }),
  initialBal: z.coerce.number().optional().or(z.literal(0)),

  clientAddress: z.string().optional(),
});

export const newProductSchema = z.object({
  name: z.string().min(1, { message: "Enter product name" }),
  categoryId: z.string().min(1, { message: "Choose a category" }),
  unit: z.string().min(1, { message: "Choose a unit" }),
  unitPrice: z.number().min(1, { message: "Enter a value" }),
  stock: z.number().min(0, { message: "Enter a value" }),
  minStockLevel: z.number().min(0, { message: "Enter a value" }),
});
