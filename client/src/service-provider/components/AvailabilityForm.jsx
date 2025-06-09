import { useState } from "react";
import TimePicker from "./TimePicker";
import TimezoneSelect from "./TimezoneSelect";

const weekdays = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const defaultAvailability = weekdays.reduce((acc, day) => {
  acc[day] = { active: false, start: "09:00", end: "17:00", breaks: [] };
  return acc;
}, {});

export default function AvailabilityForm({ onSubmit }) {
  const [availability, setAvailability] = useState(defaultAvailability);
  const [timezone, setTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );
  // const [timezone, setTimezone] = useState(
  //   initialData.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
  // );

  const toggleDay = (day) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: { ...prev[day], active: !prev[day].active },
    }));
  };

  const updateTime = (day, field, value) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  };

  const addBreak = (day) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        breaks: [...prev[day].breaks, { start: "12:00", end: "13:00" }],
      },
    }));
  };

  const updateBreak = (day, index, field, value) => {
    const updatedBreaks = [...availability[day].breaks];
    updatedBreaks[index][field] = value;
    setAvailability((prev) => ({
      ...prev,
      [day]: { ...prev[day], breaks: updatedBreaks },
    }));
  };

  const removeBreak = (day, index) => {
    const updatedBreaks = availability[day].breaks.filter(
      (_, i) => i !== index
    );
    setAvailability((prev) => ({
      ...prev,
      [day]: { ...prev[day], breaks: updatedBreaks },
    }));
  };

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
                checked={availability[day].active}
                onChange={() => toggleDay(day)}
              />
              <span className="text-text-400">Available</span>
            </label>
          </div>

          {availability[day].active && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <TimePicker
                  label="Start"
                  name="start"
                  value={availability[day].start}
                  onChange={(value) => updateTime(day, "start", value)}
                  disabled={!availability[day].active}
                />
                <TimePicker
                  label="End"
                  name="end"
                  value={availability[day].end}
                  onChange={(value) => updateTime(day, "end", value)}
                  disabled={!availability[day].active}
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
                      disabled={!availability[day].active}
                    />
                    <TimePicker
                      label="To"
                      name="to"
                      value={brk.end}
                      onChange={(value) => updateBreak(day, idx, "end", value)}
                      disabled={!availability[day].active}
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
          className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-xl"
        >
          Save Availability
        </button>
      </div>
    </form>
  );
}
