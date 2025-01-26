const { eq } = require("drizzle-orm");
const { draftCourse, allcourses, users } = require("../db");
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
    console.log(draftCourse);
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
