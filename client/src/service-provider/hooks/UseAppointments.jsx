import { useQuery } from "@tanstack/react-query";
import api from "../../shared/services/api";

export const useAppointments = (page = 1, limit = 10) => {
  const fetchAppointments = async () => {
    const res = await api.get(`/booking?page=${page}&limit=${limit}`);
    return res.data || [];
  };
  // Fetch appointments(bookings) from backend with react-query
  return useQuery({
    queryKey: ["booking", page, limit], // cache key
    queryFn: fetchAppointments,
  });
};
