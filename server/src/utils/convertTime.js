const { DateTime } = require("luxon");

// Function to convert local date and time to UTC
const toUtcDate = (dateStr, timeStr, timezone) => {
  // Combine date + time and set the input timezone (e.g., "Africa/Lagos")
  const localTime = DateTime.fromISO(`${dateStr}T${timeStr}`, {
    zone: timezone,
  });

  // Convert to UTC and return as JavaScript Date
  return localTime.toUTC().toJSDate();
};
module.exports = toUtcDate;
