const { eq } = require("drizzle-orm");
const {
  allcourses,
  modules,
  lessons,
  quizzes,
  tests,
  user_Courses,
  users,
} = require("../db");
const db = require("../db/db");

exports.courseDetail = async (req, res) => {
  try {
    const { courseID } = req.params; // Extract course ID from request params
    console.log(courseID);
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
      return res.status(404).json({ message: "Course not found" });
    }
    // console.log(courseData[0]);
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

    // console.log(courseDetails[0]);
    // Calculate total lessons and quizzes
    // const allModules = courseDetails[0].flatMap((cd) => cd.modules);
    // console.log("addmodule", allModules);
    // const totalModules = allModules.length;

    console.log(enrolledUsers);
    const allLessons = courseDetails[0].modules.flatMap(
      (module) => module.lessons
    );
    // console.log(allLessons);
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
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.removeEnrolledUser = async (req, res) => {
  try {
    const { userid } = req.params;

    if (!userid) {
      throw new Error("User ID is required!!!");
    }

    const existedUser = await db
      .select()
      .from(user_Courses)
      .where(eq(user_Courses.user_id, userid));

    if (existedUser.length === 0) {
      throw new Error("User doesn't exist!!!");
    }
    await db.delete(user_Courses).where(eq(user_Courses.user_id, userid));

    return res.status(200).json({
      isSuccess: true,
      message: `Removed a user from this course`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
