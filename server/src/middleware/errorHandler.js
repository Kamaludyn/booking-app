// Global Error Handling Middleware
const errorHandler = (err, req, res, next) => {
  // Set default status code and message if not explicitly set
  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // Respond with standardized error object
  res.status(statusCode).json({
    success: false,
    message,
    stack: err.stack,
  });
};

module.exports = errorHandler;
