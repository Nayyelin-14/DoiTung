import * as z from "zod";
export const loginSchema = z.object({
  username: z
    .string()
    .min(4, {
      message: "Enter a valid username",
    })
    .trim(),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters",
  }),
});
