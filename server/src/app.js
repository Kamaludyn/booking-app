const express = require("express");
const compression = require("compression");
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
const registerRoutes = require("./config/registerRoutes.js");
const errorHandler = require("./middleware/errorHandler.js");
const { globalLimiter } = require("./middleware/rateLimiter");

dotenv.config();

const app = express();

// Middlewares

// Apply global rate limiter to all requests
app.use(globalLimiter);

app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logging Middleware (Only in Development)
if (process.env.NODE_ENV === "production") {
  app.use(morgan("combined")); // More detailed logs in production
} else {
  app.use(morgan("dev"));
}

// Register routes dynamically
registerRoutes(app);

// Global error handler
app.use(errorHandler);

module.exports = app;
