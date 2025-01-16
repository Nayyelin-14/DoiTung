const jwt = require("jsonwebtoken");
const authMiddleware = async (req, res, next) => {
  try {
    const BearerToken = req.headers["authorization"]; // Extract Bearer token
    if (!BearerToken) {
      throw new Error("An unexpected error occurred");
    }

    const JWT_formatToken = BearerToken.split(" ")[1]; // Format token
    if (!JWT_formatToken) {
      throw new Error("Unauthorized!!! Please Try Again");
    }

    const LoginToken = jwt.verify(JWT_formatToken, process.env.JWT_KEY); // Verify token

    if (!LoginToken) {
      throw new Error("Something went wrong");
    }
    req.userID = LoginToken.userId; // Attach userId to request object

    next(); // Pass control to the next middleware/controller
  } catch (err) {
    return res.status(401).json({
      isSuccess: false,
      message: err.message,
    });
  }
};

module.exports = authMiddleware;
