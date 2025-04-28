const db = require("../db/db");
const { count, eq, and, desc } = require("drizzle-orm");
const { PassThrough } = require("stream");
const PDFDocument = require("pdfkit");
// const pdf = require("html-pdf");
// const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const {
  allcourses,
  modules,
  users,
  user_Courses,
  quizzes,
  tests,
  questions,
  user_attempts,
  certificates,
  test_status,
  completed_lessons,
} = require("../db");
const cloudinary = require("../Action/cloudinary");

exports.createQuiz = async (req, res) => {
  const { title, moduleID } = req.body;
  try {
    // Insert the quiz
    await db.insert(quizzes).values({ title, moduleID });

    const allQuizzes = await db
      .select()
      .from(quizzes)
      .where(eq(quizzes.moduleID, moduleID))
      .orderBy(quizzes.createdAt, "desc");

    res.json({
      success: true,
      quizzes: allQuizzes,
      message: "Quiz Created Successfully!",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while adding Quiz",
    });
  }
};

exports.createTests = async (req, res) => {
  const { title, courseID, timeLimit } = req.body;
  try {
    const newTest = await db
      .insert(tests)
      .values({ title, courseID, timeLimit: parseInt(timeLimit, 10) });

    const Test = await db
      .select()
      .from(tests)
      .where(eq(tests.courseID, courseID));

    res.json({
      success: true,
      test: Test,
      message: "Test Created Successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      isSuccess: false,
      message: "An error occurred while adding Test",
    });
  }
};

exports.deleteQuiz = async (req, res) => {
  const { quizID, moduleID } = req.params;

  try {
    // Check if quiz exists
    const quizToDelete = await db
      .select()
      .from(quizzes)
      .where(eq(quizzes.quiz_id, quizID));
    if (!quizToDelete.length) {
      return res
        .status(400)
        .json({ success: false, message: "Quiz not found" });
    }

    // Delete the quiz
    await db.delete(quizzes).where(eq(quizzes.quiz_id, quizID));

    const updatedQuizzes = await db
      .select()
      .from(quizzes)
      .where(eq(quizzes.moduleID, moduleID))
      .orderBy(quizzes.createdAt, "asc");

    res.json({
      success: true,
      quizzes: updatedQuizzes,
      message: "Quiz Deleted Successfully!",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the quiz",
    });
  }
};

exports.createQuestion = async (req, res) => {
  const { quizID, testID, question_text, options, correct_option } = req.body;

  if (!quizID && !testID) {
    return res
      .status(400)
      .json({ success: false, message: "Provide either quizID or testID" });
  }

  if (!question_text || !correct_option || !options) {
    return res
      .status(400)
      .json({ success: false, message: "Required Fields are not provided!" });
  }

  // Check if the correct_option is in the options array
  if (!options.includes(correct_option)) {
    return res.status(400).json({
      success: false,
      message: "Correct answer must be one of the provided options!",
    });
  }

  try {
    const question = await db.insert(questions).values({
      quizID,
      testID,
      question_text: question_text,
      options: JSON.stringify(options),
      correct_option: correct_option,
    });

    res.status(201).json({
      success: true,
      question,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      isSuccess: false,
      message: "An error occurred while adding Question",
    });
  }
};

exports.editQuestion = async (req, res) => {
  const { question_id, question_text, options, correct_option } = req.body;

  if (!question_id) {
    return res
      .status(400)
      .json({ success: false, message: "Question ID is required" });
  }

  if (!question_text || !correct_option || !options) {
    return res.status(400).json({
      success: false,
      message: "Required Fields are not provided or invalid!",
    });
  }

  // Check if the correct_option is in the options array
  if (!options.includes(correct_option)) {
    return res.status(400).json({
      success: false,
      message: "Correct answer must be one of the provided options!",
    });
  }

  try {
    const updatedQuestion = await db
      .update(questions)
      .set({
        question_text: question_text,
        options: JSON.stringify(options),
        correct_option: correct_option,
      })
      .where(eq(questions.question_id, question_id));

    if (updatedQuestion.affectedRows === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Question not found" });
    }

    res.status(200).json({
      success: true,
      message: "Question updated successfully",
      updatedQuestion,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the question",
    });
  }
};

