const { eq, and } = require("drizzle-orm");
const { getVideoDurationInSeconds } = require("get-video-duration");
const {
  courseSchema,
  moduleSchema,
  lessonSchema,
} = require("../types/EduSchema");
///somethinbg

const cloudinary = require("../Action/cloudinary");

const db = require("../db/db");

const {
  allcourses,
  modules,
  lessons,
  userCompletedLessons,
  user_Courses,
  completed_lessons,
  quizzes,
  tests,
  savedcourse,
} = require("../db");

exports.getCourses = async (req, res) => {
  try {
    const courses = await db
      .select()
      .from(allcourses)
      .where(eq(allcourses.status, "completed"))
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
/////
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
      .where(eq(allcourses.course_id, courseID));

    if (courseData.length === 0) {
      return res.status(404).json({ message: "Course not found" });
    }

    const courseDetails = courseData.reduce(
      (acc, { courses, modules, lessons, quizzes, tests }) => {
        // Find or create the course entry
        let course = acc.find((item) => item.course_id === courses.course_id);
        if (!course) {
          course = { ...courses, modules: [], tests: [] };
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

    // Calculate total lessons and quizzes
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
      courseDetails,
      totalLessonsCount: totalLessons,
      totalQuizzesCount: totalQuizzes,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
//////
exports.get_PopularCourses = async (req, res) => {
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
    return res.status(500).json({
      isSuccess: false,
      message: "An error occurred.",
    });
  }
};

exports.createCourse = async (req, res) => {
  const {
    title,
    description,
    category,
    overview,
    course_id,
    about_instructor,
    instructor_name,
  } = req.body;

  const thumbnail = req.files?.thumbnail
    ? req.files.thumbnail[0].path
    : req.body.thumbnail;
  const courseDemo = req.files?.courseDemo
    ? req.files.courseDemo[0].path
    : req.body.courseDemo;
  const instructor_image = req.files?.instructor_image
    ? req.files.instructor_image[0].path
    : req.body.instructor_image;
  let secureThumnbUrlArray = "";
  let secureDemoUrlArray = "";
  let secureInstructor_imgUrlArray = "";
  try {
    // Validate input using Zod schema
    // const parsedData = courseSchema.safeParse({
    //   course_id: course_id,
    //   course_name: title,
    //   course_description: description,
    //   category,
    //   course_image_url: thumbnail,
    //   overview,
    //   demo_URL: courseDemo,
    //   instructor_name: "Aung aung",
    // });
    // if (!parsedData.success) {
    //   return res.status(400).json({
    //     isSuccess: false,
    //     message: "Validation failed.",
    //     errors: parsedData.error.errors, // Return detailed validation errors
    //   });
    // }
    const uploadPromises = [];
    // Handle thumbnail upload
    if (thumbnail) {
      const thumbnailUpload = new Promise((resolve, reject) => {
        cloudinary.uploader.upload(thumbnail, (err, result) => {
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
    if (instructor_image) {
      const instructor_imageUpload = new Promise((resolve, reject) => {
        cloudinary.uploader.upload(instructor_image, (err, result) => {
          if (err) {
            reject(new Error("Cloud upload failed for thumbnail."));
          } else {
            secureInstructor_imgUrlArray = result.secure_url;
            resolve();
          }
        });
      });
      uploadPromises.push(instructor_imageUpload);
    }
    // Handle course demo upload if necessary
    if (courseDemo) {
      const courseDemoUpload = new Promise((resolve, reject) => {
        cloudinary.uploader.upload(
          courseDemo,
          { resource_type: "video" },
          (err, result) => {
            if (err) {
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

    if (
      title &&
      description &&
      category &&
      overview &&
      thumbnail &&
      courseDemo &&
      course_id &&
      instructor_image &&
      instructor_name &&
      about_instructor
    ) {
      const existedCourse = await db
        .select()
        .from(allcourses)
        .where(eq(allcourses.course_id, course_id));
      if (existedCourse.length === 0) {
        return res.status(400).json({
          isSuccess: false,
          message: "Course not found",
        });
      }
      await db
        .update(allcourses)
        .set({
          course_name: title,
          course_description: description,
          course_image_url: secureThumnbUrlArray,
          demo_URL: secureDemoUrlArray,
          instructor_name,
          instructor_image: secureInstructor_imgUrlArray,
          about_instructor,
          category: category,
          overview: overview,
        })
        .where(eq(allcourses.course_id, course_id));

      return res.status(200).json({
        isSuccess: true,
        message: "Course updated",
        updateCourse: existedCourse[0].course_id,
      });
    }
    if (
      title &&
      description &&
      category &&
      overview &&
      thumbnail &&
      courseDemo &&
      instructor_name &&
      instructor_image &&
      about_instructor
    ) {
      const NewCourse = await db
        .insert(allcourses)
        .values({
          course_name: title,
          course_description: description,
          course_image_url: secureThumnbUrlArray,
          demo_URL: secureDemoUrlArray,
          instructor_name,
          instructor_image: secureInstructor_imgUrlArray,
          about_instructor,
          category: category,
          overview: overview,
          rating: 0,
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
      message: error.message,
    });
  }
};

exports.createModule = async (req, res) => {
  const { courseID, module_title } = req.body;

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

    // Retrieve all modules for this course
    const allModules = await db
      .select()
      .from(modules)
      .where(eq(modules.courseID, courseID));

    if (allModules && allModules.length > 0) {
      return res.status(200).json({
        isSuccess: true,
        message: "New module created",
        allModules,
      });
    } else {
      return res.status(400).json({
        isSuccess: false,
        message: "Module creation failed: Unable to retrieve the module.",
      });
    }
  } catch (error) {
    return res.status(400).json({
      isSuccess: false,
      message: "An error occurred in creating new module.",
    });
  }
};

exports.createLesson = async (req, res) => {
  const { moduleID, lesson_title } = req.body;
  let secureLessonUrl = "";
  const lesson_content = req.files?.lesson_content;

  try {
    const moduleExists = await db
      .select()
      .from(modules)
      .where(eq(modules.module_id, moduleID)); // Use the correct field for the ID

    if (moduleExists.length === 0) {
      return res.status(400).json({
        isSuccess: false,
        message: "Module not found.",
      });
    }
    //Validation
    // const parsedData = lessonSchema.safeParse({
    //   moduleID,
    //   lesson_title,
    //   video_url: lesson_content[0].path,
    // });

    // if (!parsedData.success) {
    //   return res.status(400).json({
    //     isSuccess: false,
    //     message: "Validation failed.",
    //     errors: parsedData.error.errors,
    //   });
    // }

    if (!lesson_content || !lesson_content[0]?.path) {
      return res.status(400).json({
        isSuccess: false,
        message: "Lesson content file is missing.",
      });
    }

    try {
      await new Promise((resolve, reject) => {
        cloudinary.uploader.upload(
          lesson_content[0].path,
          { resource_type: "video" },
          (err, result) => {
            if (err) {
              console.error("Cloud upload failed for course demo:", err); // Improved error logging
              reject(new Error("Cloud upload failed for course demo."));
            } else {
              secureLessonUrl = result.secure_url;
              resolve();
            }
          }
        );
      });
    } catch (error) {
      return res.status(500).json({
        isSuccess: false,
        message: "Lesson video upload failed.",
      });
    }

    if (!secureLessonUrl) {
      return res.status(400).json({
        isSuccess: false,
        message: "Lesson video upload failed.",
      });
    }
    let lessonduration = "";
    try {
      lessonduration = await getVideoDurationInSeconds(secureLessonUrl);
    } catch (error) {
      console.error("Error getting video duration:", error);
    }

    // Insert the lesson into the lessons table
    await db.insert(lessons).values({
      moduleID: moduleID,
      lesson_title: lesson_title,
      video_url: secureLessonUrl,
      duration: lessonduration,
    });

    // Retrieve all lessons for the specific module
    const allLessons = await db
      .select()
      .from(lessons)
      .where(eq(lessons.moduleID, moduleID));

    return res.status(200).json({
      isSuccess: true,
      message: "Lesson created successfully",
      lessons: allLessons, // Return all lessons for the specific module
    });
  } catch (error) {
    return res.status(400).json({
      isSuccess: false,
      message: "An error occurred while creating the lesson.",
    });
  }
};

exports.getAllModules = async (req, res) => {
  const { courseId } = req.params;
  try {
    const fetchedModules = await db
      .select()
      .from(modules)
      .where(eq(modules.courseID, courseId))
      .orderBy(modules.createdAt, "desc");

    if (!modules || modules.length === 0) {
      return res.status(404).json({
        isSuccess: false,
        message: "modules not found!",
      });
    }
    return res.status(200).json({
      isSuccess: true,
      modules: fetchedModules, // Send the fetched courses
    });
  } catch (error) {
    return res.status(500).json({
      isSuccess: false,
      message: "An error occurred.",
    });
  }
};

exports.getAllLessons = async (req, res) => {
  const { courseId, moduleId } = req.params;

  // Ensure moduleId is provided
  if (!moduleId) {
    return res.status(400).json({
      isSuccess: false,
      message: "Module ID is required.",
    });
  }

  try {
    // Fetch lessons for the specified course and module ID
    const fetchedLessonsWithModule = await db
      .select()
      .from(lessons)
      .innerJoin(modules, eq(lessons.moduleID, modules.module_id)) // Join lessons with modules
      .where(eq(modules.module_id, moduleId) && eq(modules.courseID, courseId)) // Combine both conditions in one where clause
      .orderBy(lessons.createdAt, "desc");

    // If no lessons are found
    if (!fetchedLessonsWithModule || fetchedLessonsWithModule.length === 0) {
      return res.status(404).json({
        isSuccess: false,
        message: "No lessons found for the specified module.",
      });
    }
    // Group lessons by module
    const lessonsByModule = {};

    fetchedLessonsWithModule.forEach((item) => {
      const { module_id, module_title } = item.modules;

      if (!lessonsByModule[module_id]) {
        lessonsByModule[module_id] = {
          module_id,
          module_title,
          lessons: [],
        };
      }

      lessonsByModule[module_id].lessons.push(item.lessons);
    });

    // Send successful response with fetched lessons
    return res.status(200).json({
      isSuccess: true,

      lessons: lessonsByModule,
    });
  } catch (error) {
    // Send error response for internal server errors
    return res.status(500).json({
      isSuccess: false,
      message: "An internal server error occurred. Please try again later.",
    });
  }
};

// INNER JOIN only returns rows where there is a matching relationship between the lessons, modules, and allcourses tables.
// In this context, you want lessons that are associated with a specific module and course. If there is no corresponding relationship between these tables, there is no reason to include the lesson in the result.
// Filters Out Missing Data:

// If a lesson exists but is not linked to a module or a module is not linked to a course, these entries are likely invalid for your application logic. Using INNER JOIN filters out such invalid data.
// Cleaner Results:

// Since you need lessons that belong to a specific course and module, INNER JOIN ensures the result set only includes data where all three relationships (lesson -> module -> course) exist.

exports.removeCreatedLesson = async (req, res) => {
  try {
    const { lessonID, moduleID } = req.params;
    if (!lessonID || !moduleID) {
      return res.status(400).json({ isSuccess: false, message: "Not found" });
    }

    // First, retrieve the lesson data from the database to get the Cloudinary public_id
    const lesson = await db
      .select()
      .from(lessons)
      .where(
        and(eq(lessons.lesson_id, lessonID), eq(lessons.moduleID, moduleID))
      );
    if (lesson.length === 0) {
      return res
        .status(404)
        .json({ isSuccess: false, message: "Lesson not found." });
    }

    // Assuming your database has a column to store Cloudinary public_id of the uploaded lesson URL
    const lessonURL = lesson[0].video_url;

    const deleteURL = lessonURL.substring(
      lessonURL.lastIndexOf("/") + 1,
      lessonURL.lastIndexOf(".")
    );
    if (deleteURL) {
      try {
        await new Promise((resolve, reject) => {
          cloudinary.uploader.destroy(
            deleteURL,
            { resource_type: "video" },
            (err, result) => {
              if (err) {
                console.error("Cloud delete failed for lesson url:", err); // Improved error logging
                reject(new Error("Cloud delete failed for lesson url."));
              } else {
                resolve();
                console.log(result);
              }
            }
          );
        });
      } catch (error) {
        return res.status(500).json({
          isSuccess: false,
          message: "Lesson video deletion failed.",
        });
      }
    }

    await db
      .delete(lessons)
      .where(
        and(eq(lessons.lesson_id, lessonID), eq(lessons.moduleID, moduleID))
      );

    return res
      .status(200)
      .json({ isSuccess: true, message: "Selected Lesson deleted." });
  } catch (error) {
    return res.status(500).json({
      isSuccess: false,
      message: "An error occurred while deleting the lesson.",
    });
  }
};

exports.setLessonCompleted = async (req, res) => {
  const { courseID, userID, lessonID } = req.params;

  try {
    if (!courseID || !userID || !lessonID) {
      throw new Error("Something went wrong");
    }
    const existingRecord = await db
      .select()
      .from(completed_lessons)
      .where(
        and(
          eq(completed_lessons.user_id, userID),
          eq(completed_lessons.course_id, courseID)
        )
      )
      .limit(1);
    let completedLESSONS = existingRecord.length
      ? JSON.parse(existingRecord[0].completedLessons)
      : [];
    const lessonExists = completedLESSONS.includes(lessonID);

    if (lessonExists) {
      return res.status(200).json({
        isCompleted: true,
        message: "This lesson has already completed",
      });
    }
    // console.log(lessonExists);
    // Add the lesson ID to the completed lessons array (avoid duplicates)
    if (!lessonExists) {
      completedLESSONS.push(lessonID);
      if (existingRecord.length > 0) {
        await db
          .update(completed_lessons)
          .set({
            completedLessons: JSON.stringify(completedLESSONS),
            updated_at: new Date(),
          })
          .where(
            and(
              eq(completed_lessons.user_id, userID),
              eq(completed_lessons.course_id, courseID)
            )
          );
      } else {
        // If no record exists, insert a new one
        await db.insert(completed_lessons).values({
          user_id: userID,
          course_id: courseID,
          completedLessons: JSON.stringify(completedLESSONS),
          createdAt: new Date(),
          updated_at: new Date(),
        });
      }

      return res.status(200).json({
        isCompleted: true,
        message: "This lesson has taken as completed",
      });
    }
  } catch (error) {
    return res.status(500).json({
      isSuccess: false,
      message: error.message,
    });
  }
};

exports.getAllCompletedLessons = async (req, res) => {
  const { userID, courseID } = req.params;
  try {
    const existingRecord = await db
      .select()
      .from(completed_lessons)
      .where(
        and(
          eq(completed_lessons.user_id, userID),
          eq(completed_lessons.course_id, courseID)
        )
      )
      .limit(1);

    let completedLESSONS = existingRecord.length
      ? JSON.parse(existingRecord[0].completedLessons)
      : [];

    if (completedLESSONS.length === 0) {
      return res.status(404).json({
        isSuccess: false,
        message: "There is no completed lessons",
      });
    }
    return res.status(200).json({
      isSuccess: true,
      completedLessonsCount: completedLESSONS.length,
      completedLESSONS,
    });
  } catch (error) {
    return res.status(500).json({
      isSuccess: false,
      message: "An error occurred.",
    });
  }
};

exports.removeCreatedCourse = async (req, res) => {
  const { courseID } = req.params;
  try {
    const existedCourse = await db
      .select()
      .from(allcourses)
      .where(eq(allcourses.course_id, courseID));
    if (existedCourse.length === 0) {
      return res.status(404).json({
        isSuccess: false,
        message: "Course not found",
      });
    }

    const demo_URL = existedCourse[0].demo_URL;
    const course_image_url = existedCourse[0].course_image_url;
    const instructorImage = existedCourse[0].instructor_image;
    const deleteURL = demo_URL.substring(
      demo_URL.lastIndexOf("/") + 1,
      demo_URL.lastIndexOf(".")
    );
    const deleteImageURL = course_image_url.substring(
      course_image_url.lastIndexOf("/") + 1,
      course_image_url.lastIndexOf(".")
    );
    const instructorImageUrl = instructorImage.substring(
      instructorImage.lastIndexOf("/") + 1,
      instructorImage.lastIndexOf(".")
    );
    if (deleteURL && deleteImageURL) {
      try {
        const deletePromises = [
          new Promise((resolve, reject) => {
            cloudinary.uploader.destroy(
              deleteImageURL,
              { resource_type: "image" },
              (err, result) => {
                if (err) {
                  console.error(
                    "Cloud delete failed for course image url:",
                    err
                  ); // Improved error logging
                  reject(
                    new Error("Cloud delete failed for course image url.")
                  );
                } else {
                  resolve(result);
                }
              }
            );
          }),
          new Promise((resolve, reject) => {
            cloudinary.uploader.destroy(
              instructorImageUrl,
              { resource_type: "image" },
              (err, result) => {
                if (err) {
                  console.error(
                    "Failed to delete in cloud for instructor image url.",
                    err
                  ); // Improved error logging
                  reject(
                    new Error(
                      "Failed to delete in cloud for instructor image url."
                    )
                  );
                } else {
                  resolve(result);
                }
              }
            );
          }),
          new Promise((resolve, reject) => {
            cloudinary.uploader.destroy(
              deleteURL,
              { resource_type: "video" },
              (err, result) => {
                if (err) {
                  console.error(
                    "Cloud delete failed for course demo url:",
                    err
                  ); // Improved error logging
                  reject(new Error("Cloud delete failed for course demo url."));
                } else {
                  resolve(result);
                }
              }
            );
          }),
        ];
        await Promise.all(deletePromises);

        await db
          .delete(allcourses)
          .where(eq(allcourses.course_id, existedCourse[0].course_id));

        return res.status(200).json({
          isSuccess: true,
          message: "Course deleted successfully.",
        });
      } catch (error) {
        return res.status(500).json({
          isSuccess: false,
          message: "Course deletion failed.",
        });
      }
    }
  } catch (error) {
    return res.status(500).json({
      isSuccess: false,
      message: "An error occurred.",
    });
  }
};
