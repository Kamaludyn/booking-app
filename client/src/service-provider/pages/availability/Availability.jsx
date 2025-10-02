import { useState, useEffect } from "react";
import AvailabilityForm from "../../components/AvailabilityForm";
import PageHeader from "../../components/PageHeader";
import api from "../../../shared/services/api";
import { toast } from "@acrool/react-toaster";

export default function Availability() {
  const [availability, setAvailability] = useState(null);
  const [timezone, setTimezone] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch availability data on component mount
  useEffect(() => {
    const getAvailability = async () => {
      try {
        const res = await api.get("/availability");
        const avail = res.data?.availability;
        const formatted = avail.weeklyAvailability.reduce((acc, day) => {
          acc[day.day.toLowerCase()] = {
            isOpen: day.isOpen,
            start: day.workingHours.start,
            end: day.workingHours.end,
            breaks: day.breaks,
          };
          return acc;
        }, {});
        setAvailability(formatted);
        setTimezone(avail.timezone);
      } catch (err) {
        if (err.message === "Network Error") {
          toast.error("Please check your network connection");
        } else {
          toast.error(err.response?.data?.message || "An error occurred");
        }
      }
    };
    getAvailability();
  }, []);

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
      setAvailability(updated.availability);
      setTimezone(updated.timezone);
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

      <AvailabilityForm
        initialData={{ availability, timezone }}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
}
