import * as z from "zod";

export const twoStepSchema = z.object({
  userID: z.string(),
  isTwostepEnabled: z.boolean(),
  email: z.string().email(),
});
