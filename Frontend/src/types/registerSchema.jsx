import * as z from "zod";
export const registerSchema = z.object({
  username: z.string().min(4, {
    message: "Username must be at least 4 characters",
  }),
  email: z.string().email({
    message: "Enter a valid email",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters",
  }),
});
