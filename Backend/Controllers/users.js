const { eq, and } = require("drizzle-orm");
const { users } = require("../db");
const db = require("../db/db");

exports.getallusers = async (req, res) => {
  try {
    const allusers = await db.select().from(users);
    if (allusers.length === 0) {
      return res.status(404).json({
        isSuccess: false,
        message: "No user found!!!",
      });
    }

    return res.status(200).json({
      isSuccess: true,
      message: "Users found",
      allusers,
    });
  } catch (error) {
    return res.status(404).json({
      isSuccess: false,
      message: error.message,
    });
  }
};

exports.EnableTwoStep = async (req, res) => {
  const { isTwostepEnabled, email, userID } = req.body;
  console.log(userID);

  try {
    const userDoc = await db
      .select()
      .from(users)
      .where(eq(users.user_id, userID));

    // Check if the user exists
    if (userDoc.length === 0) {
      return res.status(404).json({
        isSuccess: false,
        message: "User not found. Something went wrong.",
      });
    }

    // Update the two-step verification status
    await db
      .update(users)
      .set({ isTwostepEnabled: isTwostepEnabled })
      .where(eq(users.user_id, userID));

    // Check if two-step verification is enabled or disabled
    if (isTwostepEnabled === true || isTwostepEnabled === "true") {
      return res.status(200).json({
        isSuccess: "enabled",
        message: "Two-step verification enabled.",
      });
    }
    if (isTwostepEnabled === false || isTwostepEnabled === "false") {
      return res.status(200).json({
        isSuccess: "disabled",
        message: "Two-step verification disabled.",
      });
    }

    // If the value is neither true nor false
    return res.status(400).json({
      isSuccess: false,
      message: "Invalid value for two-step verification.",
    });
  } catch (error) {
    return res.status(400).json({
      isSuccess: false,
      message: error.message,
    });
  }
};
