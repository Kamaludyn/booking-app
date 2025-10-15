import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import api from "../../../shared/services/api";
import { toast } from "@acrool/react-toaster";
import { ThreeDot } from "react-loading-indicators";
import { Calendar, Clock, DollarSign, ChevronLeft } from "lucide-react";
import PaymentHistorySection from "../../components/PaymentHistorySection";

export default function AppointmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Function to fetch appointment details
    const fetchAppointment = async () => {
      const res = await api.get(`/booking/${id}`);
      setAppointment(res.data.booking);
    };

    // If navigated from AppointmentsList, use state; otherwise, fetch from backend
    if (!location.state) {
      fetchAppointment();
    } else {
      const { appointment } = location.state;
      setAppointment(appointment);
    }
  }, []);

  // Function to handle appointment cancellation
  const cancelAppointment = async (apptId) => {
    setLoading(true);
    const confirmed = window.confirm(
      "Are you sure you want to delete this service? This action cannot be undone."
    );
    if (!confirmed) return;

    const cancelledBy = "vendor";
    try {
      const res = await api.patch(`/booking/${apptId}/cancel`, { cancelledBy });
      toast.success(`Appointment cancelled. ${res.data.message}`);
      queryClient.invalidateQueries(["appointments"]);
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  if (!appointment) {
    return (
      <div className="text-center text-text-400 py-8">
        Appointment not found.
      </div>
    );
  }

  // Format start and end times
  const startTime = new Date(appointment.time.start).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const endTime = new Date(appointment.time.end).toLocaleTimeString([], {
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
                {appointment.client.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-text-500 dark:text-white">
                  {appointment.client.name}
                </h2>
                <p className="text-sm text-text-400 dark:text-text-600">
                  {appointment.client.name}
                </p>
                <p className="text-sm text-text-400 dark:text-text-600">
                  {appointment.client.email} - {appointment.client.phone}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <StatCard
                icon={<Calendar size={16} />}
                value={appointment.date}
                label="Date"
              />
              <StatCard
                icon={<Clock size={16} />}
                value={`${startTime} - ${endTime}`}
                label="Time"
              />
              <StatCard
                icon={<DollarSign size={16} />}
                value={`$${appointment.serviceId.price}`}
                label="Service Price"
              />
              <StatCard
                icon={<DollarSign size={16} />}
                value={
                  <span className={getPaymentStyle(appointment.payment.status)}>
                    {appointment.payment.status}
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
            <button className="px-4 py-2 rounded-lg border border-border-500 dark:border-border-800 text-text-500 dark:text-white hover:bg-surface-600 dark:bg-surface-600/10 dark:hover:bg-surface-700 cursor-not-allowed">
              Reschedule
            </button>
            <button
              className={`px-4 py-2 rounded-lg bg-danger-500 hover:bg-danger-500/90 text-white cursor-pointer ${
                loading && "cursor-not-allowed"
              }`}
              onClick={() => cancelAppointment(appointment._id)}
            >
              {loading ? (
                <ThreeDot color="white" size="small" textColor="blue" />
              ) : (
                "cancel appointment"
              )}
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
      <div className="flex items-center gap-2 text-primary-500 dark:text-text-400">
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
      return "bg-success-100 text-amber-500 dark:text-amber-500/70 dark:bg-success-900/30";
    case "completed":
      return "bg-surface-200 text-success-500 dark:text-success-800 dark:bg-surface-600/10";
    case "cancelled_by_client":
    case "cancelled_by_vendor":
    case "missed":
      return "bg-danger-100 text-danger-500 dark:text-danger-800/70 dark:bg-danger-900/30";
    default:
      return "bg-surface-200 text-text-500 dark:text-text-400 dark:bg-surface-600/10";
  }
}

function getPaymentStyle(payment) {
  switch (payment) {
    case "paid":
      return "text-success-500 dark:text-success-400";
    case "partial":
      return "text-amber-500 dark:text-amber-400";
    case "pending":
      return "text-amber-500 dark:text-amber-500/70";
    case "failed":
    case "refunded":
    case "unpaid":
      return "text-danger-500 dark:text-danger-400";
    default:
      return "";
  }
}
