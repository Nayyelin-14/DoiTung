// isUser.js
const { eq } = require("drizzle-orm");
const { users } = require("../db");
const db = require("../db/db");

exports.isUser = async (req, res, next) => {
  try {
    const user_ID = req.userID;

    const userDOC = await db
      .select()
      .from(users)
      .where(eq(users.user_id, user_ID));

    if (userDOC.length === 0) {
      return res.status(401).json({
        isSuccess: false,
        message: "Unauthorized user. User not found.",
      });
    }

    if (userDOC[0].role !== "user") {
      return res.status(403).json({
        isSuccess: false,
        message: "Access denied! You are not a user.",
      });
    }

    req.userRole = userDOC[0].role;
    next();
  } catch (error) {
    console.error("isUser Middleware Error:", error);
    return res.status(500).json({
      isSuccess: false,
      message: "Server Error. Please try again later.",
    });
  }
};
