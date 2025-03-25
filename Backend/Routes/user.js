const express = require("express");
const router = express.Router();
const usercontroller = require("../Controllers/users");
const countController = require("../Controllers/counts");
const { CheckEnrollment } = require("../Middleware/checkEnrollment");
const reviewController = require("../Controllers/review");
const authMiddleware = require("../Middleware/auth");
const { isAdmin } = require("../Middleware/isAdmin");
const adminController = require("../Controllers/admin");

router.get("/getallusers", usercontroller.getallusers);
router.get("/totalDatas", countController.totalDataCount);
router.post("/enableTwostep", usercontroller.EnableTwoStep);
router.post(
  "/CourseEnrollment/:userid/:courseid",
  CheckEnrollment,
  usercontroller.Enrollment
);
router.get(
  "/CheckEnrollment/:userid/:courseid",
  usercontroller.CheckEnrolledCourse
);
router.get("/enrolledCourses/:userid", usercontroller.getEnrolledCourses);

router.get("/fetchcourse/:userid/:courseid", usercontroller.CourseToLearn);
router.post(
  "/restrictuser/:userid",
  authMiddleware,
  isAdmin,
  usercontroller.restrictUser
);
router.post(
  "/unrestrictUser/:userid",
  authMiddleware,
  isAdmin,
  usercontroller.UnRestrictUser
);
router.post(
  "/removeaccount/:userid",
  authMiddleware,
  isAdmin,
  usercontroller.removeUser
);
router.post("/sendreport", authMiddleware,isAdmin,adminController.sendReport);


//Course Review
router.post("/review/addCourseReview", reviewController.addCourseReview);
router.get(
  "/review/getCourseReview/:course_id",
  reviewController.getCourseReviews
);
router.put("/review/editReview", reviewController.editCourseReview);
router.get(
  "/review/checkReview/:user_id/:course_id",
  reviewController.checkUserReview
);
router.get(
  "/progress/:courseID/:userID",
  authMiddleware,
  countController.totalLessonCounts
);

router.get("/getAllenrollments", usercontroller.allUserEnrollments);

router.post(
  "/save_progress/:courseID/:userID",
  authMiddleware,
  usercontroller.setProgress
);

module.exports = router;
