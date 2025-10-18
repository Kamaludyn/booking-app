import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../shared/services/api";
import { toast } from "@acrool/react-toaster";

export function useVendor() {
  const fetchVendorProfile = async () => {
    const res = await api.get("/vendor/me");
    console.log("vendor res:", res.data);
    return res.data.vendor;
  };
  // Fetch vendor Profile details using react-query
  return useQuery({
    queryKey: ["vendorProfile"], // cache key
    queryFn: fetchVendorProfile,
  });
}

// Hook to save/update vendor profile
export const useSaveVendor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vendorData) => {
      const res = await api.patch("/vendor", vendorData);
      return res.data;
    },
    onSuccess: (data) => {
      // Automatically update or refresh related queries
      queryClient.invalidateQueries(["vendorProfile"]);

      // Show success msg
      toast.success(data.message);
    },
  });
};
