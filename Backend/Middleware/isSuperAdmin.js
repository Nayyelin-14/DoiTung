const { eq } = require("drizzle-orm");
const { users } = require("../db");
const db = require("../db/db");

exports.isSuperAdmin = async (req, res, next) => {
  try {
    const user_ID = req.userID;

    const userDOC = await db
      .select()
      .from(users)
      .where(eq(users.user_id, user_ID));
    if (!userDOC) {
      throw new Error("Unauthorized user");
    }

    const superadminRole = userDOC[0].role === "superadmin";

    if (!superadminRole) {
      throw new Error("Access denied!!!. Unauthorized user");
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
