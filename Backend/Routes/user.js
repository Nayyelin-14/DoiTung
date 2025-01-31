const express = require("express");
const router = express.Router();
const usercontroller = require("../Controllers/users");
const countController = require("../Controllers/counts");
const { CheckEnrollment } = require("../Middleware/checkEnrollment");

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
router.post("/restrictuser/:userid", usercontroller.restrictUser);
router.post("/unrestrictUser/:userid", usercontroller.UnRestrictUser);
router.post("/removeaccount/:userid", usercontroller.removeUser);
module.exports = router;
