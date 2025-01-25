const {
  users,
  emailVerification,
  Two_factor,
  accounts,
} = require("./Schemas/auth");

const {
  Users_coursesRelation,
  lessons_moduleRelations,
  Courses_UserRelation,
  modules_lessonsRelation,
  modules_courses,
  allcoursesRelations,
} = require("./Schemas/DBrelations");
const { lessons, modules, allcourses, draftCourse } = require("./Schemas/edu");
const { user_Courses } = require("./Schemas/Junction");

module.exports = {
  users,
  emailVerification,
  Two_factor,
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
};
