import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

export default function AppointmentForm() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Appointment saved!");
    navigate("/appointments");
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
        <div className="flex flex-col space-y-1">
          <label className="text-sm text-text-400">Client</label>
          <select
            required
            className="p-2 rounded-lg bg-white dark:bg-background-800 text-text-500 dark:text-white border border-border-500 dark:border-border-800"
          >
            <option value="">Select a client</option>
            <option value="emily">Emily Parker</option>
            <option value="james">James Smith</option>
          </select>
        </div>

        <div className="flex flex-col space-y-1">
          <label className="text-sm text-text-400">Service</label>
          <select
            required
            className="p-2 rounded-lg bg-white dark:bg-background-800 text-text-500 dark:text-white border border-border-500 dark:border-border-800"
          >
            <option value="">Select a service</option>
            <option value="haircut">Haircut</option>
            <option value="massage">Massage</option>
            <option value="consultation">Consultation</option>
          </select>
        </div>

        <div className="flex flex-col space-y-1">
          <label className="text-sm text-text-400">Date & Time</label>
          <input
            required
            type="datetime-local"
            className="p-2 rounded-lg bg-white dark:bg-background-800 text-text-500 dark:text-white border border-border-500 dark:border-border-800"
          />
        </div>

        <div className="flex flex-col space-y-1">
          <label className="text-sm text-text-400">Notes</label>
          <textarea
            rows={3}
            className="p-2 rounded-lg bg-white dark:bg-background-800 text-text-500 dark:text-white border border-border-500 dark:border-border-800"
            placeholder="Optional notes..."
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
          >
            Save Appointment
          </button>
        </div>
      </form>
    </div>
  );
}
