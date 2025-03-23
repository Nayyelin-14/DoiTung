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
        .status(404)
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
        .status(404)
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
        .status(404)
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
      return res.status(404).json({
        success: false,
        message: "No quizzes found for this module",
      });
    }

    res.json({ success: true, quizzes: quizzesList });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching quizzes",
    });
  }
};

exports.getTest = async (req, res) => {
  const { courseID } = req.params;
  try {
    const finalTest = await db
      .select()
      .from(tests)
      .where(eq(tests.courseID, courseID));
    if (tests.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No tests found for this course",
      });
    }
    res.json({ success: true, finalTest: finalTest });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
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

    console.log(quizQuestions);

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
        .status(404)
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

exports.submitTestAnswers = async (req, res) => {
  const { userID, testID, answers } = req.body;

  if (!testID) {
    return res.status(400).json({ message: "Test ID is required." });
  }

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
      return res.status(404).json({ message: "Test not found" });
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
      return res.status(404).json({ message: "Data not found" });
    }

    if (attempt[0].score < 70) {
      return res
        .status(400)
        .json({ message: "Score below 70, no certificate" });
    }

    const certificate_id = uuidv4();

    // Define a temporary file path
    // const tempFilePath = path.join(__dirname, `${userID}_${testID}.pdf`);

    // Create PDF and save locally
    const doc = new PDFDocument({ size: "A4", layout: "landscape" });
    const pdfStream = new PassThrough();
    // const writeStream = fs.createWriteStream(tempFilePath);
    doc.pipe(pdfStream);
    // doc.pipe(writeStream);
    const backgroundImage = path.join(__dirname, "../assets/background.png");
    const logo = path.join(__dirname, "../assets/mfllogo_2.png");
    // Set background image
    doc.image(backgroundImage, 0, 0, {
      width: doc.page.width,
      height: doc.page.height,
    });

    const logoWidth = 100;
    doc.image(logo, (doc.page.width - logoWidth) / 2, 60, { width: logoWidth });
    doc.moveDown(7)
    doc
      .font("Helvetica")
      .fontSize(13)
      .fillColor("#D4AF37")
      .text("Mae Fah Luang Foundatioin Under Royal Patronage", {
        align: "center",
        baseline: "top",
      });
    doc.fillColor("#000");

    doc.moveDown(2)
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
      .text(
        `For completing "${course[0].course_name}" course`,
        { align: "center" }
      );
    doc
      .font("Times-Roman")
      .fontSize(14)
      .text(
        `on ${new Date(attempt[0].createdAt).toDateString()}.`,
        { align: "center" }
      );

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
    doc.font("Helvetica").fontSize(14).text(`(${certificate_id})`, { align: "right" });

    // End the document
    doc.end();
    // Wait for the PDF to be fully written before uploading

    // await new Promise((resolve, reject) => {
    //   writeStream.on("finish", resolve);
    //   writeStream.on("error", reject);
    // });

    // // Upload the saved PDF to Cloudinary
    // const uploadResult = await cloudinary.uploader.upload(tempFilePath, {
    //   resource_type: "raw", // Ensures it's treated as a raw document
    //   folder: "certificates",
    //   public_id: `${userID}_${testID}`,
    // });
    // console.log(uploadResult);
    // console.log(tempFilePath);
    // // Delete the temporary file after successful upload
    // fs.unlinkSync(tempFilePath);

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
      certificate_id:certificate_id,
      userID,
      courseID: course[0].course_id,
      testID,
      score: attempt[0].score,
      certificate_url: uploadResult.secure_url, // Store Cloudinary URL
    });

    res.status(200).json({
      message: "Certificate generated",
      pdf_url: uploadResult.secure_url,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// const generatePDF = (html, options) => {
//   return new Promise((resolve, reject) => {
//     pdf.create(html, options).toStream((err, stream) => {
//       if (err) {
//         return reject(err);
//       }
//       resolve(stream);
//     });
//   });
// };

// exports.generateCertificate = async (req, res) => {
//   try {
//     const { userID, testID } = req.body;

//     // Fetch User, Test, Course details using Drizzle ORM
//     const user = await db
//       .select()
//       .from(users)
//       .where(eq(users.user_id, userID))
//       .limit(1);
//     const test = await db
//       .select()
//       .from(tests)
//       .where(eq(tests.test_id, testID))
//       .limit(1);

//     if (!test.length) {
//       return res.status(404).json({ message: "Test not found" });
//     }

//     const course = await db
//       .select()
//       .from(allcourses)
//       .where(eq(allcourses.course_id, test[0].courseID))
//       .limit(1);

//     const attempt = await db
//       .select()
//       .from(user_attempts)
//       .where(
//         and(eq(user_attempts.userID, userID), eq(user_attempts.testID, testID))
//       )
//       .orderBy(desc(user_attempts.createdAt))
//       .limit(1);

//     if (!user.length || !course.length || !attempt.length) {
//       return res.status(404).json({ message: "Data not found" });
//     }

//     if (attempt[0].score < 70) {
//       return res
//         .status(400)
//         .json({ message: "Score below 70, no certificate" });
//     }

//     // Load HTML template
//     const templatePath = path.join(__dirname, "certificate-template.html");
//     let html = fs.readFileSync(templatePath, "utf8");

//     // Replace placeholders with actual data
//     html = html
//       .replace("{{userName}}", user[0].user_name)
//       .replace("{{courseName}}", course[0].course_name)
//       .replace("{{instructorName}}", course[0].instructor_name)
//       .replace("{{score}}", attempt[0].score);

//     // Generate PDF from HTML
//     const pdfOptions = { format: "A4" }; // PDF options
//     const pdfStream = await generatePDF(html, pdfOptions);

//     // Upload PDF to Cloudinary
//     const uploadStream = cloudinary.uploader.upload_stream(
//       {
//         resource_type: "raw",
//         folder: "certificates",
//         public_id: `${userID}_${testID}`,
//         format: "pdf",
//       },
//       (error, result) => {
//         if (error) {
//           console.error("Cloudinary upload error:", error);
//           return res.status(500).json({ message: "Cloudinary upload failed" });
//         }

//         console.log("Cloudinary Upload Result:", result);

//         // Save Cloudinary URL in DB using Drizzle ORM
//         db.insert(certificates)
//           .values({
//             userID,
//             courseID: course[0].course_id,
//             testID,
//             score: attempt[0].score,
//             certificate_url: result.secure_url, // Store Cloudinary URL
//           })
//           .then(() => {
//             res.status(200).json({
//               message: "Certificate generated",
//               pdf_url: result.secure_url,
//             });
//           })
//           .catch((err) => {
//             console.error("Database error:", err);
//             res.status(500).json({ message: "Database error" });
//           });
//       }
//     );

//     // Stream the PDF to Cloudinary
//     pdfStream.pipe(uploadStream);
//   } catch (error) {
//     console.error("Error generating certificate:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

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
      return res.status(404).json({ message: "Certificates not found" });
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