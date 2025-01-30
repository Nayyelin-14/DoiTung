const { eq, and } = require("drizzle-orm");
const { users, user_Courses, modules, lessons, allcourses } = require("../db");
const db = require("../db/db");

exports.getallusers = async (req, res) => {
  try {
    const allusers = await db.select().from(users);
    if (allusers.length === 0) {
      return res.status(404).json({
        isSuccess: false,
        message: "No user found!!!",
      });
    }

    return res.status(200).json({
      isSuccess: true,
      message: "Users found",
      allusers,
    });
  } catch (error) {
    return res.status(404).json({
      isSuccess: false,
      message: error.message,
    });
  }
};

exports.EnableTwoStep = async (req, res) => {
  const { isTwostepEnabled, email, userID } = req.body;
  console.log(userID);

  try {
    const userDoc = await db
      .select()
      .from(users)
      .where(eq(users.user_id, userID));

    // Check if the user exists
    if (userDoc.length === 0) {
      return res.status(404).json({
        isSuccess: false,
        message: "User not found. Something went wrong.",
      });
    }

    // Update the two-step verification status
    await db
      .update(users)
      .set({ isTwostepEnabled: isTwostepEnabled })
      .where(eq(users.user_id, userID));

    // Check if two-step verification is enabled or disabled
    if (isTwostepEnabled === true || isTwostepEnabled === "true") {
      return res.status(200).json({
        isSuccess: "enabled",
        message: "Two-step verification enabled.",
      });
    }
    if (isTwostepEnabled === false || isTwostepEnabled === "false") {
      return res.status(200).json({
        isSuccess: "disabled",
        message: "Two-step verification disabled.",
      });
    }

    // If the value is neither true nor false
    return res.status(400).json({
      isSuccess: false,
      message: "Invalid value for two-step verification.",
    });
  } catch (error) {
    return res.status(400).json({
      isSuccess: false,
      message: error.message,
    });
  }
};

exports.Enrollment = async (req, res) => {
  const { userid, courseid } = req.params;
  console.log(userid, courseid);
  try {
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
    await db.insert(user_Courses).values({
      user_id: userid,
      course_id: courseid,
    });

    return res.status(200).json({
      isSuccess: true,
      message: "Enrolled this course successfully",
    });
  } catch (error) {
    return res.status(400).json({
      isSuccess: false,
      message: error.message,
    });
  }
};

exports.CheckEnrolledCourse = async (req, res) => {
  try {
    const { userid, courseid } = req.params;
    console.log("heelo", userid, courseid);
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
      return res.status(200).json({
        isSuccess: true,
        existedEnrollment: existedEnrollment[0],
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      isSuccess: false,
      message: error.message,
    });
  }
};

exports.CourseToLearn = async (req, res) => {
  const { userid, courseid } = req.params;
  try {
    const courseData = await db
      .select()
      .from(user_Courses)
      .leftJoin(allcourses, eq(allcourses.course_id, user_Courses.course_id))
      .leftJoin(modules, eq(modules.courseID, user_Courses.course_id))
      .leftJoin(lessons, eq(lessons.moduleID, modules.module_id))
      .where(
        and(
          eq(user_Courses.course_id, courseid),
          eq(user_Courses.user_id, userid)
        )
      );

    if (courseData.length === 0) {
      return res.status(404).json({
        isSuccess: false,
        message: "Course not found",
      });
    }

    const CourseTitle = courseData[0].courses.course_name;

    const lessonsundermodule = courseData.reduce((acc, item) => {
      const { module_id, module_title, isCompleted } = item.modules;
      const {
        lesson_id,
        lesson_title,
        video_url,
        duration,
        isCompleted: lessoncompleted,
        createdAt,
      } = item.lessons;

      let module = acc.find((m) => m.module_id === module_id);
      if (!module) {
        module = {
          module_id,
          module_title,
          isCompleted,
          lessons: [],
        };
        acc.push(module);
      }

      module.lessons.push({
        lesson_id,
        lesson_title,
        video_url,
        duration,
        isCompleted: lessoncompleted,
        createdAt,
      });
      return acc;
    }, []);
    return res.status(200).json({
      isSuccess: true,
      CourseTitle,
      lessonsundermodule,
    });
  } catch (error) {
    return res.status(400).json({
      isSuccess: false,
      message: error.message,
    });
  }
};

exports.getEnrolledCourses = async (req, res) => {
  try {
    const { userid } = req.params;

    if (!userid) {
      return res.status(400).json({
        isSuccess: false,
        message: "User ID is required",
      });
    }

    //Fetch
    const enrolledCourses = await db
      .select({
        course_id: allcourses.course_id,
        course_name: allcourses.course_name,
        course_image_url: allcourses.course_image_url,
        instructor_name: allcourses.instructor_name,
        rating: allcourses.rating,
      })
      .from(user_Courses)
      .leftJoin(allcourses, eq(allcourses.course_id, user_Courses.course_id))
      .where(eq(user_Courses.user_id, userid));

    if (enrolledCourses.length === 0) {
      return res.status(404).json({
        isSuccess: false,
        message: "No enrolled courses found",
      });
    }

    return res.status(200).json({
      isSuccess: true,
      enrolledCourses,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      isSuccess: false,
      message: "An error occurred.",
    });
  }
};
