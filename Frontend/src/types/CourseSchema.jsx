import * as z from "zod";

const MAX_FILE_SIZE = 200 * 1024 * 1024; // 200MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif"];
const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/webm"];

export const courseSchema = z.object({
  course_id: z.string().optional(),
  title: z.string().min(10, "Course title is required"),
  description: z.string().min(20, "At least 20 characters"),
  category: z.string().min(5, "Category is required"),
  thumbnail: z.union([
    z
      .instanceof(File)
      .refine((file) => file.size <= MAX_FILE_SIZE, "Max image size is 5MB.")
      .refine(
        (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
        "Only .jpg, .jpeg, and .png formats are supported."
      ),
    z.null(), // Allow null for cases where no file is uploaded
    z.string().url(), // Allow a URL string for prefilled data
  ]),
  overview: z
    .string()
    .min(20, { message: "Please enter at least 20 characters" }),
  courseDemo: z.union([
    z
      .instanceof(File)
      .refine((file) => file.size <= MAX_FILE_SIZE, "Max video size is 5MB.")
      .refine(
        (file) => ACCEPTED_VIDEO_TYPES.includes(file.type),
        "Only .mp4 and .webm formats are supported."
      ),
    // Allow null for cases where no file is uploaded
    z.string().url(), // Allow a URL string for prefilled data
  ]),
});
