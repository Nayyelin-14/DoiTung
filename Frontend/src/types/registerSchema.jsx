import * as z from "zod";
export const registerSchema = z.object({
  username: z.string().min(4, {
    message: "Enter a valid username",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters",
  }),
  role: z.enum(["admin", "user"]).default("user"),
});

export const adminSchema = z.object({
  username: z
    .string()
    .min(4, "Username must be at least 4 characters")
    .max(255, "Username is too long")
    .toLowerCase()
    .trim(), // Validate username (text)
  email: z
    .string()
    .email("Invalid email format. Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 4 characters "),
  token: z.string().min(6, "Invalid token"),
  role: z.enum(["admin", "user"]).default("admin"),
});

export const adminLoginSchema = z.object({
  username: z
    .string()
    .min(4, "Username must be at least 4 characters")
    .max(255, "Username is too long")
    .toLowerCase()
    .trim(), // Validate username (text)
  email: z
    .string()
    .email("Invalid email format. Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 4 characters "),
  token: z.string().min(6, "Invalid token"),
});
