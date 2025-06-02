import { z } from "zod";

// Typescript interface
export type LoginFormInputs = z.infer<typeof loginSchema>;

export const loginSchema = z.object({
  username: z.string().min(1, "Please enter a valid Username"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])/,
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
export const adminCategorySetupSchema = z.object({
  categoryName: z.string().min(1, { message: "Category is required" }),

  categoryUnit: z.string().min(1, { message: "Unit is required" }),
  categoryDescription: z.string().optional(),
});
