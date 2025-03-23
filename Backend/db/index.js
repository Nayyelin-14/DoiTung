const { users } = require("./Schemas/auth");

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
  certificates_relations
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
  savedcourse,
  certificates,
  test_status
} = require("./Schemas/edu");
const { user_Courses } = require("./Schemas/Junction");

module.exports = {
  users,

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
  test_status,
  questions,
  user_attempts,
  quizzes_modulesRelation,
  tests_coursesRelation,
  questions_quizzesRelation,
  questions_testsRelation,
  attempts_usersRelation,
  completed_lessons,
  savedcourse,
  certificates,
  certificates_relations
};
