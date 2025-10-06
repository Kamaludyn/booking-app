import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "@acrool/react-toaster";
import api from "../../../shared/services/api";
import ServiceForm from "./AddService";

export default function EditService() {
  const { id } = useParams();
  const location = useLocation();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Function to fetch service details
    const fetchService = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/services/${id}`);
        setService(res.data.service);
      } catch (err) {
        const message =
          err.message === "Network Error"
            ? "Please check your network connection"
            : err.response?.data?.message || "An error occurred";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    // If navigated from ServicesList, use state; otherwise, fetch from backend
    if (!location.state) {
      fetchService();
    } else {
      const { service } = location.state;
      setService(service);
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="text-center py-8 text-text-400 dark:text-text-600 shadow-md">
        Loading service details...
      </div>
    );
  }
  if (!service) {
    return (
      <div className="text-center py-8 text-text-400 dark:text-text-600 shadow-md">
        Service not found
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      <ServiceForm selectedService={service} />
    </div>
  );
}
