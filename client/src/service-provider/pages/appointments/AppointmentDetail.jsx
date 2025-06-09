import { useParams, useNavigate } from "react-router-dom";
import { useAppointment } from "../../hooks/UseAppointments";
import { Calendar, Clock, DollarSign, ChevronLeft } from "lucide-react";
import PaymentHistorySection from "../../components/PaymentHistorySection";

export default function AppointmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const appointment = useAppointment(id);

  if (!appointment) {
    return (
      <div className="text-center text-text-400 py-8">
        Appointment not found.
      </div>
    );
  }

  const date = new Date(appointment.time);
  const formattedDate = date.toLocaleDateString();
  const formattedTime = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-primary-500 hover:text-primary-500/70 p-2 bg-surface-600 dark:bg-surface-600/10 rounded-lg cursor-pointer"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-2xl font-semibold text-text-500 dark:text-white">
            Appointment Details
          </h1>
        </div>

        <div className="bg-surface-500 dark:bg-surface-800 rounded-lg border border-border-500 dark:border-border-800 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-border-500 dark:border-border-800">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-surface-600 dark:bg-surface-600/10 flex items-center justify-center text-primary-500 font-medium text-xl">
                {appointment.client.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-text-500 dark:text-white">
                  {appointment.client}
                </h2>
                <p className="text-sm text-text-400 dark:text-text-600">
                  {appointment.service}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <StatCard
                icon={<Calendar size={16} />}
                value={formattedDate}
                label="Date"
              />
              <StatCard
                icon={<Clock size={16} />}
                value={formattedTime}
                label="Time"
              />
              <StatCard
                icon={<DollarSign size={16} />}
                value={`$${appointment.servicePrice}`}
                label="Service Price"
              />
              <StatCard
                icon={<DollarSign size={16} />}
                value={
                  <span className={getPaymentStyle(appointment.paymentStatus)}>
                    {appointment.paymentStatus}
                  </span>
                }
                label="Payment Status"
              />
            </div>

            <div className="bg-surface-600 dark:bg-surface-600/10 p-2 rounded-lg">
              <h3 className="font-medium text-text-500 dark:text-white mb-2">
                Status
              </h3>
              <div
                className={`${getStatusStyle(
                  appointment.status
                )} inline-block p-1 rounded-full text-sm font-medium`}
              >
                {appointment.status}
              </div>
            </div>

            <PaymentHistorySection appointment={appointment} />

            {appointment.notes && (
              <div>
                <h3 className="font-medium text-text-500 dark:text-white mb-2">
                  Notes
                </h3>
                <p className="text-sm text-text-400 dark:text-text-600 bg-surface-600 dark:bg-surface-600/10 p-3 rounded-lg">
                  {appointment.notes}
                </p>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-border-500 dark:border-border-800 flex justify-end gap-3">
            <button className="px-4 py-2 rounded-lg border border-border-500 dark:border-border-800 text-text-500 dark:text-white hover:bg-surface-600 dark:bg-surface-600/10 dark:hover:bg-surface-700 cursor-pointer">
              Reschedule
            </button>
            <button className="px-4 py-2 rounded-lg bg-primary-500 hover:bg-primary-600 text-white cursor-pointer">
              Add Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper components
function StatCard({ icon, value, label }) {
  return (
    <div className="p-3 rounded-lg bg-surface-600 dark:bg-surface-600/10">
      <div className="flex items-center gap-2 text-text-400 dark:text-text-600">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <p className="mt-1 font-medium text-text-500 dark:text-white">{value}</p>
    </div>
  );
}

function getStatusStyle(status) {
  switch (status) {
    case "upcoming":
      return "bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400";
    case "completed":
      return "bg-surface-200 text-text-500 dark:bg-surface-600/10 dark:text-text-300";
    case "cancelled":
    case "missed":
      return "bg-danger-100 text-danger-700 dark:bg-danger-900/30 dark:text-danger-400";
    default:
      return "bg-surface-200 text-text-500 dark:bg-surface-600/10 dark:text-text-300";
  }
}

function getPaymentStyle(payment) {
  switch (payment) {
    case "paid":
      return "text-success-500 dark:text-success-400";
    case "partial":
      return "text-danger-500 dark:text-danger-400";
    default:
      return "text-text-500 dark:text-text-300";
  }
}
