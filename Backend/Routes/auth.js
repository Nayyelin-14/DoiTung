const express = require("express");
const router = express.Router();
const authControllers = require("../Controllers/auth");
const authMiddleware = require("../Middleware/auth");
const { isSuperAdmin } = require("../Middleware/isSuperAdmin");
const { isUser } = require("../Middleware/isUser");
const { isAdmin } = require("../Middleware/isAdmin");

router.post("/login", authControllers.LoginUser);
router.post(
  "/register",
  authMiddleware,
  isSuperAdmin,
  authControllers.registerUser
);

router.get("/getCurrentUser", authMiddleware, authControllers.checkUser);
router.put(
  "/edit-profile",
  authMiddleware,
  isUser,
  authControllers.editProfile
);

router.post("/logoutaction", authMiddleware, authControllers.handleLogout);
router.post(
  "/adminloginaction",

  authControllers.adminsLoginHandler
);
module.exports = router;
