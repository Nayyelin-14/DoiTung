const express = require("express");
const router = express.Router();
const usercontroller = require("../Controllers/users");
const countController = require("../Controllers/counts");
router.get("/getallusers", usercontroller.getallusers);

router.get("/totalDatas", countController.totalDataCount);

router.post("/enableTwostep", usercontroller.EnableTwoStep);
module.exports = router;
