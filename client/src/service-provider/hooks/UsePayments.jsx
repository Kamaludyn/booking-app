import { useQuery } from "@tanstack/react-query";
import api from "../../shared/services/api";

// Hook to fetch vendor payments with pagination and status filter
export const useVendorPayments = ({ page, status }) => {
  const fetchVendorPayments = async () => {
    const res = await api.get("/payment/vendor", {
      params: {
        page,
        status,
      },
    });
    return res.data;
  };

  // Fetch vendor payments data
  return useQuery({
    queryKey: ["vendorPayments", page, status], // cache key
    queryFn: fetchVendorPayments,
    keepPreviousData: true, // keep previous data while fetching new data
  });
};

// Hook to fetch vendor payment statistics
export const usePaymentStats = ({ vendorId, startDate, endDate }) => {
  const fetchVendorStats = async () => {
    const [revenueData, refundsData, balanceData] = await Promise.all([
      api.get("payment/revenue").then((res) => res.data.revenue),
      api.get("payment/refunds").then((res) => res.data.refunds),
      api.get("payment/balance").then((res) => res.data.unsettledBalances),
    ]);
    return { revenueData, refundsData, balanceData };
  };

  // Fetch vendor payment statistics
  return useQuery({
    queryKey: ["vendorStats", vendorId, startDate, endDate],
    queryFn: fetchVendorStats,
    keepPreviousData: true, // keep previous data while fetching new data
  });
};
