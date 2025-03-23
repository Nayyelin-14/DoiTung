const { eq, and } = require("drizzle-orm");
const {
  users,
  user_Courses,
  modules,
  lessons,
  allcourses,
  quizzes,
  tests,
  completed_lessons,
} = require("../db");
const db = require("../db/db");

const { firebase } = require("googleapis/build/src/apis/firebase");

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
      const completedLessonsRecord = await db
        .select()
        .from(completed_lessons)
        .where(
          and(
            eq(completed_lessons.user_id, existedEnrollment[0].user_id),
            eq(completed_lessons.course_id, existedEnrollment[0].course_id)
          )
        )
        .limit(1);

      let completedLESSONS = completedLessonsRecord.length
        ? JSON.parse(completedLessonsRecord[0].completedLessons)
        : [];
      // JSON.parse(existingRecord[0].completedLessons) converts the completedLessons string (which is a JSON array) into an actual JavaScript array.
      // console.log("length", completedLESSONS.length);
      // Check if the lessonID exists in the completed_lessons array
      // console.log(completedLESSONS.length);

      // if (completedLESSONS.length === 0) {
      //   return res.status(404).json({
      //     isSuccess: false,
      //     message: "There is no completed lessons",
      //   });
      // }

      return res.status(200).json({
        isSuccess: true,
        existedEnrollment: existedEnrollment[0],
        completedLessonsCount: completedLESSONS.length,
      });
    }
  } catch (error) {
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
      .leftJoin(quizzes, eq(quizzes.moduleID, modules.module_id)) // Join quizzes
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
    const instructor_name = courseData[0].instructor_name;
    const instructor_image = courseData[0].instructor_image;
    const about_instructor = courseData[0].about_instructor;

    const finalTest = await db
      .select()
      .from(tests)
      .where(eq(tests.courseID, courseid));

    const lessonsundermodule = courseData.reduce((acc, item) => {
      const { module_id, module_title, isCompleted } = item.modules;
      const {
        lesson_id,
        lesson_title,
        video_url,
        duration,
        isCompleted: lessoncompleted,
        createdAt,
      } = item.lessons || {}; // Ensure lessons are handled correctly

      const {
        quiz_id,
        title: title,
        createdAt: quiz_createdAt,
      } = item.quizzes || {}; // Extract quiz info

      let module = acc.find((m) => m.module_id === module_id);
      if (!module) {
        module = {
          module_id,
          module_title,
          isCompleted,
          lessons: [],
          quizzes: [], // Add quizzes array
        };
        acc.push(module);
      }

      if (lesson_id && !module.lessons.find((l) => l.lesson_id === lesson_id)) {
        module.lessons.push({
          lesson_id,
          lesson_title,
          video_url,
          duration,
          isCompleted: lessoncompleted,
          createdAt,
        });
      }

      if (quiz_id && !module.quizzes.find((q) => q.quiz_id === quiz_id)) {
        module.quizzes.push({
          quiz_id,
          title,
          createdAt: quiz_createdAt,
        });
      }

      return acc;
    }, []);

    return res.status(200).json({
      isSuccess: true,
      CourseTitle,
      lessonsundermodule,
      finalTest,
      instructor_name,
      instructor_image,
      about_instructor,
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
    return res.status(500).json({
      isSuccess: false,
      message: "An error occurred.",
    });
  }
};

exports.restrictUser = async (req, res) => {
  const { userid } = req.params;
  console.log(userid);
  try {
    const user_doc = await db
      .select()
      .from(users)
      .where(eq(users.user_id, userid));

    if (user_doc.length === 0) {
      return res.status(404).json({
        isSuccess: false,
        message: "User not found!",
      });
    }

    await db
      .update(users)
      .set({ status: "restricted" })
      .where(eq(users.user_id, userid));

    return res.status(200).json({
      isSuccess: true,
      message: "Restricted a user!!!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      isSuccess: false,
      message: "An error occurred.",
    });
  }
};

exports.UnRestrictUser = async (req, res) => {
  const { userid } = req.params;

  try {
    const user_doc = await db
      .select()
      .from(users)
      .where(eq(users.user_id, userid));

    if (user_doc.length === 0) {
      return res.status(404).json({
        isSuccess: false,
        message: "User not found!",
      });
    }

    await db
      .update(users)
      .set({ status: "active" })
      .where(eq(users.user_id, userid));

    return res.status(200).json({
      isSuccess: true,
      message: "Unrestricted a user!!!",
    });
  } catch (error) {
    return res.status(500).json({
      isSuccess: false,
      message: "An error occurred.",
    });
  }
};

exports.removeUser = async (req, res) => {
  const { userid } = req.params;
  console.log(userid);
  try {
    const user_doc = await db
      .select()
      .from(users)
      .where(eq(users.user_id, userid));

    if (user_doc.length === 0) {
      return res.status(404).json({
        isSuccess: false,
        message: "User not found!",
      });
    }

    await db.delete(users).where(eq(users.user_id, userid));

    return res.status(200).json({
      isSuccess: true,
      message: "Removed a user!!!",
    });
  } catch (error) {
    return res.status(500).json({
      isSuccess: false,
      message: "An error occurred.",
    });
  }
};

exports.allUserEnrollments = async (req, res) => {
  try {
    const enrollments = await db
      .select()
      .from(user_Courses)
      .leftJoin(users, eq(users.user_id, user_Courses.user_id))
      .leftJoin(allcourses, eq(allcourses.course_id, user_Courses.course_id));

    const dataItem = enrollments.map((item) => ({
      username: item.users.user_name,
      category: item.courses.category,
      courseName: item.courses.course_name,
      thumbnail: item.courses.course_image_url,
      status: item.user_courses.is_completed,
      progress: item.user_courses.progress,
      enrolledAt: item.user_courses.enrolled_at,
    }));
    if (enrollments.length === 0) {
      return res.status(404).json({
        isSuccess: false,
        message: "No enrollment found.",
      });
    }
    return res.status(200).json({
      isSuccess: true,
      enrollments: dataItem,
    });
  } catch (error) {
    return res.status(500).json({
      isSuccess: false,
      message: "An error occurred.",
    });
  }
};

exports.setProgress = async (req, res) => {
  const { courseID, userID } = req.params;
  const { progress } = req.body;
  console.log("hi", progress);

  try {
    // Ensure required parameters are provided
    if (!courseID || !userID || progress === undefined) {
      return res.status(400).json({
        isSuccess: false,
        message: "Missing required parameters.",
      });
    }

    // Fetch the user's course record
    const userCourseRecords = await db
      .select()
      .from(user_Courses)
      .where(
        and(
          eq(user_Courses.user_id, userID),
          eq(user_Courses.course_id, courseID)
        )
      );

    // Check if the course record exists
    if (userCourseRecords.length === 0) {
      return res.status(404).json({
        isSuccess: false,
        message: "Course record not found.",
      });
    }

    const userCourse = userCourseRecords[0];

    // If course is already completed, return message
    if (userCourse.progress >= 100) {
      return res.status(200).json({
        isSuccess: true,
        message: "You have already completed this course.",
      });
    }

    // Update progress only if it's less than 100
    await db
      .update(user_Courses)
      .set({ progress })
      .where(
        and(
          eq(user_Courses.user_id, userID),
          eq(user_Courses.course_id, courseID)
        )
      );

    return res.status(200).json({
      isSuccess: true,
      message: "Progress updated successfully.",
    });
  } catch (error) {
    console.error("Error updating progress:", error);
    return res.status(500).json({
      isSuccess: false,
      message: "An error occurred. Please try again.",
    });
  }
};
