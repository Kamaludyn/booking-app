import { useQuery } from "@tanstack/react-query";
import api from "../../shared/services/api";
import { toast } from "@acrool/react-toaster";

export function useServices() {
  const fetchServices = async () => {
    try {
      const res = await api.get("/services");
      return res.data.services;
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Something went wrong";
      toast.error(message);
      throw err;
    }
  };
  // Fetch services from backend with react-query
  return useQuery({
    queryKey: ["services"], // cache key
    queryFn: fetchServices,
  });
}
