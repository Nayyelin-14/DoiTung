const { createId } = require("@paralleldrive/cuid2");
const { timestamp } = require("drizzle-orm/mysql-core");
const { text } = require("drizzle-orm/mysql-core");
const { boolean } = require("drizzle-orm/mysql-core");
const { mysqlTable } = require("drizzle-orm/mysql-core");

const { varchar } = require("drizzle-orm/mysql-core");
const { float } = require("drizzle-orm/mysql-core");
const { int } = require("drizzle-orm/mysql-core");
const { users } = require("./auth");

const allcourses = mysqlTable("courses", {
  course_id: varchar("course_id", { length: 225 })
    .primaryKey()
    .$defaultFn(() => createId()),
  course_name: varchar("course_name", { length: 225 }).notNull(),
  course_description: text("course_description").notNull(),
  course_image_url: varchar("course_image_url", { length: 500 }).notNull(),
  demo_URL: varchar("demo_URL", { length: 500 }).notNull(),
  category: varchar("category", { length: 225 }).notNull(),
  overview: text("overview").notNull(),
  instructor_name: varchar("instructor_name", { length: 225 }).notNull(),
  instructor_image: varchar("instructor_image", { length: 500 }).notNull(),
  about_instructor: text("about_instructor").notNull(),
  status: varchar("status", { length: 225 }).notNull().default("draft"),
  rating: float("rating").default(0).notNull(), // Course rating (e.g., 4.5)
  is_popular: boolean("is_popular").default(false),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
  updated_at: timestamp("updated_at", { mode: "date" }).defaultNow(),
});
const modules = mysqlTable("modules", {
  module_id: varchar("module_id", { length: 225 })
    .primaryKey()
    .$defaultFn(() => createId()),
  module_title: varchar("module_title", { length: 225 }).notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
  isCompleted: boolean().default(false),
  courseID: varchar("courseID", { length: 225 })
    .notNull()
    .references(() => allcourses.course_id, { onDelete: "cascade" }),
});

const lessons = mysqlTable("lessons", {
  lesson_id: varchar("lesson_id", { length: 225 })
    .primaryKey()
    .$defaultFn(() => createId()),
  lesson_title: varchar("lesson_title", { length: 225 }).notNull(),
  video_url: varchar("video_url", { length: 500 }).notNull(),
  duration: float("duration").notNull().default(0),
  isCompleted: boolean().default(false),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(), // Timestamp when the lesson is created
  moduleID: varchar("moduleID", { length: 225 })
    .notNull()
    .references(() => modules.module_id, { onDelete: "cascade" }), // Foreign key to link with modules
});

const comments = mysqlTable("comments", {
  comment_id: varchar("comment_id", { length: 225 })
    .primaryKey()
    .$defaultFn(() => createId()),
  lesson_id: varchar("lesson_id", { length: 225 })
    .notNull()
    .references(() => lessons.lesson_id, { onDelete: "cascade" }), // Links to lessons table
  user_id: varchar("user_id", { length: 225 })
    .notNull()
    .references(() => users.user_id, { onDelete: "cascade" }), // Links to users table
  comment_text: text("comment_text").notNull(), // The actual comment
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(), // Timestamp for when the comment was made
});

