import { z } from "zod";

export type LoginFormInputs = z.infer<typeof loginSchema>;

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
