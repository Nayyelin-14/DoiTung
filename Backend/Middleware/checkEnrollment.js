const { and, eq } = require("drizzle-orm");
const { user_Courses } = require("../db");
const db = require("../db/db");

exports.CheckEnrollment = async (req, res, next) => {
  try {
    const { userid, courseid } = req.params;
    if (!userid) {
      return res.status(400).json({
        isSuccess: false,
        message: "User not found",
      });
    }
    if (!courseid) {
      return res.status(400).json({
        isSuccess: false,
        message: "Course not found",
      });
    }

    // Check if user is already enrolled in the course
    const existedEnrollment = await db
      .select()
      .from(user_Courses)
      .where(
        and(
          eq(user_Courses.user_id, userid),
          eq(user_Courses.course_id, courseid)
        )
      );

    if (existedEnrollment.length > 0) {
      throw new Error("You have already enrolled in this course");
    }

    next();
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      isSuccess: false,
      message: error.message,
    });
  }
};
