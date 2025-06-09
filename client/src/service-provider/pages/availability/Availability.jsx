import { useState } from "react";
import AvailabilityForm from "../../components/AvailabilityForm";
import PageHeader from "../../components/PageHeader";

const mockAvailability = {
  Monday: {
    available: true,
    start: "09:00",
    end: "17:00",
    breakStart: "12:00",
    breakEnd: "13:00",
  },
  Tuesday: { available: true, start: "09:00", end: "17:00" },
  Wednesday: { available: false },
  Thursday: { available: true, start: "10:00", end: "16:00" },
  Friday: { available: true, start: "09:00", end: "15:00" },
  Saturday: { available: false },
  Sunday: { available: false },
};

export default function Availabilit() {
  const [availability, setAvailability] = useState(mockAvailability);
  const [status, setStatus] = useState(null);

  const handleSubmit = async (updated) => {
    try {
      console.log("Saving availability:", updated);
      setAvailability(updated);
      setStatus("success");
    } catch (error) {
      setStatus("error");
    } finally {
      setTimeout(() => setStatus(null), 3000);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Weekly Availability" />

      <AvailabilityForm initialData={availability} onSubmit={handleSubmit} />

      {status === "success" && (
        <div className="mt-4 text-success-500 text-sm">
          Availability updated successfully.
        </div>
      )}
      {status === "error" && (
        <div className="mt-4 text-danger-500 text-sm">
          Something went wrong. Please try again.
        </div>
      )}
    </div>
  );
}
