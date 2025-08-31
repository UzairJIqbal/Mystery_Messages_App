import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, "Username must be at least 2 characters")
  .max(20, "Username must be under 20 characters")

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.email({ message: "Email address is not correct" }),
  password: z.string().min(6, "Password must be at least 6 characters")
})