const { eq } = require("drizzle-orm");
const cloudinary = require("../Action/cloudinary");
const db = require("../db/db");
const { allcourses, modules, lessons } = require("../db");
const { courseSchema, moduleSchema } = require("../types/EduSchema");

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

exports.createCourse = async (req, res) => {
  const { title, description, category, overview } = req.body;
  const thumbnail = req.files?.thumbnail;
  const courseDemo = req.files?.courseDemo;

  let secureThumnbUrlArray = "";
  let secureDemoUrlArray = "";
  try {
    // Validate input using Zod schema
    const parsedData = courseSchema.safeParse({
      title,
      description,
      category,
      thumbnail,
      overview,
      courseDemo,
    });

    if (!parsedData.success) {
      return res.status(400).json({
        isSuccess: false,
        message: "Validation failed.",
        errors: parsedData.error.errors, // Return detailed validation errors
      });
    }
    const uploadPromises = [];

    // Handle thumbnail upload
    if (thumbnail) {
      const thumbnailUpload = new Promise((resolve, reject) => {
        cloudinary.uploader.upload(thumbnail[0].path, (err, result) => {
          if (err) {
            reject(new Error("Cloud upload failed for thumbnail."));
          } else {
            secureThumnbUrlArray = result.secure_url;
            resolve();
          }
        });
      });
      uploadPromises.push(thumbnailUpload);
    }

    // Handle course demo upload if necessary
    if (courseDemo) {
      const courseDemoUpload = new Promise((resolve, reject) => {
        cloudinary.uploader.upload(
          courseDemo[0].path,
          { resource_type: "video" },
          (err, result) => {
            if (err) {
              console.error("Cloud upload failed for course demo:", err); // Improved error logging
              reject(new Error("Cloud upload failed for course demo."));
            } else {
              secureDemoUrlArray = result.secure_url;
              resolve();
            }
          }
        );
      });
      uploadPromises.push(courseDemoUpload);
    }

    // Wait for all uploads to complete
    await Promise.all(uploadPromises);

    if (
      title &&
      description &&
      category &&
      overview &&
      thumbnail &&
      courseDemo
    ) {
      if (!secureDemoUrlArray) {
        return res.status(400).json({
          isSuccess: false,
          message: "Course demo video upload failed.",
        });
      }
      if (!secureThumnbUrlArray) {
        return res.status(400).json({
          isSuccess: false,
          message: "Thumbnail upload failed.",
        });
      }
      const NewCourse = await db
        .insert(allcourses)
        .values({
          course_name: title,
          course_description: description,
          course_image_url: secureThumnbUrlArray,
          demo_URL: secureDemoUrlArray,
          instructor_name: "Aung Aung",
          category: category,
          overview: overview,
        })
        .$returningId();

      return res.status(200).json({
        isSuccess: true,
        message: "New Course Created!!!",
        NewCourse,
      });
    } else {
      return res.status(400).json({
        isSuccess: false,
        message: "Failed to create new course!!!",
      });
    }
  } catch (error) {
    return res.status(500).json({
      isSuccess: false,
      message: "An error occurred.",
    });
  }
};

exports.createModule = async (req, res) => {
  const { courseID, module_title } = req.body;
  console.log(courseID, module_title);

  try {
    const parsedData = moduleSchema.safeParse({
      courseID,
      module_title,
    });

    if (!parsedData.success) {
      return res.status(400).json({
        isSuccess: false,
        message: "Validation failed.",
        errors: parsedData.error.errors, // Return detailed validation errors
      });
    }

    // Step 1: Insert the module
    await db.insert(modules).values({
      courseID: courseID,
      module_title: module_title,
    });

    // Step 2: Retrieve the last inserted ID
    const newModuleID = await db
      .select()
      .from(modules)
      .where(eq(modules.courseID, courseID)); // Limit to 1 to ensure we get the last inserted module

    if (newModuleID && newModuleID.length > 0) {
      return res.status(200).json({
        isSuccess: true,
        message: "New module created",
        newModule: newModuleID[0], // Send the first record if it exists
      });
    } else {
      return res.status(400).json({
        isSuccess: false,
        message: "Module creation failed: Unable to retrieve the module.",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      isSuccess: false,
      message: "An error occurred in creating new module.",
    });
  }
};
