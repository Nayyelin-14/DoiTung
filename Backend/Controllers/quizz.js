const db = require("../db/db");
const { count, eq, and } = require("drizzle-orm");
const {
  allcourses,
  modules,
  users,
  user_Courses,
  quizzes,
  tests,
  questions,
  user_attempts,
} = require("../db");

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

  if (!question_text || !correct_option) {
    return res
      .status(400)
      .json({ success: false, message: "Required Fields are not provided!" });
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
          and(eq(user_attempts.userID, userID), eq(user_attempts.quizID, quizID))
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

  return res.json({ success: true, score: scorePercentage, message: "Submission successful!" });
};

exports.submitTestAnswers = async (req, res) => {
  const { userID, testID, answers } = req.body;

  if (!testID) {
    return res.status(400).json({ message: "Test ID is required." });
  }

  const attemptResult = await db
    .select({ count: count() })
    .from(user_attempts)
    .where(and(eq(user_attempts.userID, userID), eq(user_attempts.testID, testID)));

  const attemptCount = attemptResult[0]?.count || 0;
  const remainingAttempts = Math.max(3 - attemptCount, 0);

  if (attemptCount >= 3) {
    return res.status(400).json({ message: "Maximum attempts reached for this test.", remainingAttempts: 0 });
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