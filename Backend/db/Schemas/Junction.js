// import { mysqlTable, varchar } from "drizzle-orm/mysql-core";
// import { users } from "./auth";
// import { allcourses } from "./courses";
const { createId } = require("@paralleldrive/cuid2");
const {
  mysqlTable,
  boolean,
  float,
  timestamp,
} = require("drizzle-orm/mysql-core");
const { users } = require("./auth");

const { varchar } = require("drizzle-orm/mysql-core");
const { allcourses } = require("./edu");

const user_Courses = mysqlTable("user_courses", {
  user_id: varchar("user_id", { length: 225 })
    .notNull()
    .references(() => users.user_id, { onDelete: "cascade" }),
  course_id: varchar("course_id", { length: 225 })
    .notNull()
    .references(() => allcourses.course_id, { onDelete: "cascade" }),
  is_completed: boolean("is_completed").default(false), // If the user has completed this course
  progress: float("progress").default(0), // Progress percentage (e.g., 75%)
  enrolled_at: timestamp("enrolled_at", { mode: "date" }).defaultNow(), // When the user enrolled
  last_updated: timestamp("last_updated", { mode: "date" }).defaultNow(), // Last progress update
});

module.exports = {
  user_Courses,
};
