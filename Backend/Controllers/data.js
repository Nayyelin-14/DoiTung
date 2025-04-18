const { user_Courses } = require("../db");
const db = require("../db/db");

exports.courseEnrollmentDatas = async (req, res) => {
  try {
    console.log("Daily Enrollment Counts:", dailyCounts);
  } catch (error) {
    console.error("Error fetching course enrollment trends:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
