const { eq } = require("drizzle-orm");
const { users } = require("../db");
const db = require("../db/db");

exports.isSuperAdmin = async (req, res, next) => {
  try {
    const user_ID = req.userID ? req.userID : null;
    console.log(user_ID);
    if (user_ID !== null) {
      const userDOC = await db
        .select()
        .from(users)
        .where(eq(users.user_id, user_ID));

      if (userDOC.length === 0) {
        throw new Error("Unauthorized user");
      }
      const role = userDOC[0].role;

      if (role !== "superadmin") {
        throw new Error("Access denied!!!. Unauthorized user");
      }
      req.role = role;
    }
    const role = req.role ? req.role : null;
    if (role !== null) {
      if (role !== "superadmin") {
        throw new Error("Access denied!!!. Unauthorized user");
      }
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
