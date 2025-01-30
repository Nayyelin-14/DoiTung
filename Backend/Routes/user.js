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

router.get("/fetchcourse/:userid/:courseid", usercontroller.CourseToLearn);

module.exports = router;
