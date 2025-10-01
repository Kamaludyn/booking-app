import { useState } from "react";
import AvailabilityForm from "../../components/AvailabilityForm";
import PageHeader from "../../components/PageHeader";
import api from "../../../shared/services/api";
import { toast } from "@acrool/react-toaster";

export default function Availability() {
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle form submission
  const handleSubmit = async (updated) => {
    setLoading(true);

    // Transform the availability state into the format expected by the backend
    const availabilityData = {
      timezone: updated.timezone,
      weeklyAvailability: Object.entries(updated.availability).map(
        ([day, info]) => ({
          day: day,
          isOpen: info.isOpen,
          workingHours: {
            start: info.start,
            end: info.end,
          },
          breaks: info.breaks.map((b) => ({
            start: b.start,
            end: b.end,
          })),
        })
      ),
    };
    try {
      const res = await api.put("/availability", availabilityData);
      toast.success("Availability updated successfully!");
    } catch (err) {
      if (err.message === "Network Error") {
        toast.error("Please check your network connection");
      } else {
        toast.error(err.response?.data?.message || "An error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Weekly Availability" />

      <AvailabilityForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
}
