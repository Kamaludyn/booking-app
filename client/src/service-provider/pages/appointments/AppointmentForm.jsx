import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useServices } from "../../hooks/UseServices";
import { useCreateBooking } from "../../hooks/UseAppointments";
import { ThreeDot } from "react-loading-indicators";
import { ChevronLeft } from "lucide-react";

export default function AppointmentForm() {
  const navigate = useNavigate();
  const { data: services } = useServices();
  const {
    mutate,
    isPending,
    isError: isSubmitError,
    error,
  } = useCreateBooking();
  const [formData, setFormData] = useState({
    client: {
      name: "",
      email: "",
      phone: "",
    },
    service: {},
    date: "",
    time: "",
    notes: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "serviceId") {
      // Find the selected service object
      const selectedService = services.find((service) => service._id === value);
      setFormData((prev) => ({
        ...prev,
        service: selectedService, // Store the entire service object
      }));
    } else if (["name", "email", "phone"].includes(name)) {
      // Check if it's a client field
      setFormData((prev) => ({
        ...prev,
        client: {
          ...prev.client,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Parse the start time and calculate the end time
    const startTime = new Date(`1970-01-01T${formData.time}:00`);
    const endTime = new Date(
      startTime.getTime() +
        (formData.service.duration + formData.service.bufferTime) * 60000
    );

    // Format the end time back to "HH:mm"
    const formattedEndTime = endTime.toISOString().slice(11, 16);

    // Prepare appointment data before sending to backend
    const apptData = {
      ...formData,
      serviceId: formData.service._id,
      time: {
        start: formData.time,
        end: formattedEndTime,
      },
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      createdBy: "vendor",
    };

    // Call the useQuery mutation to create booking
    mutate(apptData);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={() => navigate(-1)}
          className="text-primary-500 hover:text-primary-500/70 p-2 bg-surface-600 dark:bg-surface-600/10 rounded-lg cursor-pointer"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-2xl font-semibold text-text-500 dark:text-white">
          New Appointment
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-surface-500 dark:bg-surface-800 p-6 rounded-xl border border-border-500 dark:border-border-800 shadow-sm"
      >
        <div>
          <label className="block text-sm text-text-400 dark:text-text-700 mb-1">
            Client Name
          </label>
          <input
            type="text"
            name="name"
            required
            value={formData.client.name}
            onChange={handleChange}
            className="w-full rounded-lg border border-border-500 dark:border-text-700/50 bg-background-800/5 dark:bg-transparent px-3 py-2 text-text-500 dark:text-white focus:ring focus:ring-primary-500 dark:focus:ring-white focus:border-transparent outline-0"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-text-400 dark:text-text-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.client.email}
              onChange={handleChange}
              className="w-full rounded-lg border border-border-500 dark:border-text-700/50 bg-background-800/5 dark:bg-transparent px-3 py-2 text-text-500 dark:text-white focus:ring focus:ring-primary-500 dark:focus:ring-white focus:border-transparent outline-0"
            />
          </div>
          <div>
            <label className="block text-sm text-text-400 dark:text-text-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.client.phone}
              onChange={handleChange}
              className="w-full rounded-lg border border-border-500 dark:border-text-700/50 bg-background-800/5 dark:bg-transparent px-3 py-2 text-text-500 dark:text-white focus:ring focus:ring-primary-500 dark:focus:ring-white focus:border-transparent outline-0"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-text-400 dark:text-text-700 mb-1">
            Service
          </label>
          <select
            name="serviceId"
            required
            value={formData.serviceId}
            onChange={handleChange}
            className="w-full rounded-lg border border-border-500 dark:border-text-700/50 bg-background-800/5 dark:bg-transparent px-3 py-2 text-text-500 dark:text-white focus:ring focus:ring-primary-500 dark:focus:ring-white focus:border-transparent outline-0"
          >
            <option
              value=""
              className="dark:bg-surface-800 dark:text-white bg-white text-black"
            >
              Select a service
            </option>
            {services &&
              services.map((service) => (
                <option
                  key={service._id}
                  value={service._id}
                  className="dark:bg-surface-800 dark:text-white bg-white text-black"
                >
                  {service.name}
                </option>
              ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-text-400 dark:text-text-700 mb-1">
              Date
            </label>
            <input
              type="date"
              name="date"
              required
              value={formData.date}
              onChange={handleChange}
              className="w-full rounded-lg border border-border-500 dark:border-text-700/50 bg-background-800/5 dark:bg-transparent px-3 py-2 text-text-500 dark:text-white focus:ring focus:ring-primary-500 dark:focus:ring-white focus:border-transparent outline-0"
            />
          </div>
          <div>
            <label className="block text-sm text-text-400 dark:text-text-700 mb-1">
              Time
            </label>
            <input
              type="time"
              name="time"
              required
              value={formData.time}
              onChange={handleChange}
              className="w-full rounded-lg border border-border-500 dark:border-text-700/50 bg-background-800/5 dark:bg-transparent px-3 py-2 text-text-500 dark:text-white focus:ring focus:ring-primary-500 dark:focus:ring-white focus:border-transparent outline-0"
            />
          </div>
        </div>
        {isSubmitError && (
          <div>
            <p className="text-red-500 text-sm">
              {error?.response?.data?.message ||
                error?.message ||
                "An error occurred while submitting the form."}
            </p>
          </div>
        )}
        <div>
          <label className="block text-sm text-text-400 dark:text-text-700 mb-1">
            Notes
          </label>
          <textarea
            name="notes"
            rows="2"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Optional notes..."
            className="w-full rounded-lg border border-border-500 dark:border-text-700/50 bg-background-800/5 dark:bg-transparent px-3 py-2 text-text-500 dark:text-white focus:ring focus:ring-primary-500 dark:focus:ring-white focus:border-transparent outline-0"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className={`bg-primary-500 dark:bg-primary-500/50 text-white px-5 py-2 rounded-lg hover:opacity-90 cursor-pointer ${
              isPending && "cursor-not-allowed px-11.5"
            }`}
          >
            {isPending ? (
              <ThreeDot color="white" size="small" textColor="blue" />
            ) : (
              "Save Appointment"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
