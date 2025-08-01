import { useParams, useNavigate } from "react-router-dom";
import { useService } from "../../hooks/UseServices";
import {
  ChevronLeft,
  Clock,
  DollarSign,
  Calendar,
  Check,
  X,
} from "lucide-react";

export default function ServiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const service = useService(id);

  if (!service) {
    return (
      <div className="text-center py-8 text-text-400 dark:text-text-600">
        Service not found
      </div>
    );
  }

  return (
    <section>
      <div className="max-w-2xl mx-auto">

        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="text-primary-500 hover:text-primary-500/70 p-2 bg-surface-600 dark:bg-surface-600/10 rounded-lg cursor-pointer"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-2xl font-semibold text-text-500 dark:text-white">
            Service Details
          </h1>
        </div>

        <div className="bg-surface-500 dark:bg-surface-800 rounded-lg border border-border-500 dark:border-border-800 overflow-hidden shadow-sm hover:shadow-md">
          <div className="p-6 border-b border-border-500 dark:border-border-800">
            <h2 className="text-xl font-semibold text-text-500 dark:text-white">
              {service.name}
            </h2>
            {service.description && (
              <p className="text-sm text-text-400 dark:text-text-600 mt-2">
                {service.description}
              </p>
            )}
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <DetailCard
                icon={
                  <Clock
                    size={16}
                    className="text-text-400 dark:text-text-600"
                  />
                }
                label="Duration"
                value={`${service.duration} minutes`}
              />
              <DetailCard
                icon={
                  <DollarSign
                    size={16}
                    className="text-text-400 dark:text-text-600"
                  />
                }
                label="Price"
                value={`$${service.price.toFixed(2)}`}
              />
              <DetailCard
                icon={
                  service.requireDeposit ? (
                    <Check size={16} className="text-success-500" />
                  ) : (
                    <X size={16} className="text-danger-500" />
                  )
                }
                label="Requires Deposit"
                value={service.requireDeposit ? "Yes" : "No"}
              />
              <DetailCard
                icon={
                  <Calendar
                    size={16}
                    className="text-text-400 dark:text-text-600"
                  />
                }
                label="Category"
                value={service.category || "General"}
              />
            </div>

            {service.notes && (
              <div>
                <h3 className="font-medium text-text-500 dark:text-white mb-2">
                  Service Notes
                </h3>
                <p className="text-sm text-text-400 dark:text-text-600 bg-surface-600 dark:bg-surface-700 p-3 rounded-lg">
                  {service.notes}
                </p>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-border-500 dark:border-border-800 flex justify-end gap-3">
            <button
              onClick={() => navigate(`/services/${service.id}/edit`)}
              className="px-4 py-2 rounded-lg border border-border-500 dark:border-border-800 text-text-500 dark:text-white hover:opacity-80 cursor-pointer"
            >
              Edit Service
            </button>
            <button className="px-4 py-2 rounded-lg bg-primary-500 dark:bg-primary-500/60 hover:opacity-80 cursor-pointer text-white">
              View Bookings
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// DetailCard Helper Components
function DetailCard({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1">{icon}</div>
      <div>
        <p className="text-sm text-text-400 dark:text-text-600">{label}</p>
        <p className="text-text-500 dark:text-white font-medium">{value}</p>
      </div>
    </div>
  );
}
