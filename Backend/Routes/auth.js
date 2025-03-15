const express = require("express");
const router = express.Router();
const authControllers = require("../Controllers/auth");
const authMiddleware = require("../Middleware/auth");

router.post("/login", authControllers.LoginUser);
router.post("/register", authControllers.registerUser);

router.get("/getCurrentUser", authMiddleware, authControllers.checkUser);
router.put("/edit-profile", authMiddleware, authControllers.editProfile);

module.exports = router;
