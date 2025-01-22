const { z } = require("zod");

const courseSchema = z.object({
  course_name: z
    .string()
    .min(1, { message: "Course name cannot be empty" })
    .max(225, { message: "Course name cannot exceed 225 characters" }),
  course_description: z.string().optional(), // Course description is optional as it’s not marked as `notNull` in the DB
  course_image_url: z
    .string()
    .url({ message: "Invalid URL for course image" })
    .max(500, { message: "Course image URL cannot exceed 500 characters" }),
  demo_URL: z
    .string()
    .url({ message: "Invalid URL for course demo" })
    .max(500, { message: "Course demo URL cannot exceed 500 characters" }),
  category: z
    .string()
    .min(1, { message: "Category cannot be empty" })
    .max(225, { message: "Category cannot exceed 225 characters" }),
  overview: z
    .string()
    .min(1, { message: "Overview cannot be empty" })
    .max(225, { message: "Overview cannot exceed 225 characters" }),
  instructor_name: z
    .string()
    .min(1, { message: "Instructor name cannot be empty" })
    .max(225, { message: "Instructor name cannot exceed 225 characters" }),
  rating: z
    .number()
    .min(0, { message: "Rating cannot be less than 0" })
    .max(5, { message: "Rating cannot exceed 5" }) // Assuming ratings are on a 0-5 scale
    .optional()
    .default(0), // Default to 0 if not provided
  is_popular: z.boolean().optional().default(false), // Default to false if not provided
  createdAt: z
    .string()
    .datetime({ message: "Invalid date format for createdAt" })
    .optional(), // Handled by the database default
  updated_at: z
    .string()
    .datetime({ message: "Invalid date format for updated_at" })
    .nullable()
    .optional(), // Can be null or not provided
});

const moduleSchema = z.object({
  module_title: z
    .string()
    .min(1, { message: "Module title cannot be empty" })
    .max(225, { message: "Module title cannot exceed 225 characters" }),
  createdAt: z
    .string()
    .datetime({ message: "Invalid date format for createdAt" })
    .optional(), // Optional as the database sets a default value
  isCompleted: z.boolean().optional().default(false), // Default to false if not provided
  courseID: z
    .string()
    .min(1, { message: "Course ID cannot be empty" })
    .max(225, { message: "Course ID cannot exceed 225 characters" }),
});
const lessonSchema = z.object({
  lesson_title: z
    .string()
    .min(1, { message: "Module title cannot be empty" })
    .max(225, { message: "Module title cannot exceed 225 characters" }),
  createdAt: z
    .string()
    .datetime({ message: "Invalid date format for createdAt" })
    .optional(), // Optional as the database sets a default value
  isCompleted: z.boolean().optional().default(false), // Default to false if not provided
  video_url: z
    .string()
    .url({ message: "Invalid URL for lesson" })
    .max(500, { message: "Lesson URL cannot exceed 500 characters" }),
  moduleID: z
    .string()
    .min(1, { message: "Module ID cannot be empty" })
    .max(225, { message: "Module ID cannot exceed 225 characters" }),
});

module.exports = { courseSchema, moduleSchema, lessonSchema };
