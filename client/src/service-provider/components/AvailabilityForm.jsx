import { useState } from "react";
import TimePicker from "./TimePicker";
import TimezoneSelect from "./TimezoneSelect";
import { ThreeDot } from "react-loading-indicators";

const weekdays = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

// Default availability structure
const defaultAvailability = weekdays.reduce((acc, day) => {
  acc[day] = { isOpen: false, start: "09:00", end: "17:00", breaks: [] };
  return acc;
}, {});

export default function AvailabilityForm({ onSubmit, loading }) {
  const [availability, setAvailability] = useState(defaultAvailability);
  const [timezone, setTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  // Toggle isOpen(active) status of a day
  const toggleDay = (day) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: { ...prev[day], isOpen: !prev[day].isOpen },
    }));
  };

  // Update time (start/end) of a day
  const updateTime = (day, field, value) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  };

  // Add a new break to a day
  const addBreak = (day) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        breaks: [...prev[day].breaks, { start: "12:00", end: "13:00" }],
      },
    }));
  };

  // Update a break's start/end time
  const updateBreak = (day, index, field, value) => {
    const updatedBreaks = [...availability[day].breaks];
    updatedBreaks[index][field] = value;
    setAvailability((prev) => ({
      ...prev,
      [day]: { ...prev[day], breaks: updatedBreaks },
    }));
  };

  // Remove a break from a day
  const removeBreak = (day, index) => {
    const updatedBreaks = availability[day].breaks.filter(
      (_, i) => i !== index
    );
    setAvailability((prev) => ({
      ...prev,
      [day]: { ...prev[day], breaks: updatedBreaks },
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      timezone,
      availability,
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <TimezoneSelect
        value={timezone}
        onChange={(e) => setTimezone(e.target.value)}
      />

      {weekdays.map((day) => (
        <div
          key={day}
          className="border border-border-500 dark:border-border-800 rounded-xl p-4 bg-surface-500 dark:bg-surface-800 shadow-sm hover:shadow-md"
        >
          <div className="flex justify-between items-center mb-2">
            <h2 className="capitalize text-lg font-semibold text-text-500 dark:text-white">
              {day}
            </h2>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={availability[day].isOpen}
                onChange={() => toggleDay(day)}
              />
              <span className="text-text-400">Available</span>
            </label>
          </div>

          {availability[day].isOpen && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <TimePicker
                  label="Start"
                  name="start"
                  value={availability[day].start}
                  onChange={(value) => updateTime(day, "start", value)}
                  disabled={!availability[day].isOpen}
                />
                <TimePicker
                  label="End"
                  name="end"
                  value={availability[day].end}
                  onChange={(value) => updateTime(day, "end", value)}
                  disabled={!availability[day].isOpen}
                />
              </div>
              {/* Breaks */}
              <div className="space-y-2">
                <div className="text-sm text-text-400">Breaks</div>
                {availability[day].breaks.map((brk, idx) => (
                  <div key={idx} className="flex items-center space-x-4">
                    <TimePicker
                      label="From"
                      name="from"
                      value={brk.start}
                      onChange={(value) =>
                        updateBreak(day, idx, "start", value)
                      }
                      disabled={!availability[day].isOpen}
                    />
                    <TimePicker
                      label="To"
                      name="to"
                      value={brk.end}
                      onChange={(value) => updateBreak(day, idx, "end", value)}
                      disabled={!availability[day].isOpen}
                    />
                    <button
                      type="button"
                      onClick={() => removeBreak(day, idx)}
                      className="text-danger-500 hover:underline text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addBreak(day)}
                  className="text-primary-500 hover:underline text-sm"
                >
                  + Add Break
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      <div className="pt-4">
        <button
          type="submit"
          className={`bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-xl ${
            loading && "cursor-not-allowed px-11.5"
          }`}
        >
          {loading ? (
            <ThreeDot color="white" size="small" textColor="blue" />
          ) : (
            "Save Changes"
          )}
        </button>
      </div>
    </form>
  );
}
