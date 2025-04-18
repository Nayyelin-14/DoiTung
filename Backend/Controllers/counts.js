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

    const allEnrollments = await db
      .select({ enrolled_at: user_Courses.enrolled_at })
      .from(user_Courses);

    if (allEnrollments.length === 0) {
      throw new Error("There is no enrollments");
    }
    const dailyCounts = {};
    console.log("fiirst", dailyCounts);
    allEnrollments.forEach((enrollment) => {
      // Extract the date part from the 'enrolled_at' timestamp

      const enrolledDate = enrollment.enrolled_at.toISOString().split("T")[0];

      // Increment the count for that date
      dailyCounts[enrolledDate] = (dailyCounts[enrolledDate] || 0) + 1;
    });

    return res.status(200).json({
      isSuccess: true,
      draftCount: draftcourse.length,
      courseCount: courses.length,
      usersCount: allusers.length,
      completeCount: completeCount.length,
      dailyCounts,
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
