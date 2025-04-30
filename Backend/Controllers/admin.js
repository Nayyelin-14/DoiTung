const { eq, and } = require("drizzle-orm");
const {
  allcourses,
  modules,
  lessons,
  quizzes,
  tests,
  user_Courses,
  users,
  userReports,
  completed_lessons,
  certificates,
  user_attempts,
  test_status,
} = require("../db");
const db = require("../db/db");

exports.courseDetail = async (req, res) => {
  try {
    const { courseID } = req.params; // Extract course ID from request params

    // Query course details, related modules, lessons, quizzes, and tests in a single query
    const courseData = await db
      .select()
      .from(allcourses)
      .leftJoin(modules, eq(modules.courseID, allcourses.course_id))
      .leftJoin(lessons, eq(lessons.moduleID, modules.module_id))
      .leftJoin(quizzes, eq(quizzes.moduleID, modules.module_id))
      .leftJoin(tests, eq(tests.courseID, allcourses.course_id))
      .leftJoin(user_Courses, eq(user_Courses.course_id, courseID))
      .leftJoin(users, eq(users.user_id, user_Courses.user_id))
      .where(eq(allcourses.course_id, courseID));

    const enrollmentDatas = await db
      .select()
      .from(user_Courses)
      .leftJoin(users, eq(users.user_id, user_Courses.user_id))

      .where(eq(user_Courses.course_id, courseID));

    const enrolledUsers = enrollmentDatas.map((data) => ({
      user_id: data.users.user_id,
      username: data.users.user_name,
      role: data.users.role,
      user_status: data.users.status,
      user_profileImage: data.user_profileImage,
      is_completed: data.user_courses.is_completed,
      progress: data.user_courses.progress,
      enrolled_at: data.user_courses.enrolled_at,
    }));

    if (courseData.length === 0) {
      return res.status(400).json({ message: "Course not found" });
    }
    const courseDetails = courseData.reduce(
      (acc, { courses, modules, lessons, quizzes, tests }) => {
        // Find or create the course entry
        let course = acc.find((item) => item.course_id === courses.course_id);
        if (!course) {
          course = { ...courses, modules: [], tests: [], user_courses: [] };
          acc.push(course);
        }

        // Find or create the module entry for the course
        let module = course.modules.find(
          (item) => item.module_id === modules.module_id
        );
        if (!module) {
          module = { ...modules, lessons: [], quizzes: [] };
          course.modules.push(module);
        }

        // Add the lesson to the module if it exists
        if (lessons) {
          module.lessons.push(lessons);
        }

        // Add the quiz to the module if it exists
        if (quizzes) {
          module.quizzes.push(quizzes);
        }

        // Add the test to the course if it exists and is not already added
        if (tests) {
          const testExists = course.tests.some(
            (test) => test.test_id === tests.test_id
          );
          if (!testExists) {
            course.tests.push(tests);
          }
        }

        return acc;
      },
      []
    );

    const allLessons = courseDetails[0].modules.flatMap(
      (module) => module.lessons
    );

    const totalLessons = allLessons.length;

    const allQuizzes = courseDetails[0].modules.flatMap(
      (module) => module.quizzes
    );
    const totalQuizzes = allQuizzes.length;

    return res.status(200).json({
      isSuccess: true,
      details: courseDetails[0],
      totalLessonsCount: totalLessons,
      totalQuizzesCount: totalQuizzes,
      enrolledUsers,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

//
exports.removeEnrolledUser = async (req, res) => {
  try {
    const { userid, courseid } = req.params;

    if (!userid) {
      throw new Error("User ID is required!!!");
    }
    if (!courseid) {
      throw new Error("Course ID is required!!!");
    }

    const existedUser = await db
      .select()
      .from(user_Courses)
      .where(
        and(
          eq(user_Courses.user_id, userid),
          eq(user_Courses.course_id, courseid)
        )
      );

    if (existedUser.length === 0) {
      throw new Error("User doesn't exist!!!");
    }

    await db
      .delete(user_Courses)
      .where(
        and(
          eq(user_Courses.user_id, userid),
          eq(user_Courses.course_id, courseid)
        )
      );
    await db
      .delete(completed_lessons)
      .where(
        and(
          eq(completed_lessons.user_id, userid),
          eq(completed_lessons.course_id, courseid)
        )
      );
    await db
      .delete(certificates)
      .where(
        and(
          eq(certificates.userID, userid),
          eq(certificates.courseID, courseid)
        )
      );

    await db
      .delete(user_attempts)
      .where(
        and(
          eq(user_attempts.userID, userid),
          eq(user_attempts.courseID, courseid)
        )
      );

      await db
      .delete(test_status)
      .where(
        and(
          eq(test_status.userID, userid),
          eq(test_status.courseID, courseid)
        )
      );

    return res.status(200).json({
      isSuccess: true,
      message: `Removed a user from this course`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.sendReport = async (req, res) => {
  try {
    const { user_id, subject, contents } = req.body;
    const admin_id = req.userID;

    // Validate input
    if (!user_id || !subject || !contents) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Insert report into the database
    await db.insert(userReports).values({
      subject,
      contents,
      user_id,
      admin_id,
    });

    return res
      .status(201)
      .json({ success: true, message: "Report sent successfully!" });
  } catch (error) {
    console.error("Error sending report:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
