const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const connectDb = require("./config/dbConnection");

require("dotenv").config();

// Establish connection to the database
connectDb();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Sample route
app.get("/", (req, res) => {
  res.send("Booking App API is running");
});

// Connect DB and start server
const PORT = process.env.PORT || 5000;
// mongoose
//   .connect(process.env.MONGODB_URI)
//   .then(() => {
//     app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//   })
//   .catch(err => console.error('MongoDB connection error:', err));

// server.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
