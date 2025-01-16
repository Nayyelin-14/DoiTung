const { eq } = require("drizzle-orm");

const db = require("../db/db");
const { allcourses, modules, lessons, user_Courses, users } = require("../db");

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await db.select().from(allcourses); // Use "allcourses" as the table name
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
    console.error("Error fetching courses:", error);
    return res.status(500).json({
      isSuccess: false,
      message: "An error occurred.",
    });
  }
};
/////
exports.courseDetail = async (req, res) => {
  try {
    const { courseID } = req.params; // Extract course ID from request params

    // Query course details, related modules, and lessons in a single query
    const courseData = await db
      .select()
      .from(allcourses)
      .leftJoin(modules, eq(modules.courseID, allcourses.course_id))
      .leftJoin(lessons, eq(lessons.moduleID, modules.module_id))
      .where(eq(allcourses.course_id, courseID));

    if (courseData.length === 0) {
      return res.status(404).json({ message: "Course not found" });
    }

    const courseDetails = courseData.reduce(
      (acc, { courses, modules, lessons }) => {
        // Find or create the course entry
        let course = acc.find((item) => item.course_id === courses.course_id);
        if (!course) {
          course = { ...courses, modules: [] };
          acc.push(course);
        }

        // Find or create the module entry for the course
        let module = course.modules.find(
          (item) => item.module_id === modules.module_id
        );
        if (!module) {
          module = { ...modules, lessons: [] };
          course.modules.push(module);
        }

        // Add the lesson to the module

        module.lessons.push(lessons);

        return acc;
      },
      []
    );

    // Log the transformed data
    // console.log(JSON.stringify(transformedData, null, 2));
    return res.status(200).json({
      isSuccess: true,
      courseDetails,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

//////
exports.get_PopularCourses = async (req, res) => {
  console.log("HI"); // Checking if the function is being hit
  try {
    const Popularcourses = await db
      .select({
        course_id: allcourses.course_id,
        course_name: allcourses.course_name,
        course_image_url: allcourses.course_image_url,
        instructor_name: allcourses.instructor_name,
        is_popular: allcourses.is_popular,
        rating: allcourses.rating,
      })
      .from(allcourses)
      .where(eq(allcourses.is_popular, true));
    // Fix the condition: use `=== 0` to check for no results
    if (Popularcourses.length === 0) {
      return res.status(404).json({
        isSuccess: false,
        message: "Not found!!!",
      });
    }

    return res.status(200).json({
      isSuccess: true,
      Popularcourses,
    });
  } catch (error) {
    console.error(error); // Log any errors to check if something is wrong
    return res.status(500).json({
      isSuccess: false,
      message: "An error occurred.",
    });
  }
};
