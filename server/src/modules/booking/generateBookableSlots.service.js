const Booking = require("./booking.model");
const Availability = require("../availability/availability.model");
const { DateTime } = require("luxon");

/**
 * Generates a list of available time slots for a given vendor on a specific date,
 * taking into account working hours, breaks, existing bookings, and total service duration.
 *
 * @param {string} date - The booking date in "YYYY-MM-DD" format.
 * @param {number} totalServiceDuration - Total service duration in minutes.
 * @param {string} vendorId - The ID of the vendor to check availability for.
 * @returns {Promise<string[]>} Array of available slot strings in "HH:mm" format.
 */
const generateBookableSlots = async (date, totalServiceDuration, vendorId) => {
  try {
    if (!date || !totalServiceDuration || !vendorId) {
      throw new Error(
        "Missing required input: date, totalServiceDuration, or vendorId"
      );
    }

    //  Helper to convert time string (e.g., "09:00") into UTC Date object for the given day.

    const makeDate = (input, zone) => {
      // If input is already a Date object, just convert to the right timezone
      if (input instanceof Date) {
        return DateTime.fromJSDate(input, { zone }).toUTC().toJSDate();
      }

      // Otherwise, parse as time string
      if (!input || !input.includes(":")) {
        throw new Error(`Invalid time format: ${input}. Expected HH:mm`);
      }

      const dt = DateTime.fromFormat(`${date} ${input}`, "yyyy-MM-dd HH:mm", {
        zone: zone,
      });

      if (!dt.isValid) {
        throw new Error(
          `Invalid date created from ${date} ${input}: ${dt.invalidReason}`
        );
      }

      return dt.toUTC().toJSDate();
    };

    // Get vendor availability
    const vendorAvailability = await Availability.findOne({ vendorId });
    if (!vendorAvailability) throw new Error("Vendor availability not found");

    const zone = vendorAvailability.timezone || "Africa/Lagos";

    // Get today's availability
    const dayName = DateTime.fromISO(date).toFormat("EEEE").toLowerCase();
    const todayAvailability = vendorAvailability.weeklyAvailability.find(
      (day) => day.day === dayName
    );

    if (!todayAvailability || !todayAvailability.isOpen) {
      throw new Error(`Vendor not available on ${dayName}s`);
    }

    //  Parse working hours into UTC Date objects
    const workingStart = makeDate(todayAvailability.workingHours.start, zone);
    const workingEnd = makeDate(todayAvailability.workingHours.end, zone);

    // 4. Fetch existing bookings that conflict with working hours
    const existingBookings = await Booking.find({
      vendorId,
      "time.start": { $lt: workingEnd },
      "time.end": { $gt: workingStart },
      date,
      status: { $in: ["upcoming", "rescheduled"] },
    }).select("time.start time.end");

    // Checks if two time ranges overlap.
    function overlaps(startA, endA, startB, endB) {
      return startA < endB && endA > startB;
    }

    // Generate time slots
    const slots = [];
    let current = new Date(workingStart.getTime());
    const endBoundary = new Date(workingEnd.getTime());

    // Get breaks as array of {start, end} objects
    const breaks = todayAvailability.breaks.map((brk) => ({
      start: makeDate(brk.start, zone),
      end: makeDate(brk.end, zone),
    }));

    // Loop through the working period to generate time slots
    while (current < endBoundary) {
      const next = new Date(current.getTime() + totalServiceDuration * 60000);
      if (next > endBoundary) break;

      // Check against breaks
      const isInBreak = breaks.some((brk) =>
        overlaps(current, next, brk.start, brk.end)
      );

      // Check if this slot overlaps with any existing booking
      const isInBooking = existingBookings.some((book) => {
        const bookingStart = new Date(book.time.start);
        const bookingEnd = new Date(book.time.end);
        return overlaps(current, next, bookingStart, bookingEnd);
      });

      if (!isInBooking && !isInBreak) {
        slots.push(DateTime.fromJSDate(current).toFormat("HH:mm"));
      }

      current = next;
    }

    return slots;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
      });
    } else {
      console.error("Slot generation failed:", error.message);
    }
    // Rethrow the error to be handled by the global error handler
    throw error;
  }
};

module.exports = generateBookableSlots;
