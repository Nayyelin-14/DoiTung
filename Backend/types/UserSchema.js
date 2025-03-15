const { z } = require("zod");
exports.LoginSchema = z.object({
  username: z
    .string()
    .min(4, "Username must be at least 4 characters")
    .max(255, "Username is too long")
    .toLowerCase()
    .trim(), // Validate username (text)
  password: z.string().min(6, "Username must be at least 4 characters "),
});

exports.RegisterSchema = z.object({
  username: z
    .string()
    .min(4, "Username must be at least 4 characters")
    .max(255, "Username is too long")
    .toLowerCase()
    .trim(), // Validate username (text)
  password: z.string().min(6, "Username must be at least 4 characters "),
  role: z.enum(["admin", "user"]).default("user"),
});
