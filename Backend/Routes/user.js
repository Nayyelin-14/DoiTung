const express = require("express");
const router = express.Router();
const usercontroller = require("../Controllers/users");
const countController = require("../Controllers/counts");
const { CheckEnrollment } = require("../Middleware/checkEnrollment");
const reviewController = require("../Controllers/review");
const authMiddleware = require("../Middleware/auth");
const { isAdmin } = require("../Middleware/isAdmin");
const { isUser } = require("../Middleware/isUser");
const { isSuperAdmin } = require("../Middleware/isSuperAdmin");
const adminController = require("../Controllers/admin");

router.get("/getallusers", usercontroller.getallusers);
router.get("/totalDatas", countController.totalDataCount);
router.post("/enableTwostep", usercontroller.EnableTwoStep);
router.post(
  "/CourseEnrollment/:userid/:courseid",
  authMiddleware,
  CheckEnrollment,
  usercontroller.Enrollment
);
router.get(
  "/CheckEnrollment/:userid/:courseid",
  usercontroller.CheckEnrolledCourse
);
router.get("/enrolledCourses/:userid", usercontroller.getEnrolledCourses);

router.get(
  "/fetchcourse/:userid/:courseid",
  authMiddleware,
  usercontroller.CourseToLearn
);
router.post(
  "/restrictuser/:userid",
  authMiddleware,
  isSuperAdmin,
  usercontroller.restrictUser
);
router.post(
  "/unrestrictUser/:userid",
  authMiddleware,
  isSuperAdmin,
  usercontroller.UnRestrictUser
);
router.post(
  "/removeaccount/:userid",
  authMiddleware,
  isSuperAdmin,
  usercontroller.removeUser
);
router.post("/sendreport", authMiddleware, adminController.sendReport);

//Course Review
router.post(
  "/review/addCourseReview",
  authMiddleware,
  isUser,
  reviewController.addCourseReview
);
router.get(
  "/review/getCourseReview/:course_id",
  authMiddleware,
  isUser,
  reviewController.getCourseReviews
);
router.put(
  "/review/editReview",
  authMiddleware,
  isUser,
  reviewController.editCourseReview
);
router.get(
  "/review/checkReview/:user_id/:course_id",
  reviewController.checkUserReview
);
router.get(
  "/review/getAllReviews",
  reviewController.getAllReviews
)

router.get(
  "/progress/:courseID/:userID",
  authMiddleware,
  countController.totalLessonCounts
);

router.get(
  "/getAllenrollments",
  authMiddleware,
  isAdmin,
  usercontroller.allUserEnrollments
);

router.post(
  "/save_progress/:courseID/:userID",
  authMiddleware,
  isUser,
  usercontroller.setProgress
);

router.get(
  "/getreports",
  authMiddleware,
  isUser,
  usercontroller.getUserReports
);
router.post(
  "/mark-report-read",
  authMiddleware,
  isUser,
  usercontroller.markReportAsRead
);

module.exports = router;
