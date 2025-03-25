const express = require("express");
const router = express.Router();
const draftController = require("../Controllers/drafts");
const courseController = require("../Controllers/courses");
const commentsController = require("../Controllers/comments");
const quizController = require("../Controllers/quizz");
const { isAdmin } = require("../Middleware/isAdmin");
const authMiddleware = require("../Middleware/auth");
const adminController = require("../Controllers/admin");
const isSuperAdmin = require("../Middleware/isSuperAdmin");
const { CheckSavedCourse } = require("../Middleware/checksaves");
const savesController = require("../Controllers/saves");
//for course
router.get("/get_Courses", authMiddleware, courseController.getCourses);
router.get(
  "/get_PopularCourses",
  authMiddleware,
  courseController.get_PopularCourses
);
router.get(
  "/explore_courses/overview/:courseID",
  authMiddleware,
  courseController.courseDetail
);
router.get(
  "/get_AllModules/:courseId",
  authMiddleware,
  courseController.getAllModules
);
router.get(
  "/get_AllLessons/:courseId/:moduleId",
  authMiddleware,
  courseController.getAllLessons
);
router.post(
  "/create_course",
  authMiddleware,
  isAdmin,
  isSuperAdmin,
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
router.get("/test/getTest/:courseID", authMiddleware, quizController.getTest);

router.post(
  "/createQuestion",
  authMiddleware,
  isAdmin,
  isSuperAdmin,
  quizController.createQuestion
);
router.get(
  "/getQuestions/:ID",
  authMiddleware,
  quizController.getQuizQuestions
);
router.put(
  "/editQuestion",
  authMiddleware,
  isAdmin,
  isSuperAdmin,
  quizController.editQuestion
);
router.post(
  "/deleteQuestion/:questionID",
  authMiddleware,
  isAdmin,
  isSuperAdmin,
  quizController.deleteQuestion
);
router.post(
  "/submitQuizAnswers",
  authMiddleware,
  quizController.submitQuizAnswers
);
router.post("/startTest", authMiddleware, quizController.startTest);
router.get("/checkTestStatus/:userID", quizController.checkTestStatus);
router.post(
  "/submitTestAnswers",
  authMiddleware,
  quizController.submitTestAnswers
);
router.get("/getuserscores/:userId", quizController.getUserScores);
router.post("/generate", quizController.generateCertificate); //generate Certificate
router.get("/getCertificate/:userID", quizController.getCertificate);

//For Lesson Comments
router.post("/addComment", authMiddleware, commentsController.addComment);
router.get(
  "/getComments/:lesson_id",
  authMiddleware,
  commentsController.getLessonComments
);
router.post(
  "/deleteComment/:comment_id",
  authMiddleware,
  commentsController.deleteComment
);
router.put("/editComment", authMiddleware, commentsController.editComment);

//For Draft Course and Completed Course
router.get(
  "/getAllCourses",
  authMiddleware,
  isAdmin,
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
  CheckSavedCourse,
  savesController.savetowatch
);
router.post(
  `/checksaves/:userID/:courseID`,
  authMiddleware,

  savesController.checksaves
);

router.get(
  `/getsavecourses/:userID`,
  authMiddleware,

  savesController.getSavedCourses
);

router.post(
  `/deletesavecourses/:userID/:courseID`,
  authMiddleware,

  savesController.deleteSavedCourses
);

router.get(
  "/coursedetail/:courseID",
  authMiddleware,
  isAdmin,
  isSuperAdmin,
  adminController.courseDetail
);
router.post(
  "/removeuser/:userid",
  authMiddleware,
  isAdmin,
  isSuperAdmin,
  adminController.removeEnrolledUser
);
module.exports = router;
