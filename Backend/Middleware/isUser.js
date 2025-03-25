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
      throw new Error("Unauthorized user");
    }

    const userRole = userDOC[0].role === "user";

    if (!userRole) {
      throw new Error("Access denied!!!. Unauthorized user");
    }
    req.userRole = userDOC[0].role;
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
