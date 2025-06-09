import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useServices } from "../../hooks/UseServices";
import { Search, Plus, Clock, DollarSign } from "lucide-react";
import PageHeader from "../../components/PageHeader";

export default function ServicesList() {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const services = useServices();
  const navigate = useNavigate();

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Clients"
        subtitle={`${filteredServices.length} clients found`}
        actionLabel="New Service"
        onActionClick={() => navigate("/dashboard/services/new")}
        actionIcon={Plus}
        isButton
      />

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-400" />
        <input
          type="text"
          placeholder="Search services..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg bg-surface-500 dark:bg-surface-800 border border-border-500 dark:border-border-800 text-text-500 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm hover:shadow-md"
        />
      </div>

      {loading ? (
        <div className="text-center py-8 text-text-400 dark:text-text-600 shadow-sm">
          Loading services...
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="text-center py-8 bg-surface-500 dark:bg-surface-800 rounded-lg">
          <p className="text-text-400 dark:text-text-600">No services found</p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="flex flex-col p-4 rounded-lg bg-surface-500 dark:bg-surface-800 border border-border-500 dark:border-border-800  shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <h3
                  className="font-medium text-text-500 dark:text-white hover:underline cursor-pointer"
                  onClick={() => navigate(`/dashboard/services/${service.id}`)}
                >
                  {service.name}
                </h3>
                {service.requireDeposit && (
                  <span className="text-xs px-2 py-1 rounded-full bg-surface-600 dark:bg-surface-700 text-text-500 dark:text-text-300">
                    Deposit
                  </span>
                )}
              </div>

              {service.description && (
                <p className="text-sm text-text-400 dark:text-text-600 mt-2">
                  {service.description}
                </p>
              )}

              <div className="flex items-center justify-between my-4">
                <div className="flex items-center gap-2 text-sm text-text-500 dark:text-white">
                  <Clock size={14} className="text-text-400 dark:text-white" />
                  <span>{service.duration} min</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-text-500 dark:text-white">
                  <DollarSign
                    size={14}
                    className="text-text-400 dark:text-white"
                  />
                  <span>{service.price.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex gap-2 mt-auto text-white">
                <button
                  onClick={() =>
                    navigate(`/dashboard/services/${service.id}/edit`)
                  }
                  className="flex-1 py-2 text-sm rounded-lg bg-primary-500 hover:bg-primary-600 dark:bg-primary-500/60 dark:hover:bg-primary-500/70 cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
                  className="flex-1 py-2 text-sm rounded-lg bg-danger-500 hover:bg-danger-800 text-white cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this service?")) return;
    try {
      setLoading(true);
      setLoading(false);
    } catch (error) {
      console.error("Failed to delete service:");
      setLoading(false);
    }
  }
}
