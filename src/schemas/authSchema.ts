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
