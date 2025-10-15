import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Calendar, Clock, ArrowUpDown, Plus } from "lucide-react";
import { useAppointments } from "../../hooks/UseAppointments";
import PageHeader from "../../components/PageHeader";

const STATUS_OPTIONS = ["all", "upcoming", "completed", "cancelled", "missed"];

function getStatusStyle(status) {
  switch (status) {
    case "upcoming":
      return "text-amber-500 dark:text-amber-500/70";
    case "completed":
      return "text-success-500 dark:text-success-800";
    case "cancelled_by_client":
    case "cancelled_by_vendor":
    case "missed":
      return "text-danger-500 dark:text-danger-800/70";
    default:
      return "text-text-500 dark:text-text-400";
  }
}

function getPaymentStyle(paymentStatus) {
  switch (paymentStatus) {
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

export default function Appointments() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError } = useAppointments(page, limit);
  const navigate = useNavigate();

  const appointments = data?.bookings;
  const total = data?.total;
  const totalPages = Math.ceil(total / limit);

  // Filter and search appointments
  const filteredAppointments = appointments
    ?.filter((apt) => {
      const matchesSearch = apt.client?.name
        ?.toLowerCase()
        .includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || apt.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort(
      (a, b) =>
        new Date(b.time?.start).getTime() - new Date(a.time?.start).getTime()
    );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Appointments"
        subtitle={`${filteredAppointments?.length || 0} appointments found`}
        actionLabel="New Appointment"
        onActionClick={() => navigate("/dashboard/appointments/new")}
        actionIcon={Plus}
        isButton
      />

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-400" />
          <input
            type="text"
            placeholder="Search by client name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-surface-500 dark:bg-surface-800 border border-border-500 dark:border-border-800 text-text-500 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-transparent shadow-sm hover:shadow-md"
          />
        </div>

        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none w-full pl-4 pr-8 py-2 rounded-lg bg-surface-500 dark:bg-surface-800 border border-border-500 dark:border-border-800 text-text-500 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-transparent shadow-sm hover:shadow-md"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
          <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-400 pointer-events-none" />
        </div>
      </div>
      {isLoading ? (
        <div className="text-center py-8 text-text-400 dark:text-text-600 shadow-sm">
          Loading appointments...
        </div>
      ) : isError ? (
        <div className="text-center py-8 bg-surface-500 dark:bg-surface-800 rounded-lg">
          <p className="text-text-400 dark:text-text-600">
            No appointments found
          </p>
          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-primary-500 hover:underline text-sm mt-2"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-text-500 dark:text-white">
          {filteredAppointments?.map((appointment) => {
            const start = new Date(appointment.time?.start);

            // Get hours and minutes
            const hours = start.getUTCHours();
            const minutes = start.getUTCMinutes();

            // Format to hh:mm
            const formattedHours = hours.toString().padStart(2, "0");
            const formattedMinutes = minutes.toString().padStart(2, "0");
            return (
              <div
                key={appointment._id}
                className="flex flex-col p-4 rounded-lg bg-surface-500 dark:bg-surface-800 border border-border-500 dark:border-border-800 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3
                      className="font-medium text-text-500 dark:text-white hover:underline cursor-pointer"
                      onClick={() =>
                        navigate(`/dashboard/appointments/${appointment._id}`, {
                          state: { appointment },
                        })
                      }
                    >
                      {appointment.client?.name || "Guest Client"}
                    </h3>
                    <p className="text-sm text-text-400 dark:text-text-600">
                      {appointment.serviceId?.name}
                    </p>
                  </div>

                  <span
                    className={`${getStatusStyle(
                      appointment.status
                    )} px-2 py-1 rounded-md text-xs font-medium`}
                  >
                    {appointment.status.replace(/_/g, " ")}
                  </span>
                </div>

                <div className="mt-3 flex items-center gap-2 text-sm text-text-500 dark:text-text-400">
                  <Calendar size={14} />
                  <span>{appointment.date}</span>
                  <Clock size={14} />
                  <span>{`${formattedHours}:${formattedMinutes}`}</span>
                </div>

                <div className="my-3 flex justify-between items-center">
                  <div>
                    <div className="text-sm font-medium text-text-500/40 dark:text-text-400">
                      payment:{" "}
                      <span
                        className={`${getPaymentStyle(
                          appointment.payment?.status
                        )}`}
                      >
                        {appointment.payment?.status}
                      </span>
                      <span className="text-xs text-text-400 dark:text-text-600 ml-2">
                        ${appointment.payment?.paidAmount} / $
                        {appointment.serviceId?.price}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={() =>
                      navigate(`/dashboard/appointments/${appointment._id}`, {
                        state: { appointment },
                      })
                    }
                    className="bg-primary-500 hover:bg-primary-600 dark:bg-primary-500/50 dark:hover:bg-primary-600/40 flex-1 py-2 text-white text-sm rounded-lg border border-transparent dark:border-border-800 cursor-pointer"
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-4 py-2 text-sm rounded-md bg-surface-500 dark:bg-surface-700 border border-border-500 dark:border-border-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Previous
          </button>
          <span className="text-sm text-text-400 dark:text-text-600">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="px-4 py-2 text-sm rounded-md bg-surface-500 dark:bg-surface-700 border border-border-500 dark:border-border-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
