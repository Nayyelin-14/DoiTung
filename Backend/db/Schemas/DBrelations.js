const { relations } = require("drizzle-orm");
const { users } = require("./auth");

const { modules, lessons, allcourses } = require("./edu");
const { user_Courses } = require("./Junction");

const Users_coursesRelation = relations(users, ({ many, one }) => ({
  allcourses: many(allcourses, {
    relationName: "users_courses",
    fields: [users.user_id],
    references: [user_Courses.user_id],
  }),
}));

const Courses_UserRelation = relations(allcourses, ({ many }) => ({
  users: many(users, {
    relationName: "users_courses",
    fields: [allcourses.course_id],
    references: [user_Courses.course_id],
  }),
}));

const allcoursesRelations = relations(allcourses, ({ many }) => ({
  modules: many(modules, {
    relationName: "course_modules",
    fields: [allcourses.course_id], // Linking the courses table with the modules table through `course_id`
    references: [modules.courseID], // Referencing `courseID` in the modules table
  }),
}));

const modules_courses = relations(modules, ({ one }) => ({
  course: one(allcourses, {
    relationName: "course_modules",
    fields: [modules.courseID],
    references: [allcourses.course_id],
  }),
}));
// From allcourses to modules: A course can have many modules.
// From modules to allcourses: A module belongs to one course.

const modules_lessonsRelation = relations(modules, ({ many }) => ({
  lessons: many(lessons, {
    relationName: "module_lessons",
    fields: [modules.module_id],
    references: [lessons.moduleID],
  }),
}));
const lessons_moduleRelations = relations(lessons, ({ one }) => ({
  module: one(modules, {
    relationName: "module_lessons",
    fields: [lessons.moduleID],
    references: [modules.module_id],
  }),
}));

module.exports = {
  Users_coursesRelation,
  lessons_moduleRelations,
  modules_lessonsRelation,
  modules_courses,
  allcoursesRelations,
  Courses_UserRelation,
};
