const { relations } = require("drizzle-orm");
const { users } = require("./auth");

const { modules, lessons, allcourses, comments, course_reviews } = require("./edu");
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


// Define relation: Lessons → Comments (One-to-Many)
const lessons_commentsRelations = relations(lessons, ({ many }) => ({
  comments: many(comments, {
    relationName: "lesson_comments",
    fields: [lessons.lesson_id],
    references: [comments.lesson_id],
  }),
}));

// Define relation: Users → Comments (One-to-Many)
const users_commentsRelations = relations(users, ({ many }) => ({
  comments: many(comments, {
    relationName: "user_comments",
    fields: [users.user_id],
    references: [comments.user_id],
  }),
}));

// Define relation: Comments → Lesson (Many-to-One)
const comments_lessonsRelations = relations(comments, ({ one }) => ({
  lesson: one(lessons, {
    relationName: "lesson_comments",
    fields: [comments.lesson_id],
    references: [lessons.lesson_id],
  }),
}));

// Define relation: Comments → User (Many-to-One)
const comments_usersRelations = relations(comments, ({ one }) => ({
  user: one(users, {
    relationName: "user_comments",
    fields: [comments.user_id],
    references: [users.user_id],
  }),
}));

const users_reviewsRelation = relations(users, ({ many }) => ({
  reviews: many(course_reviews, {
    relationName: "user_reviews",
    fields: [users.user_id],
    references: [course_reviews.user_id],
  }),
}));

const reviews_usersRelation = relations(course_reviews, ({ one }) => ({
  user: one(users, {
    relationName: "user_reviews",
    fields: [course_reviews.user_id],
    references: [users.user_id],
  }),
}));

module.exports = {
  Users_coursesRelation,
  lessons_moduleRelations,
  modules_lessonsRelation,
  modules_courses,
  allcoursesRelations,
  Courses_UserRelation,
  lessons_commentsRelations,
  users_commentsRelations,
  comments_lessonsRelations,
  comments_usersRelations,
  users_reviewsRelation,
  reviews_usersRelation,
};