const draftCourse = mysqlTable("draft", {
  draft_id: varchar("draft_id", { length: 225 })
    .primaryKey()
    .$defaultFn(() => createId()),
  userID: varchar("userID", { length: 225 })
    .notNull()
    .references(() => users.user_id, { onDelete: "cascade" }),
  courseID: varchar("courseID", { length: 225 })
    .notNull()
    .references(() => allcourses.course_id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
});

const course_reviews = mysqlTable("course_reviews", {
  review_id: varchar("review_id", { length: 225 })
    .primaryKey()
    .$defaultFn(() => createId()),
  course_id: varchar("course_id", { length: 225 })
    .notNull()
    .references(() => allcourses.course_id, { onDelete: "cascade" }),
  user_id: varchar("user_id", { length: 225 })
    .notNull()
    .references(() => users.user_id, { onDelete: "cascade" }),
  rating: float("rating").notNull(), // Rating (1 to 5)
  review_text: text("review_text"), // Optional review text
  // feedback: text("feedback"),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
});

//Quizzes and Tests

const quizzes = mysqlTable("quizzes", {
  quiz_id: varchar("quiz_id", { length: 225 })
    .primaryKey()
    .$defaultFn(() => createId()),
  title: varchar("title", { length: 225 }).notNull(),
  moduleID: varchar("moduleID", { length: 225 })
    .notNull()
    .references(() => modules.module_id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
});

const tests = mysqlTable("tests", {
  test_id: varchar("test_id", { length: 225 })
    .primaryKey()
    .$defaultFn(() => createId()),
  title: varchar("title", { length: 225 }).notNull(),
  timeLimit: int("timeLimit").notNull(),
  courseID: varchar("courseID", { length: 225 })
    .notNull()
    .references(() => allcourses.course_id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
});

const questions = mysqlTable("questions", {
  question_id: varchar("question_id", { length: 225 })
    .primaryKey()
    .$defaultFn(() => createId()),
  question_text: text("question_text").notNull(),
  options: text("options").notNull(), // Store options as JSON array
  correct_option: varchar("correct_option", { length: 255 }).notNull(),
  quizID: varchar("quizID", { length: 225 }).references(() => quizzes.quiz_id, {
    onDelete: "cascade",
  }),
  testID: varchar("testID", { length: 225 }).references(() => tests.test_id, {
    onDelete: "cascade",
  }),
});

const test_status = mysqlTable("test_status", {
  status_id: varchar("status_id", { length: 225 })
    .primaryKey()
    .$defaultFn(() => createId()),
  userID: varchar("userID", { length: 225 })
    .notNull()
    .references(() => users.user_id, { onDelete: "cascade" }),
  testID: varchar("testID", { length: 225 })
    .notNull()
    .references(() => tests.test_id, { onDelete: "cascade" }),
  courseID: varchar("courseID", { length: 225 })
    .notNull()
    .references(() => allcourses.course_id, { onDelete: "cascade" }),
  startTime: timestamp("startTime", { mode: "date" }).defaultNow(),
  expiresAt: timestamp("expiresAt", { mode: "date" })
    .notNull()
    .defaultNow(),
});

const user_attempts = mysqlTable("user_attempts", {
  attempt_id: varchar("attempt_id", { length: 225 })
    .primaryKey()
    .$defaultFn(() => createId()),
  userID: varchar("userID", { length: 225 })
    .notNull()
    .references(() => users.user_id, { onDelete: "cascade" }),
  quizID: varchar("quizID", { length: 225 }).references(() => quizzes.quiz_id, {
    onDelete: "cascade",
  }),
  testID: varchar("testID", { length: 225 }).references(() => tests.test_id, {
    onDelete: "cascade",
  }),
  attemptNumber: int("attemptNumber").notNull().default(1),
  score: float("score").notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
});

const completed_lessons = mysqlTable("completed_lessons", {
  lesson_id: varchar("lesson_id", { length: 225 })
    .primaryKey()
    .$defaultFn(() => createId()),
  user_id: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => users.user_id, { onDelete: "cascade" }),

  course_id: varchar("course_id", { length: 255 })
    .notNull()
    .references(() => allcourses.course_id, { onDelete: "cascade" }),
  completedLessons: varchar("completed_lessons", { length: 5000 }).default(
    "[]"
  ), // Store lesson IDs as JSON
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
  updated_at: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

const savedcourse = mysqlTable("saved_courses", {
  user_id: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => users.user_id, { onDelete: "cascade" }),

  course_id: varchar("course_id", { length: 255 })
    .notNull()
    .references(() => allcourses.course_id, { onDelete: "cascade" }),

  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
  updated_at: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

const certificates = mysqlTable("certificates", {
  certificate_id: varchar("certificate_id", { length: 225 })
    .primaryKey()
    .$defaultFn(() => createId()),
  userID: varchar("userID", { length: 225 })
    .notNull()
    .references(() => users.user_id, { onDelete: "cascade" }),
  courseID: varchar("courseID", { length: 225 })
    .notNull()
    .references(() => allcourses.course_id, { onDelete: "cascade" }),
  testID: varchar("testID", { length: 225 })
    .notNull()
    .references(() => tests.test_id, { onDelete: "cascade" }),
  score: float("score").notNull(),
  certificate_url: varchar("certificate_url", { length: 255 }).notNull(), 
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
});

module.exports = {
  modules,
  lessons,
  allcourses,
  draftCourse,
  comments,
  course_reviews,
  quizzes,
  tests,
  questions,
  user_attempts,
  completed_lessons,
  savedcourse,
  certificates,
  test_status
};
