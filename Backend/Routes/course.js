const express = require("express");
const router = express.Router();
const draftController = require("../Controllers/drafts");
const courseController = require("../Controllers/courses");
const commentsController = require("../Controllers/comments");
const quizController = require("../Controllers/quizz");

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
router.post("/create_course", courseController.createCourse);

router.post("/create_module", courseController.createModule);
router.post("/create_lesson", courseController.createLesson);
router.post(
  "/removelesson/:lessonID/:moduleID",
  courseController.removeCreatedLesson
);

//for quizz and tests
router.post("/quiz/createQuiz", quizController.createQuiz);
router.post("/quiz/deleteQuiz/:quizID/:moduleID", quizController.deleteQuiz);
router.get("/quiz/getQuiz/:moduleID", quizController.getQuizzesByModule);
router.post("/test/createTest", quizController.createTests);
router.get("/test/getTest/:courseID", quizController.getTest);

router.post("/createQuestion", quizController.createQuestion);
router.get("/getQuestions/:ID", quizController.getQuizQuestions);
router.put("/editQuestion", quizController.editQuestion);
router.post("/deleteQuestion/:questionID", quizController.deleteQuestion);

router.post("/submitAnswers", quizController.submitAnswers);

//forcomments
router.post("/addComment", commentsController.addComment);
router.get("/getComments/:lesson_id", commentsController.getLessonComments);
router.post("/deleteComment/:comment_id", commentsController.deleteComment);
router.put("/editComment", commentsController.editComment);

///for draft
router.get("/getAllCourses", draftController.getAllCourses);
router.post(
  "/saveCompleted/:userID/:courseID",
  draftController.saveAsCompleted
);
router.get(
  "/getOldCourse/:courseId/:userId",
  draftController.getOldCourseDetails
);
router.post("/savedraft/:userID/:courseID", draftController.saveAsDraft);

module.exports = router;
