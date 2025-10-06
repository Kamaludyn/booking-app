import { useQuery } from "@tanstack/react-query";
import api from "../../shared/services/api";

export function useServices() {
  // Fetch services from backend with react-query
  return useQuery({
    queryKey: ["services"], // cache key
    queryFn: async () => {
      const res = await api.get("/services");
      return res.data?.services || [];
    },
  });
}