exports.deleteQuestion = async (req, res) => {
  const { questionID } = req.params;

  if (!questionID) {
    return res
      .status(400)
      .json({ success: false, message: "Question ID is required" });
  }

  try {
    const deletedQuestion = await db
      .delete(questions)
      .where(eq(questions.question_id, questionID));

    if (deletedQuestion.affectedRows === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Question not found" });
    }

    res.status(200).json({
      success: true,
      message: "Question deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the question",
    });
  }
};

exports.getQuizzesByModule = async (req, res) => {
  const { moduleID } = req.params;

  try {
    const quizzesList = await db
      .select()
      .from(quizzes)
      .where(eq(quizzes.moduleID, moduleID))
      .orderBy(quizzes.createdAt, "asc");

    if (quizzesList.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No quizzes found for this module",
      });
    }

    res.json({ success: true, quizzes: quizzesList });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching quizzes",
    });
  }
};

exports.getTest = async (req, res) => {
  const { courseID } = req.params;
  const userID = req.userID;

  try {
    // 1. Fetch the test for the course
    const finalTest = await db
      .select()
      .from(tests)
      .where(eq(tests.courseID, courseID))
      .limit(1); // Ensure only one test is returned

    if (!finalTest[0]) {
      return res.status(400).json({
        success: false,
        message: "No tests found for this course",
      });
    }

    // 2. Get attempt count (optimized with COUNT)
    const attemptCountResult = await db
      .select({ count: count() })
      .from(user_attempts)
      .where(
        and(
          eq(user_attempts.userID, userID),
          eq(user_attempts.testID, finalTest[0].test_id) // Use finalTest[0] since it's an array
        )
      );

    const attemptCount = attemptCountResult[0]?.count || 0;

    // 3. Return response with attemptCount
    res.json({
      success: true,
      finalTest: finalTest[0], // Return single test object
      attemptCount, // Include attempt count
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching tests",
    });
  }
};

exports.getQuizQuestions = async (req, res) => {
  const { ID } = req.params;
  try {
    const quizQuestions = await db
      .select()
      .from(questions)
      .where(eq(questions.quizID, ID));

    const testQuestions = await db
      .select()
      .from(questions)
      .where(eq(questions.testID, ID));

    quizQuestions.forEach((q) => {
      q.options = JSON.parse(q.options); // Convert JSON string back to array
    });

    testQuestions.forEach((q) => {
      q.options = JSON.parse(q.options); // Convert JSON string back to array
    });

    res.status(200).json({
      success: true,
      quizQuestions,
      testQuestions,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      isSuccess: false,
      message: "An error occurred fetching questions",
    });
  }
};

// exports.submitAnswers = async (req, res) => {
//   const { userID, quizID, testID, answers } = req.body; // answers: [{ question_id, selectedOption }]

//   let remainingAttempts = null;

//   if (testID) {
//     const attemptResult = await db
//       .select({ count: count() })
//       .from(user_attempts)
//       .where(
//         and(eq(user_attempts.userID, userID), eq(user_attempts.testID, testID))
//       );

//     const attemptCount = attemptResult[0]?.count || 0;
//     remainingAttempts = Math.max(3 - attemptCount, 0); // Prevent negative values

//     if (attemptCount >= 3) {
//       return res
//         .status(400)
//         .json({
//           message: "Maximum attempts reached for this test.",
//           remainingAttempts: 0,
//         });
//     }
//   }

//   //  Fetch the total number of questions for the given quiz/test
//   const totalQuestionsResult = await db
//     .select({ count: count() })
//     .from(questions)
//     .where(
//       quizID ? eq(questions.quizID, quizID) : eq(questions.testID, testID)
//     );

//   const totalQuestions = totalQuestionsResult[0]?.count || 1; // Avoid division by zero

//   let correctAnswers = 0;

//   for (const answer of answers) {
//     const questionData = await db
//       .select({ correct_option: questions.correct_option }) // Make sure questions table exists
//       .from(questions)
//       .where(eq(questions.question_id, answer.question_id))
//       .limit(1);

//     if (
//       questionData.length > 0 &&
//       questionData[0].correct_option === answer.selectedOption
//     ) {
//       correctAnswers++;
//     }
//   }

//   // Calculate score as a percentage
//   const scorePercentage = parseFloat(
//     (correctAnswers / totalQuestions) * 100
//   ).toFixed(2);

