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

exports.AdminsSchema = z.object({
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
  role: z.enum(["admin", "superadmin"]).default("admin"),
});

// exports.superAdminsAuthSchema = z.object({
//   username: z
//     .string()
//     .min(4, "Username must be at least 4 characters")
//     .max(255, "Username is too long")
//     .toLowerCase()
//     .trim(), // Validate username (text)
//   email: z
//     .string()
//     .email("Invalid email format. Please enter a valid email address."),
//   password: z.string().min(6, "Password must be at least 4 characters "),
//   superadminToken: z.string().min(6, "Invalid token"),
// });
