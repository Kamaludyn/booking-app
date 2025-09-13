const mongoose = require("mongoose");
const { Schema } = mongoose;

const reservationSchema = new Schema(
  {
    vendorId: { type: Schema.Types.ObjectId, ref: "Vendor", required: true },
    serviceId: { type: Schema.Types.ObjectId, ref: "Service", required: true },
    date: { type: String, required: true }, // (YYYY-MM-DD)
    timeStart: { type: String, required: true }, // "00:00"
    timeEnd: { type: String, required: true },
    timezone: { type: String, required: true },
    bookingPayload: { type: Object, required: true }, // full payload to create booking on success
    expiresAt: { type: Date, required: true, index: { expires: 0 } }, // TTL index
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reservation", reservationSchema);
