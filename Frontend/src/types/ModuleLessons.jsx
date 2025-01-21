import * as z from "zod";

export const moduleSchema = z.object({
  module_title: z
    .string()
    .nonempty({ message: "Module title cannot be empty" })
    .min(10, {
      message: "Enter at least 10 characters",
    }),
});
