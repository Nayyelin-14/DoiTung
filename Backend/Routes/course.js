const express = require("express");
const router = express.Router();
const draftController = require("../Controllers/drafts");
const courseController = require("../Controllers/courses");
const commentsController = require("../Controllers/comments");
const quizController = require("../Controllers/quizz");

const authMiddleware = require("../Middleware/auth");
const adminController = require("../Controllers/admin");
const { CheckSavedCourse } = require("../Middleware/checksaves");
const savesController = require("../Controllers/saves");
const { isUser } = require("../Middleware/isUser");
const { isAdmin } = require("../Middleware/isAdmin");
const { isSuperAdmin } = require("../Middleware/isSuperAdmin");
//for course
router.get("/get_Courses", authMiddleware, isUser, courseController.getCourses);
router.get(
  "/get_PopularCourses",
  authMiddleware,
  isUser,
  courseController.get_PopularCourses
);
router.get(
  "/explore_courses/overview/:courseID",
  authMiddleware,
  isUser,
  courseController.courseDetail
);
router.get(
  "/get_AllModules/:courseId",
  authMiddleware,
  isUser,
  courseController.getAllModules
);
router.get(
  "/get_AllLessons/:courseId/:moduleId",
  authMiddleware,
  isUser,
  courseController.getAllLessons
);
router.post(
  "/create_course",
  authMiddleware,
  isAdmin,
  courseController.createCourse
);
router.post(
  "/create_module",
  authMiddleware,
  isAdmin,
  isSuperAdmin,
  courseController.createModule
);
router.post(
  "/create_lesson",
  authMiddleware,
  isAdmin,
  isSuperAdmin,
  courseController.createLesson
);
router.post(
  "/removelesson/:lessonID/:moduleID",
  authMiddleware,
  isAdmin,
  isSuperAdmin,
  courseController.removeCreatedLesson
);

//for quizz and tests(Creating Quiz and Tests, Submitting answers)
router.post(
  "/quiz/createQuiz",
  authMiddleware,
  isAdmin,
  isSuperAdmin,
  quizController.createQuiz
);
router.post(
  "/quiz/deleteQuiz/:quizID/:moduleID",
  authMiddleware,
  isAdmin,
  isSuperAdmin,
  quizController.deleteQuiz
);
router.get(
  "/quiz/getQuiz/:moduleID",
  authMiddleware,
  isAdmin,
  isSuperAdmin,
  quizController.getQuizzesByModule
);
router.post(
  "/test/createTest",
  authMiddleware,
  isAdmin,
  isSuperAdmin,
  quizController.createTests
);
router.get(
  "/test/getTest/:courseID",
  authMiddleware,
  isAdmin,
  isSuperAdmin,
  quizController.getTest
);

router.post(
  "/createQuestion",
  authMiddleware,
  isAdmin,
  isSuperAdmin,
  quizController.createQuestion
);
router.get("/getQuestions/:ID", quizController.getQuizQuestions);
router.put("/editQuestion", quizController.editQuestion);
router.post(
  "/deleteQuestion/:questionID",
  authMiddleware,
  isAdmin,
  isSuperAdmin,
  quizController.deleteQuestion
);
router.post(
  "/submitQuizAnswers",

  quizController.submitQuizAnswers
);
router.post("/startTest", quizController.startTest);
router.get("/checkTestStatus/:userID", quizController.checkTestStatus);
router.post(
  "/submitTestAnswers",

  quizController.submitTestAnswers
);
router.get("/getuserscores/:userId", quizController.getUserScores);
router.post("/generate", quizController.generateCertificate); //generate Certificate
router.get("/getCertificate/:userID", quizController.getCertificate);

//For Lesson Comments
router.post(
  "/addComment",
  authMiddleware,
  isUser,
  commentsController.addComment
);
router.get(
  "/getComments/:lesson_id",
  authMiddleware,
  isUser,
  commentsController.getLessonComments
);
router.post(
  "/deleteComment/:comment_id",
  authMiddleware,
  isUser,
  commentsController.deleteComment
);
router.put(
  "/editComment",
  authMiddleware,
  isUser,
  commentsController.editComment
);

//For Draft Course and Completed Course
router.get(
  "/getAllCourses",
  authMiddleware,

  isSuperAdmin,
  draftController.getAllCourses
);
router.post(
  "/saveCompleted/:userID/:courseID",
  authMiddleware,
  isAdmin,
  isSuperAdmin,
  draftController.saveAsCompleted
);
router.get(
  "/getOldCourse/:courseId/:userId",
  authMiddleware,
  isAdmin,
  isSuperAdmin,
  draftController.getOldCourseDetails
);
router.post(
  "/savedraft/:userID/:courseID",
  authMiddleware,
  isAdmin,
  isSuperAdmin,
  draftController.saveAsDraft
);
router.post(
  "/setCompleted/:courseID/:userID/:lessonID",
  authMiddleware,
  isAdmin,
  isSuperAdmin,
  courseController.setLessonCompleted
);
router.get(
  "/getAllCompleted/:courseID/:userID",
  authMiddleware,
  isAdmin,
  isSuperAdmin,
  courseController.getAllCompletedLessons
);

router.post(
  "/removeCreatedCourse/:courseID",
  authMiddleware,
  isAdmin,
  isSuperAdmin,
  courseController.removeCreatedCourse
);

router.post(
  `/savetowatch/:userID/:courseID`,
  authMiddleware,
  isUser,
  CheckSavedCourse,
  savesController.savetowatch
);
router.post(
  `/checksaves/:userID/:courseID`,
  authMiddleware,
  isUser,
  savesController.checksaves
);

router.get(
  `/getsavecourses/:userID`,
  authMiddleware,
  isUser,
  savesController.getSavedCourses
);

router.post(
  `/deletesavecourses/:userID/:courseID`,
  authMiddleware,
  isUser,
  savesController.deleteSavedCourses
);

router.get(
  "/coursedetail/:courseID",
  authMiddleware,

  isSuperAdmin,
  adminController.courseDetail
);
router.post(
  "/removeuser/:userid",
  authMiddleware,

  isSuperAdmin,
  adminController.removeEnrolledUser
);
module.exports = router;
