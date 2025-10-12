import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../shared/services/api";
import { toast } from "@acrool/react-toaster";

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

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (apptData) => {
      const res = await api.post("/booking", apptData);
      return res.data;
    },
    onSuccess: () => {
      // Automatically update or refresh related queries
      queryClient.invalidateQueries(["bookings"]);

      // Show success msg and navigate to appointments
      toast.success("Booking created successfully");
      navigate("/dashboard/appointments");
    },
  });
};
