const { user_Courses } = require("../db");
const db = require("../db/db");

exports.courseEnrollmentDatas = async (req, res) => {
  try {
    const allEnrollments = await db
      .select({ enrolled_at: user_Courses.enrolled_at })
      .from(user_Courses);

    if (allEnrollments.length === 0) {
      throw new Error("There is no enrollments");
    }
    const dailyCounts = {};
    console.log("fiirst", dailyCounts);
    allEnrollments.forEach((enrollment) => {
      // Extract the date part from the 'enrolled_at' timestamp
      console.log("to add", enrollment);
      const enrolledDate = enrollment.enrolled_at.toISOString().split("T")[0];

      // Increment the count for that date
      dailyCounts[enrolledDate] = (dailyCounts[enrolledDate] || 0) + 1;
      //       Left Side (dailyCounts[enrolledDate]): This is where you are setting or accessing a value within the dailyCounts object using enrolledDate as the key.

      // Right Side ((dailyCounts[enrolledDate] || 0) + 1): This is the value that is being assigned to the key on the left side. Let's break down how this value is determined:

      // (dailyCounts[enrolledDate] || 0): This part first tries to retrieve the current value associated with the enrolledDate key in the dailyCounts object.
      // If the enrolledDate key already exists, it gets its current value.
      // If the enrolledDate key does not exist yet, accessing it returns undefined. The || 0 then provides a default value of 0 in this case.
      // + 1: This adds 1 to the retrieved (or default) value.
    });

    console.log("Daily Enrollment Counts:", dailyCounts);
  } catch (error) {
    console.error("Error fetching course enrollment trends:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
