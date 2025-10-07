import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useServices } from "../../hooks/UseServices";
import { Search, Plus, Clock, DollarSign } from "lucide-react";
import { toast } from "@acrool/react-toaster";
import { ThreeDot } from "react-loading-indicators";
import PageHeader from "../../components/PageHeader";
import api from "../../../shared/services/api";

export default function ServicesList() {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState({});
  const { data: services, isLoading, isError } = useServices();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const filteredServices = services?.filter((service) =>
    service?.name?.toLowerCase().includes(search.toLowerCase())
  );

  // Function to handle service deletion
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this service? This action cannot be undone."
    );
    if (!confirmed) return;
    setLoading((prev) => ({ ...prev, [id]: true }));
    try {
      const res = await api.delete(`/services/${id}`);

      // Show a success message
      toast.success(res.data.message);
      // Invalidate and refetch services list
      queryClient.invalidateQueries(["services"]);

      // axios interceptor handles error globally
    } finally {
      setLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Services"
        subtitle={`${filteredServices?.length || 0} services found`}
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
          className="w-full pl-10 pr-4 py-2 rounded-lg bg-surface-500 dark:bg-surface-800 border border-border-500 dark:border-border-800 text-text-500 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 dark:focus:ring-white focus:border-transparent outline-0 shadow-sm hover:shadow-md"
        />
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-text-400 dark:text-text-600 shadow-sm">
          Loading services...
        </div>
      ) : isError ? (
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
          {filteredServices?.map((service) => (
            <div
              key={service._id}
              className="flex flex-col p-4 rounded-lg bg-surface-500 dark:bg-surface-800 border border-border-500 dark:border-border-800  shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <h3
                  className="font-medium text-text-500 dark:text-white hover:underline cursor-pointer"
                  onClick={() =>
                    navigate(`/dashboard/services/${service._id}`, {
                      state: { service },
                    })
                  }
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
                <p className="h-full text-sm text-text-400 dark:text-text-600 mt-2">
                  {service.description}
                </p>
              )}

              <div className="flex items-center justify-between my-2">
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
                    navigate(`/dashboard/services/${service._id}/edit`, {
                      state: { service },
                    })
                  }
                  className="flex-1 py-2 text-sm rounded-lg bg-primary-500 hover:bg-primary-600 dark:bg-primary-500/60 dark:hover:bg-primary-500/70 cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(service._id)}
                  className="flex-1 py-2 text-sm rounded-lg bg-danger-500 hover:bg-danger-800 text-white cursor-pointer"
                >
                  {loading[service._id] ? (
                    <ThreeDot color="white" size="small" textColor="blue" />
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
