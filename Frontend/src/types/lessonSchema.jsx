import * as z from "zod";
const MAX_FILE_SIZE = 200 * 1024 * 1024; // 200MB

const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/webm"];

export const lessonSchema = z.object({
  lesson_title: z
    .string()
    .nonempty({ message: "Module title cannot be empty" })
    .min(10, {
      message: "Enter at least 10 characters",
    }),
  lesson_content: z
    .instanceof(File, "Please fill a valid file")
    .refine((file) => file.size <= MAX_FILE_SIZE, "Max video size is 5MB.")
    .refine(
      (file) => ACCEPTED_VIDEO_TYPES.includes(file.type),
      "Only .mp4 and .webm formats are supported."
    )
    .refine(
      (file) =>
        file === null || file instanceof FileList ? file.length === 1 : true,
      "You can upload only one demo."
    ),
});
