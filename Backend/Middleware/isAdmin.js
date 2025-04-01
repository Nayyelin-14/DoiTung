const { eq } = require("drizzle-orm");
const { users } = require("../db");
const db = require("../db/db");

exports.isAdmin = async (req, res, next) => {
  const user_ID = req.userID ? req.userID : null;
  console.log("admin ", user_ID);
  console.log(req.userID);
  try {
    if (user_ID !== null) {
      const userDOC = await db
        .select()
        .from(users)
        .where(eq(users.user_id, user_ID));

      if (userDOC.length === 0) {
        throw new Error("Unauthorized user");
      }
      const role = userDOC[0].role;
      console.log(role);
      if (role !== "admin" && role !== "superadmin") {
        throw new Error("Access denied!!!. Unauthorized user, Try again");
      }
      req.role = role;
    }

    const role = req.userRole ? req.userRole : null;

    if (role !== null) {
      if (role !== "admin" && role !== "superadmin") {
        throw new Error("Unauthorized user");
      }
      req.role = role;
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
