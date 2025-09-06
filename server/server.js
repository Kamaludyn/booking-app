require("dotenv").config();
const app = require("./src/app.js");
const { connectDB } = require("./src/config/dbConnection.js");
const startReminderScheduler = require("./src/modules/booking/reminderScheduler.job.js");
const checkMissedBookings = require("./src/modules/booking/missedBookings.job.js");

const PORT = process.env.PORT;

// connect to DB before starting server
(async () => {
  try {
    // Connect to MongoDB using Mongoose
    await connectDB();

    // Start background scheduler
    if (process.env.NODE_ENV !== "development") {
      startReminderScheduler();
    }
    checkMissedBookings();

    // If DB connection succeeds, start the server
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    // If DB connection fails, log the error and exit the process
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
})();
