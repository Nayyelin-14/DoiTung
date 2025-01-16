// server.js

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const morgan = require("morgan");
const { db } = require("./db/db");

const authRoutes = require("./Routes/auth");
const courseRoutes = require("./Routes/course");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(morgan("dev"));
app.use("/auth", authRoutes);
app.use(courseRoutes);
// Initialize Drizzle and start the server

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
module.exports = { db };
