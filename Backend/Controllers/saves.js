const { and, eq } = require("drizzle-orm");
const { savedcourse, allcourses } = require("../db");
const db = require("../db/db");

exports.savetowatch = async (req, res) => {
  const { courseID, userID } = req.params;

  try {
    if (!courseID || !userID) {
      throw new Error("Something went wrong");
    }
    await db.insert(savedcourse).values({
      user_id: userID,
      course_id: courseID,
    });

    return res.status(200).json({
      isSuccess: true,
      message: "Saved this course to watch later",
    });
  } catch (error) {
    return res.status(500).json({
      isSuccess: false,
      message: "An error occurred.",
    });
  }
};

exports.checksaves = async (req, res) => {
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
      return res.status(200).json({
        isSuccess: true,
        savedCourse: checkSaved[0],
      });
    }
  } catch (error) {
    return res.status(400).json({
      isSuccess: false,
      message: error.message,
    });
  }
};

exports.getSavedCourses = async (req, res) => {
  try {
    const { userID } = req.params;
    if (!userID) {
      throw new Error("Something went wrong");
    }

    // Check if user is already enrolled in the course
    const savecourses = await db
      .select()
      .from(savedcourse)
      .innerJoin(allcourses, eq(savedcourse.course_id, allcourses.course_id))
      .where(eq(savedcourse.user_id, userID));

    if (savecourses.length === 0) {
      return res.status(400).json({
        isSuccess: false,
        message: "There is no saved courses",
      });
    }
    const courseData = savecourses.map((coursedata) => coursedata.courses);

    return res.status(200).json({
      isSuccess: true,
      savecourses: courseData,
    });
  } catch (error) {
    return res.status(400).json({
      isSuccess: false,
      message: error.message,
    });
  }
};

exports.deleteSavedCourses = async (req, res) => {
  try {
    const { userID, courseID } = req.params;

    if (!userID) {
      throw new Error("Something went wrong");
    }
    if (!courseID) {
      throw new Error("Something went wrong");
    }
    // Check if user is already enrolled in the course
    const result = await db
      .delete(savedcourse)
      .where(
        and(
          eq(savedcourse.user_id, userID),
          eq(savedcourse.course_id, courseID)
        )
      );

    if (result.length > 0) {
      return res.status(200).json({
        isSuccess: true,
        message: "Seleted course was removed successfully!!!",
      });
    } else {
      throw new Error("Remove failed for reasons");
    }
  } catch (error) {
    return res.status(400).json({
      isSuccess: false,
      message: error.message,
    });
  }
};
