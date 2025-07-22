const mongoose = require("mongoose");

const availabilitySchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    timezone: {
      type: String,
      required: true,
    },
    weeklyAvailability: [
      {
        day: {
          type: String,
          enum: [
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
            "sunday",
          ],
          required: true,
        },
        isOpen: {
          type: Boolean,
          default: false,
        },
        workingHours: {
          start: String, // "09:00"
          end: String, // "17:00"
        },
        breaks: [
          {
            start: String,
            end: String,
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

const Availability = mongoose.model("Availability", availabilitySchema);
module.exports = Availability;