//   // (insert new attempt)
//   if (testID) {
//     await db.insert(user_attempts).values({
//       userID,
//       quizID: quizID || null,
//       testID,
//       attemptNumber: 3 - remainingAttempts + 1, // Track attempts only for tests
//       score: scorePercentage,
//     });

//     return res.json({
//       success: true,
//       score: scorePercentage,
//       remainingAttempts: remainingAttempts - 1, // Include remaining attempts for tests
//       message: "Submission successful!",
//     });
//   }

//   // Handle quizzes (update only if the score is higher)
//   if (quizID) {
//     const existingAttempt = await db
//       .select({ score: user_attempts.score })
//       .from(user_attempts)
//       .where(
//         and(eq(user_attempts.userID, userID), eq(user_attempts.quizID, quizID))
//       )
//       .limit(1);

//     if (existingAttempt.length > 0) {
//       const previousScore = existingAttempt[0].score;

//       if (scorePercentage > previousScore) {
//         // Update only if the new score is higher
//         await db
//           .update(user_attempts)
//           .set({ score: scorePercentage })
//           .where(
//             and(
//               eq(user_attempts.userID, userID),
//               eq(user_attempts.quizID, quizID)
//             )
//           );
//       }
//     } else {
//       // Insert a new record
//       await db.insert(user_attempts).values({
//         userID,
//         quizID,
//         testID: null,
//         attemptNumber: 1, // Quizzes don't have limited attempts
//         score: scorePercentage,
//       });
//     }
//   }

//   return res.json({
//     success: true,
//     score: scorePercentage,
//     message: "Submission successful!",
//   });
// };

