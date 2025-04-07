const { z } = require("zod");

const handleZodError = (res, error) => {
  const errors = error.issues.map((err) => ({
    path: err.path.join("."),
    message: err.message,
  }));
  return res.status(400).json({
    message: error.message,
    errors,
  });
};

exports.errorHandler = (err, req, res, next) => {
  if (err instanceof z.ZodError) {
    return handleZodError(res, err);
  }
  const statusCode =
    res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};
