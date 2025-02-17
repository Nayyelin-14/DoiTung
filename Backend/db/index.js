const {
  users,
  emailVerification,
  accounts,
} = require("./Schemas/auth");

const { Two_step } = require("./Schemas/auth");
const {
  Users_coursesRelation,
  lessons_moduleRelations,
  Courses_UserRelation,
  modules_lessonsRelation,
  modules_courses,
  allcoursesRelations,
  lessons_commentsRelations,
  users_commentsRelations,
  comments_lessonsRelations,
  comments_usersRelations,
  users_reviewsRelation,
  reviews_usersRelation,
  quizzes_modulesRelation,
  tests_coursesRelation,
  questions_quizzesRelation,
  questions_testsRelation,
  attempts_usersRelation,
} = require("./Schemas/DBrelations");
const {
  lessons,
  modules,
  allcourses,
  draftCourse,
  comments,
  course_reviews,
  quizzes,
  tests,
  questions,
  user_attempts,
  completed_lessons,
} = require("./Schemas/edu");
const { user_Courses } = require("./Schemas/Junction");

module.exports = {
  users,
  emailVerification,
  Two_step,
  allcourses,
  Users_coursesRelation,
  lessons,
  lessons_moduleRelations,
  modules,
  Courses_UserRelation,
  modules_lessonsRelation,
  modules_courses,
  allcoursesRelations,
  user_Courses,
  accounts,
  draftCourse,
  comments,
  lessons_commentsRelations,
  users_commentsRelations,
  comments_lessonsRelations,
  comments_usersRelations,
  course_reviews,
  users_reviewsRelation,
  reviews_usersRelation,
  quizzes,
  tests,
  questions,
  user_attempts,
  quizzes_modulesRelation,
  tests_coursesRelation,
  questions_quizzesRelation,
  questions_testsRelation,
  attempts_usersRelation,
  completed_lessons,
};
