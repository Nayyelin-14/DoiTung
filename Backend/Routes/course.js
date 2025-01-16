const express = require("express");
const router = express.Router();
const courseController = require("../Controllers/courses");

router.get("/get_AllCourses", courseController.getAllCourses);
router.get("/get_PopularCourses", courseController.get_PopularCourses);
router.get(
  "/explore_courses/overview/:courseID",
  courseController.courseDetail
);
module.exports = router;
