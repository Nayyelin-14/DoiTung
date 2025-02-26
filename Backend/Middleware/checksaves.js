const { and, eq } = require("drizzle-orm");
const { user_Courses, savedcourse } = require("../db");
const db = require("../db/db");

exports.CheckSavedCourse = async (req, res, next) => {
  try {
    const { userID, courseID } = req.params;
    if (!userID || !courseID) {
      throw new Error("Something went wrong");
    }

    // Check if user is already enrolled in the course
    const checkSaved = await db
      .select()
      .from(savedcourse)
      .where(
        and(
          eq(savedcourse.user_id, userID),
          eq(savedcourse.course_id, courseID)
        )
      );

    if (checkSaved.length > 0) {
      throw new Error("You have already save in this course");
    }

    next();
  } catch (error) {
    return res.status(400).json({
      isSuccess: false,
      message: error.message,
    });
  }
};
