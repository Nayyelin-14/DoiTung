const { z } = require("zod");
exports.LoginSchema = z.object({
  email: z.string().email("Invalid email!!!"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(255, "Password is too long"), // Validate password (text)
});

exports.RegisterSchema = z.object({
  username: z
    .string()
    .min(4, "Username must be at least 4 characters")
    .max(255, "Username is too long"), // Validate username (text)
  email: z.string().email("Invalid email!!!"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(255, "Password is too long"), // Validate password (text)
});
