// server.js

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const { db } = require("./db/db");
const userRoutes = require("./Routes/user");
const authRoutes = require("./Routes/auth");
const courseRoutes = require("./Routes/course");
const multer = require("multer");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware

app.use(cors({ origin: "*" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());
app.use(morgan("dev"));

///multer
const storageConfig = multer.diskStorage({
  filename: (req, file, cb) => {
    const suffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, suffix + "-" + file.originalname);
  },
});
const filterConfig = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "video/mp4" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only images and MP4 videos are allowed!"), false);
  }
};
///
app.use(
  multer({ storage: storageConfig, fileFilter: filterConfig }).fields([
    { name: "thumbnail", maxCount: 1 }, // Single file for "thumbnail"
    { name: "courseDemo", maxCount: 1 },
    { name: "lesson_content", maxCount: 1 },
  ])
);

app.use("/auth", authRoutes);
app.use(courseRoutes);
app.use(userRoutes);
// Initialize Drizzle and start the server

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
module.exports = { db };
