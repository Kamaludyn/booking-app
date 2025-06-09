import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

export default function BookingPreferencesForm({ initialData = {}, onSave }) {
  const [duration, setDuration] = useState(initialData.duration || 60);
  const [buffer, setBuffer] = useState(initialData.buffer || 15);
  const [cancellationNotice, setCancellationNotice] = useState(
    initialData.cancellationNotice || 24
  );

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ duration, buffer, cancellationNotice });
  };

  return (
    <section>
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={() => navigate(-1)}
          className="text-primary-500 hover:text-primary-500/70 p-2 bg-primary-500/20 rounded-lg cursor-pointer"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-2xl font-semibold text-text-500 dark:text-white">
          Booking Preferences
        </h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-text-500 dark:text-white mb-1">
            Default Appointment Duration (minutes)
          </label>
          <input
            type="number"
            min={15}
            step={15}
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full rounded-lg border border-border-500 dark:border-border-800 bg-surface-500 dark:bg-surface-800 px-4 py-2 text-text-500 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-500 dark:text-white mb-1">
            Buffer Time Between Appointments (minutes)
          </label>
          <input
            type="number"
            min={0}
            step={5}
            value={buffer}
            onChange={(e) => setBuffer(Number(e.target.value))}
            className="w-full rounded-lg border border-border-500 dark:border-border-800 bg-surface-500 dark:bg-surface-800 px-4 py-2 text-text-500 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-500 dark:text-white mb-1">
            Minimum Cancellation Notice (hours)
          </label>
          <input
            type="number"
            min={1}
            step={1}
            value={cancellationNotice}
            onChange={(e) => setCancellationNotice(Number(e.target.value))}
            className="w-full rounded-lg border border-border-500 dark:border-border-800 bg-surface-500 dark:bg-surface-800 px-4 py-2 text-text-500 dark:text-white"
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-primary-500 text-white font-medium hover:bg-primary-600"
        >
          Save Preferences
        </button>
      </form>
    </section>
  );
}
