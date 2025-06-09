import { useParams, useNavigate } from "react-router-dom";
import { useClient } from "../../hooks/UseClients";
import {
  Phone,
  Mail,
  Calendar,
  Clock,
  DollarSign,
  Edit,
  ChevronLeft,
} from "lucide-react";

export default function ClientDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const client = useClient(id);

  if (!client) {
    return <div className="text-center text-text-400">Client not found.</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center max-w-2xl mx-auto">
      <div className="self-start flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-primary-500 hover:text-primary-500/70 p-2 bg-surface-600 dark:bg-surface-600/10 rounded-lg cursor-pointer"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-2xl font-semibold text-text-500 dark:text-white">
          Client Details
        </h1>
      </div>
      <div className="bg-surface-500 dark:bg-surface-800 w-full max-w-2xl rounded-lg border border-border-500 dark:border-border-800 shadow-sm hover:shadow-md">
        <div className="p-4 md:p-6 border-b border-border-500 dark:border-border-800">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-500 font-medium text-xl">
                {client.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-text-500 dark:text-white">
                  {client.name}
                </h2>
                <div className="flex flex-col sm:flex-row gap-1 md:gap-3 text-sm text-text-400 dark:text-text-600 mt-1">
                  <span className="flex items-center gap-1">
                    <Phone size={14} /> {client.contact.phone}
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail size={14} /> {client.contact.email}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 md:p-6 space-y-4 md:space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-4">
            <StatCard
              icon={<Calendar size={16} />}
              value={client.stats.totalAppointments}
              label="Total Visits"
            />
            <StatCard
              icon={<Clock size={16} />}
              value={client.stats.missed}
              label="Missed"
              danger
            />
            <StatCard
              icon={<DollarSign size={16} />}
              value={`$${client.stats.totalSpent}`}
              label="Total Spend"
            />
            <StatCard
              icon={<Calendar size={16} />}
              value={new Date(client.stats.lastVisit).toLocaleDateString()}
              label="Last Visit"
            />
          </div>

          <div>
            <h3 className="font-medium text-text-500 dark:text-white mb-2">
              Notes
            </h3>
            <p className="text-sm text-text-400 dark:text-text-600 bg-surface-600 dark:bg-surface-600/10 dark:bg-surface-700 p-3 rounded-lg">
              {client.notes || "No notes available"}
            </p>
          </div>

          <div>
            <h3 className="font-medium text-text-500 dark:text-white mb-2">
              Recent Appointments
            </h3>
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center p-3 bg-surface-600 dark:bg-surface-600/10 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium text-text-500 dark:text-white">
                      Haircut
                    </p>
                    <p className="text-xs text-text-400 dark:text-text-600">
                      May {20 - i}, 2025 · 2:00 PM
                    </p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-success-100 dark:bg-success-900/30 text-success-500 dark:text-success-400">
                    Completed
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-border-500 dark:border-border-800 flex justify-end gap-3">
          <button className="px-4 py-2 rounded-lg border border-border-500 dark:border-border-800 text-text-500 dark:text-white hover:bg-primary-500/20 dark:hover:bg-surface-700">
            <Edit size={16} className="mr-2 inline" />
            Edit
          </button>
          <button className="px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-500 text-white">
            New Appointment
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper component
function StatCard({ icon, value, label, danger = false }) {
  return (
    <div className="p-3 rounded-lg bg-surface-600 dark:bg-surface-600/10">
      <div className="flex items-center gap-2 text-text-400 dark:text-text-600">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <p
        className={`mt-1 font-medium ${
          danger
            ? "text-danger-500 dark:text-danger-400"
            : "text-text-500 dark:text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
