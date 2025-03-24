const express = require("express");
const router = express.Router();
const draftController = require("../Controllers/drafts");
const courseController = require("../Controllers/courses");
const commentsController = require("../Controllers/comments");
const quizController = require("../Controllers/quizz");
const { isAdmin } = require("../Middleware/isAdmin");
const authMiddleware = require("../Middleware/auth");
const adminController = require("../Controllers/admin");
const { CheckSavedCourse } = require("../Middleware/checksaves");
const savesController = require("../Controllers/saves");
//for course
router.get("/get_Courses", courseController.getCourses);
router.get("/get_PopularCourses", courseController.get_PopularCourses);
router.get(
  "/explore_courses/overview/:courseID",
  courseController.courseDetail
);
router.get("/get_AllModules/:courseId", courseController.getAllModules);
router.get(
  "/get_AllLessons/:courseId/:moduleId",
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
  courseController.createModule
);
router.post(
  "/create_lesson",
  authMiddleware,
  isAdmin,
  courseController.createLesson
);
router.post(
  "/removelesson/:lessonID/:moduleID",
  courseController.removeCreatedLesson
);

//for quizz and tests(Creating Quiz and Tests, Submitting answers)
router.post(
  "/quiz/createQuiz",
  authMiddleware,
  isAdmin,
  quizController.createQuiz
);
router.post("/quiz/deleteQuiz/:quizID/:moduleID", quizController.deleteQuiz);
router.get("/quiz/getQuiz/:moduleID", quizController.getQuizzesByModule);
router.post(
  "/test/createTest",
  authMiddleware,
  isAdmin,
  quizController.createTests
);
router.get("/test/getTest/:courseID", quizController.getTest);

router.post(
  "/createQuestion",
  authMiddleware,
  isAdmin,
  quizController.createQuestion
);
router.get("/getQuestions/:ID", quizController.getQuizQuestions);
router.put("/editQuestion", quizController.editQuestion);
router.post("/deleteQuestion/:questionID", quizController.deleteQuestion);
router.post(
  "/submitQuizAnswers",
  authMiddleware,
  quizController.submitQuizAnswers
);
router.post("/startTest", quizController.startTest);
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
router.post("/addComment", commentsController.addComment);
router.get("/getComments/:lesson_id", commentsController.getLessonComments);
router.post("/deleteComment/:comment_id", commentsController.deleteComment);
router.put("/editComment", commentsController.editComment);

//For Draft Course and Completed Course
router.get(
  "/getAllCourses",
  authMiddleware,
  isAdmin,
  draftController.getAllCourses
);
router.post(
  "/saveCompleted/:userID/:courseID",
  authMiddleware,
  isAdmin,
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
  draftController.saveAsDraft
);
router.post(
  "/setCompleted/:courseID/:userID/:lessonID",
  authMiddleware,

  courseController.setLessonCompleted
);
router.get(
  "/getAllCompleted/:courseID/:userID",
  courseController.getAllCompletedLessons
);

router.post(
  "/removeCreatedCourse/:courseID",
  authMiddleware,
  isAdmin,
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
  adminController.courseDetail
);
router.post(
  "/removeuser/:userid",
  authMiddleware,
  isAdmin,
  adminController.removeEnrolledUser
);
module.exports = router;
