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
    console.log(allusers);
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
