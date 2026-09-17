const { logger } = require("../utils/logger");

const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

const errorHandler = (err, req, res, next) => {
  logger.error({
    msg: "Unhandled request error",
    message: err?.message,
    stack: err?.stack,
    route: req.originalUrl,
    method: req.method,
  });

  if (err?.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: Object.values(err.errors).map((e) => e.message),
    });
  }

  if (err?.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "A record with the same unique value already exists",
    });
  }

  const status = Number.isInteger(err?.statusCode) ? err.statusCode : 500;

  return res.status(status).json({
    success: false,
    message:
      status === 500 && process.env.NODE_ENV === "production"
        ? "Internal Server Error"
        : err?.message || "Internal Server Error",
  });
};

module.exports = { notFound, errorHandler };
