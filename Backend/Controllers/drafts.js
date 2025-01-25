const { eq, and } = require("drizzle-orm");
const { allcourses, draftCourse } = require("../db");
const db = require("../db/db");

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await db
      .select()
      .from(allcourses)
      .orderBy("createdAt", "desc"); // Use "allcourses" as the table name
    if (!courses || courses.length === 0) {
      return res.status(404).json({
        isSuccess: false,
        message: "Courses not found!",
      });
    }
    return res.status(200).json({
      isSuccess: true,
      courses, // Send the fetched courses
    });
  } catch (error) {
    return res.status(500).json({
      isSuccess: false,
      message: "An error occurred.",
    });
  }
};
exports.saveAsDraft = async (req, res) => {
  const { userID, courseID } = req.params;

  try {
    await db
      .update(allcourses)
      .set({ status: "draft" })
      .where(eq(allcourses.course_id, courseID));

    const updateDrafts = await db.insert(draftCourse).values({
      userID: userID,
      courseID: courseID,
    });
    if (updateDrafts.length === 0) {
      return res.status(400).json({
        isSuccess: false,
        message: "Filed to save as draft",
      });
    }
    return res.status(200).json({
      isSuccess: true,
      message: "Saved as draft",
      draftcourse: updateDrafts,
    });
  } catch (error) {
    return res.status(404).json({
      isSuccess: false,
      message: "Error occured while saving as draft",
    });
  }
};

exports.saveAsCompleted = async (req, res) => {
  const { userID, courseID } = req.params;

  try {
    await db
      .update(allcourses)
      .set({ status: "completed" })
      .where(eq(allcourses.course_id, courseID));

    const deleteDrafts = await db
      .delete(draftCourse)
      .where(
        and(eq(draftCourse.userID, userID), eq(draftCourse.courseID, courseID))
      );
    if (deleteDrafts.affectedRows === 0) {
      return res.status(400).json({
        isSuccess: false,
        message: "Filed to save as a completed course",
      });
    }
    return res.status(200).json({
      isSuccess: true,
      message: "Saved as a completed course",
    });
  } catch (error) {
    return res.status(404).json({
      isSuccess: false,
      message: "Error occured while saving as draft",
    });
  }
};

exports.getOldCourseDetails = async (req, res) => {
  const { courseId, userId } = req.params;
  console.log(courseId, userId);
  try {
    const completedCourses = await db
      .select()
      .from(allcourses)
      .where(eq(allcourses.course_id, courseId));

    if (completedCourses.length === 0) {
      return res.status(404).json({
        isSuccess: false,
        message: "Course not found!",
      });
    }
    return res.status(200).json({
      isSuccess: true,
      course: completedCourses[0],
    });
  } catch (error) {
    return res.status(500).json({
      isSuccess: false,
      message: "An error occurred.",
    });
  }
};