exports.getUserScores = async (req, res) => {
  const { userId } = req.params; // Get userId from request params
  try {
    // Step 1: Get the user's enrolled courses
    const enrolledCourses = await db
      .select({
        courseId: user_Courses.course_id,
        enrolled_at: user_Courses.enrolled_at,
        courseName: allcourses.course_name,
      })
      .from(user_Courses)
      .leftJoin(allcourses, eq(user_Courses.course_id, allcourses.course_id))
      .where(eq(user_Courses.user_id, userId));

    if (enrolledCourses.length === 0) {
      return res
        .status(400)
        .json({ message: "User is not enrolled in any courses." });
    }

    // Step 2: Fetch all quiz attempts
    const quizAttempts = await db
      .select({
        courseId: modules.courseID,
        quizTitle: quizzes.title,
        score: user_attempts.score,
        attemptNumber: user_attempts.attemptNumber,
        createdAt: user_attempts.createdAt,
      })
      .from(user_attempts)
      .leftJoin(quizzes, eq(user_attempts.quizID, quizzes.quiz_id))
      .leftJoin(modules, eq(quizzes.moduleID, modules.module_id))
      .where(eq(user_attempts.userID, userId));

    // Step 3: Fetch all test attempts
    const testAttempts = await db
      .select({
        courseId: tests.courseID,
        testTitle: tests.title,
        score: user_attempts.score,
        attemptNumber: user_attempts.attemptNumber,
        createdAt: user_attempts.createdAt,
      })
      .from(user_attempts)
      .leftJoin(tests, eq(user_attempts.testID, tests.test_id))
      .where(eq(user_attempts.userID, userId));

    // Step 4: Organize the attempts data into courses
    const scoresByCourse = enrolledCourses.map((course) => ({
      courseId: course.courseId,
      enrolled_at: course.enrolled_at,
      courseName: course.courseName,
      quizAttempts: quizAttempts.filter(
        (attempt) => attempt.courseId === course.courseId
      ),
      testAttempts: testAttempts.filter(
        (attempt) => attempt.courseId === course.courseId
      ),
    }));

    res.json(scoresByCourse);
  } catch (error) {
    console.error("Error fetching user scores:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

exports.submitQuizAnswers = async (req, res) => {
  const { userID, quizID, answers } = req.body;

  if (!quizID) {
    return res.status(400).json({ message: "Quiz ID is required." });
  }

  const totalQuestionsResult = await db
    .select({ count: count() })
    .from(questions)
    .where(eq(questions.quizID, quizID));

  const totalQuestions = totalQuestionsResult[0]?.count || 1;
  let correctAnswers = 0;

  for (const answer of answers) {
    const questionData = await db
      .select({ correct_option: questions.correct_option })
      .from(questions)
      .where(eq(questions.question_id, answer.question_id))
      .limit(1);

    if (
      questionData.length > 0 &&
      questionData[0].correct_option === answer.selectedOption
    ) {
      correctAnswers++;
    }
  }

  const scorePercentage = parseFloat(
    (correctAnswers / totalQuestions) * 100
  ).toFixed(2);

  const existingAttempt = await db
    .select({ score: user_attempts.score })
    .from(user_attempts)
    .where(
      and(eq(user_attempts.userID, userID), eq(user_attempts.quizID, quizID))
    )
    .limit(1);

  if (existingAttempt.length > 0) {
    const previousScore = existingAttempt[0].score;
    if (scorePercentage > previousScore) {
      await db
        .update(user_attempts)
        .set({ score: scorePercentage })
        .where(
          and(
            eq(user_attempts.userID, userID),
            eq(user_attempts.quizID, quizID)
          )
        );
    }
  } else {
    await db.insert(user_attempts).values({
      userID,
      quizID,
      testID: null,
      attemptNumber: 1,
      score: scorePercentage,
    });
  }

  return res.json({
    success: true,
    score: scorePercentage,
    message: "Submission successful!",
  });
};

exports.startTest = async (req, res) => {
  const { userID, testID, courseID, timeLimit } = req.body;

  if (!userID || !testID || !courseID || !timeLimit) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const startTime = new Date();
  const expiresAt = new Date(startTime.getTime() + timeLimit * 60000); // Convert minutes to milliseconds

  // Insert test status
  await db.insert(test_status).values({
    userID,
    testID,
    courseID,
    startTime,
    expiresAt,
  });

  return res.json({
    success: true,
    message: "Test started successfully.",
    startTime,
    expiresAt,
  });
};

exports.checkTestStatus = async (req, res) => {
  const { userID } = req.params;

  if (!userID) {
    return res.status(400).json({ message: "User ID is required." });
  }

  const testStatus = await db
    .select()
    .from(test_status)
    .where(and(eq(test_status.userID, userID)))
    .limit(1);

  if (testStatus.length === 0) {
    return res.json({
      success: false,
      active: false,
      message: "Test is not active.",
    });
  }

  const { expiresAt, courseID, testID } = testStatus[0];
  const now = new Date();
  const remainingTime = Math.max(
    0,
    Math.ceil((new Date(expiresAt) - now) / 60000)
  ); // Convert ms to minutes

  if (remainingTime <= 0) {
    await db.delete(test_status).where(and(eq(test_status.userID, userID)));

    return res.json({ success: true, active: false, message: "Test expired." });
  }

  return res.json({
    success: true,
    active: true,
    remainingTime,
    courseID,
    testID,
    message: "Test in progress. Redirected to Test",
  });
};

exports.submitTestAnswers = async (req, res) => {
  const { userID, testID, answers } = req.body;

  if (!testID) {
    return res.status(400).json({ message: "Test ID is required." });
  }

  // Get the course ID associated with the test
  const testData = await db
    .select({ courseID: tests.courseID })
    .from(tests)
    .where(eq(tests.test_id, testID))
    .limit(1);

  if (testData.length === 0) {
    return res.status(400).json({ message: "Test not found." });
  }
  const courseID = testData[0].courseID;

  const attemptResult = await db
    .select({ count: count() })
    .from(user_attempts)
    .where(
      and(eq(user_attempts.userID, userID), eq(user_attempts.testID, testID))
    );

  const attemptCount = attemptResult[0]?.count || 0;
  const remainingAttempts = Math.max(3 - attemptCount, 0);

  if (attemptCount >= 3) {
    return res.status(400).json({
      message: "Maximum attempts reached for this test.",
      remainingAttempts: 0,
    });
  }

  const totalQuestionsResult = await db
    .select({ count: count() })
    .from(questions)
    .where(eq(questions.testID, testID));

  const totalQuestions = totalQuestionsResult[0]?.count || 1;
  let correctAnswers = 0;

  for (const answer of answers) {
    const questionData = await db
      .select({ correct_option: questions.correct_option })
      .from(questions)
      .where(eq(questions.question_id, answer.question_id))
      .limit(1);

    if (
      questionData.length > 0 &&
      questionData[0].correct_option === answer.selectedOption
    ) {
      correctAnswers++;
    }
  }

  const scorePercentage = parseFloat(
    (correctAnswers / totalQuestions) * 100
  ).toFixed(2);

  await db.insert(user_attempts).values({
    userID,
    quizID: null,
    testID,
    attemptNumber: 3 - remainingAttempts + 1,
    score: scorePercentage,
  });

  await db.delete(test_status).where(and(eq(test_status.userID, userID)));

  // Check if this was the last attempt and all scores are below 70
  if (remainingAttempts - 1 === 0) {
    const allAttempts = await db
      .select()
      .from(user_attempts)
      .where(
        and(eq(user_attempts.userID, userID), eq(user_attempts.testID, testID))
      );

    const allBelow70 = allAttempts.every(
      (attempt) => parseFloat(attempt.score) < 70
    );

    if (allBelow70) {
      // Delete completed lessons for this user and course
      await db
        .delete(completed_lessons)
        .where(
          and(
            eq(completed_lessons.user_id, userID),
            eq(completed_lessons.course_id, courseID)
          )
        );

      // Reset progress in user_courses
      await db
        .update(user_Courses)
        .set({ progress: 0, is_completed: false })
        .where(
          and(
            eq(user_Courses.user_id, userID),
            eq(user_Courses.course_id, courseID)
          )
        );

      // Delete all test attempts for this user and test
      await db
        .delete(user_attempts)
        .where(
          and(
            eq(user_attempts.userID, userID),
            eq(user_attempts.testID, testID)
          )
        );
      return res.json({
        success: true,
        score: scorePercentage,
        remainingAttempts: remainingAttempts - 1,
        message:
          "You have used all 3 attempts. Your progress will now be reset.",
      });
    }
  }

  return res.json({
    success: true,
    score: scorePercentage,
    remainingAttempts: remainingAttempts - 1,
    message: "Submission successful!",
  });
};

exports.generateCertificate = async (req, res) => {
  try {
    const { userID, testID } = req.body;

    // Fetch User, Test, Course details using Drizzle ORM
    const user = await db
      .select()
      .from(users)
      .where(eq(users.user_id, userID))
      .limit(1);
    const test = await db
      .select()
      .from(tests)
      .where(eq(tests.test_id, testID))
      .limit(1);

    if (!test.length) {
      return res.status(400).json({ message: "Test not found" });
    }
    const course = await db
      .select()
      .from(allcourses)
      .where(eq(allcourses.course_id, test[0].courseID))
      .limit(1);
    const attempt = await db
      .select()
      .from(user_attempts)
      .where(
        and(eq(user_attempts.userID, userID), eq(user_attempts.testID, testID))
      )
      .orderBy(desc(user_attempts.createdAt))
      .limit(1);

    if (!user.length || !course.length || !attempt.length) {
      return res.status(400).json({ message: "Data not found" });
    }
    const hasPassingAttempt = attempt.some((attempt) => attempt.score >= 70);
    if (!hasPassingAttempt) {
      return res.status(400).json({
        message: "Score is below 70, Certificate will not be granted!",
      });
    }

    const certificate = await db
      .select()
      .from(certificates)
      .where(
        and(eq(certificates.userID, userID), eq(certificates.testID, testID))
      );

    if (certificate.length > 0) {
      const { certificate_url } = certificate[0];
      return res
        .status(200)
        .json({ message: "You've already got a certificate", certificate_url });
    }

    const certificate_id = uuidv4();

    const doc = new PDFDocument({ size: "A4", layout: "landscape" });
    const pdfStream = new PassThrough();
    doc.pipe(pdfStream);
    const backgroundImage = path.join(__dirname, "../assets/background.png");
    const logo = path.join(__dirname, "../assets/mfllogo_2.png");
    // Set background image
    doc.image(backgroundImage, 0, 0, {
      width: doc.page.width,
      height: doc.page.height,
    });

    const logoWidth = 100;
    doc.image(logo, (doc.page.width - logoWidth) / 2, 60, { width: logoWidth });
    doc.moveDown(7);
    doc
      .font("Helvetica")
      .fontSize(13)
      .fillColor("#D4AF37")
      .text("Mae Fah Luang Foundatioin Under Royal Patronage", {
        align: "center",
        baseline: "top",
      });
    doc.fillColor("#000");

    doc.moveDown(2);
    // Subtitle 1: "CERTIFICATE"
    doc
      .fillColor("#000")
      .font("Courier-Bold")
      .fontSize(35)
      .text("CERTIFICATE OF COMPLETION", { align: "center" });

    // Move down to create space for the participant's name
    doc.moveDown();

    // Text: "This certificate is proudly presented to"
    doc
      .font("Times-Roman")
      .fontSize(14)
      .text("This certificate is proudly presented to", { align: "center" });

    doc.moveDown(1);

    // Participant's Name
    doc
      .fillColor("#D4AF37")
      .font("Helvetica-Bold")
      .fontSize(40)
      .text(`${user[0].user_name}`, { align: "center" });

    doc.fillColor("#000"); // Reset color

    // Course completion text
    doc
      .font("Times-Roman")
      .fontSize(14)
      .text(`For completing "${course[0].course_name}" course`, {
        align: "center",
      });
    doc
      .font("Times-Roman")
      .fontSize(14)
      .text(`on ${new Date(attempt[0].createdAt).toDateString()}.`, {
        align: "center",
      });
    // Add more spacing before instructor details
    doc.moveDown(4);

    // Instructor's Name
    doc
      .font("Helvetica-Bold")
      .fontSize(20)
      .fillColor("#222")
      .text(`${course[0].instructor_name}`, { align: "center" });

    // Instructor's Title
    doc.font("Helvetica").fontSize(14).text("Instructor", { align: "center" });
    doc
      .font("Helvetica")
      .fontSize(14)
      .text(`(${certificate_id})`, { align: "right" });

    // End the document
    doc.end();

    const uploadResult = await new Promise((resolve, reject) => {
      const cloudinaryStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "raw",
          folder: "certificates",
          public_id: `${userID}_${testID}`,
          format: "pdf",
        },
        (error, result) => (error ? reject(error) : resolve(result))
      );
      pdfStream.pipe(cloudinaryStream);
    });

    console.log(uploadResult);

    // Save Cloudinary URL in DB using Drizzle ORM
    await db.insert(certificates).values({
      certificate_id: certificate_id,
      userID,
      courseID: course[0].course_id,
      testID,
      score: attempt[0].score,
      certificate_url: uploadResult.secure_url, // Store Cloudinary URL
    });

    await db
      .update(user_Courses)
      .set({ is_completed: true })
      .where(
        and(
          eq(user_Courses.user_id, userID),
          eq(user_Courses.course_id, course[0].course_id)
        )
      );

    res.status(200).json({
      message: "Certificate generated",
      certificate_url: uploadResult.secure_url,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getCertificate = async (req, res) => {
  try {
    const { userID } = req.params; // Correctly extract userID
    if (!userID) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const result = await db
      .select({
        course_name: allcourses.course_name,
        certificate_id: certificates.certificate_id,
        certificate_url: certificates.certificate_url,
      })
      .from(certificates)
      .innerJoin(allcourses, eq(certificates.courseID, allcourses.course_id))
      .where(eq(certificates.userID, userID)); // Ensure userID is correctly used

    if (result.length === 0) {
      return res.status(400).json({ message: "Certificates not found" });
    }

    res.status(200).json({
      success: true,
      message: "Certificate fetched",
      certificates: result,
    });
  } catch (error) {
    console.error("Error fetching certificates:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.checkCertificate = async (req, res) => {
  try {
    const userID  = req.userID;
    const { courseID } = req.params;
    if (!userID) {
      return res.status(400).json({ message: "User ID is required" });
    }
    if (!courseID) {
      return res.status(400).json({ message: "CourseID is required!" });
    }

    const result = await db
      .select({
        certificate_url: certificates.certificate_url,
      })
      .from(certificates)
      .where(
        and(
          eq(certificates.userID, userID),
          eq(certificates.courseID, courseID)
        )
      );

    if (result.length === 0) {
      return res.status(404).json({ message: "Certificates not found" });
    }

    res.status(200).json({
      success: true,
      message: "Already Certified!",
      certificate: result,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
