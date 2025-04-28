const jwt = require("jsonwebtoken");

exports.authMiddleware = async (req, res, next) => {
  try {
    const BearerToken = req.headers["authorization"]; // Extract Bearer token
    if (!BearerToken) {
      return res.status(401).json({
        isSuccess: false,
        message: "Access Denied. No token provided.",
      });
    }

    const JWT_formatToken = BearerToken.split(" ")[1]; // Format token
    if (!JWT_formatToken) {
      return res.status(401).json({
        isSuccess: false,
        message: "Unauthorized! Please Try Again.",
      });
    }

    const LoginToken = jwt.verify(JWT_formatToken, process.env.JWT_KEY); // Verify token
    console.log("logintoken ", LoginToken);
    req.userID = LoginToken.userId; // Attach userId to request object
    console.log("auth", req.userID);
    next(); // Pass control to the next middleware/controller
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        isSuccess: false,
        message: "Session expired. Please log in again.",
      });
    }

    return res.status(401).json({
      isSuccess: false,
      message: "Invalid token.",
    });
  }
};

// module.exports = authMiddleware;
