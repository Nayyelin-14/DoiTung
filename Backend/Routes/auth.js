const express = require("express");
const router = express.Router();
const authControllers = require("../Controllers/auth");
const authMiddleware = require("../Middleware/auth");

router.post("/login", authControllers.LoginUser);
router.post("/register", authControllers.registerUser);
router.post(
  "/account_verification/:token",

  authControllers.emailConfirmwithToken
);
router.get("/getCurrentUser", authMiddleware, authControllers.checkUser);
// router.put("update-profile", authMiddleware, authControllers.updateProfile);
router.post("/google", authControllers.OauthLogin);
module.exports = router;
