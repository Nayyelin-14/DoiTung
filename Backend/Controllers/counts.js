const { eq } = require("drizzle-orm");
const {
  draftCourse,
  allcourses,
  users,
  user_Courses,
  modules,
  lessons,
} = require("../db");
const db = require("../db/db");

exports.totalDataCount = async (req, res) => {
  try {
    const draftcourse = await db.select().from(draftCourse);
    const courses = await db.select().from(allcourses);
    const allusers = await db.select().from(users);
    const completeCount = await db
      .select()
      .from(allcourses)
      .where(eq(allcourses.status, "completed"));

    return res.status(200).json({
      isSuccess: true,
      draftCount: draftcourse.length,
      courseCount: courses.length,
      usersCount: allusers.length,
      completeCount: completeCount.length,
    });
  } catch (error) {
    return res.status(404).json({
      isSuccess: false,
      message: error.message,
    });
  }
};

exports.totalLessonCounts = async (req, res) => {
  const { courseID, moduleID, userID } = req.params;
  console.log(courseID, userID);
  const userCourse = await db
    .select()
    .from(user_Courses)
    .leftJoin(allcourses, eq(user_Courses.course_id, courseID))
    .leftJoin(modules, eq(modules.courseID, courseID))
    .leftJoin(lessons, eq(lessons.moduleID, modules.module_id))
    .where(eq(user_Courses.user_id, userID));
  const totalLessons = new Set(userCourse.map((item) => item.lessons.lesson_id))
    .size;

  console.log(userCourse.map((item) => item.lessons.lesson_id));
  console.log("Total Lessons:", totalLessons);
};

exports.completeLessonsCount = async (req, res) => {};
