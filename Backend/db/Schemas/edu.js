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
  course_description: text("course_description"),
  course_image_url: varchar("course_image_url", { length: 500 }).notNull(),
  demo_URL: varchar("demo_URL", { length: 500 }).notNull(),
  category: varchar("category", { length: 225 }).notNull(),
  overview: varchar("overview", { length: 225 }).notNull(),
  instructor_name: varchar("instructor_name", { length: 225 }).notNull(),
  status: varchar("status", { length: 225 }).notNull().default("draft"),
  rating: float("rating").notNull().default(0), // Course rating (e.g., 4.5)
  is_popular: boolean("is_popular").notNull().default(false),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
  updated_at: timestamp("updated_at", { mode: "date" }).default(null),
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

  isCompleted: boolean().default(false),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(), // Timestamp when the lesson is created
  moduleID: varchar("moduleID", { length: 225 })
    .notNull()
    .references(() => modules.module_id, { onDelete: "cascade" }), // Foreign key to link with modules
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
module.exports = {
  modules,
  lessons,
  allcourses,
  draftCourse,
};
