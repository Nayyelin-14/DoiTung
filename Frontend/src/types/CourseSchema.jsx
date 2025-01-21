import * as z from "zod";

const MAX_FILE_SIZE = 200 * 1024 * 1024; // 200MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif"];
const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/webm"];

export const courseSchema = z.object({
  title: z.string().min(10, "Course title is required"),
  description: z.string().min(20, "At least 20 characters"),
  category: z.string().min(5, "Category is required"),
  thumbnail: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, "Max image size is 5MB.")
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only .jpg, .jpeg, and .png formats are supported."
    )
    .refine(
      (file) =>
        file === null || file instanceof FileList ? file.length === 1 : true,
      "You can upload only one thumbnail."
    ),
  overview: z
    .string()
    .min(20, { message: "Please enter at least 20 characters" }),
  courseDemo: z
    .instanceof(File)
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
