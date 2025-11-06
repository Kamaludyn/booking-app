import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useVendorPayments, usePaymentStats } from "../../hooks/UsePayments";
import { ThreeDot } from "react-loading-indicators";
import { DollarSign, RotateCcw, Clock, Settings } from "lucide-react";
import PageHeader from "../../components/PageHeader";

const Payments = () => {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const navigate = useNavigate();
  const { data, isLoading, isError } = useVendorPayments({ page, status });
  const {
    data: vendorStats,
    isLoading: isLoadingStats,
    isError: isErrorStats,
  } = usePaymentStats({ page, status });

  // Extract payments and pagination info
  const vendorPayments = data?.payments;
  const totalPayments = data?.pagination.total;
  const totalPages = data?.pagination.pages;

  // Extract stats data
  const totalRevenue = vendorStats?.revenueData?.totalRevenue;
  const totalRefunds = vendorStats?.refundsData?.totalRefunds;
  const totalBalances = vendorStats?.balanceData?.totalUnsettled;

  useEffect(() => {
    setPage(1);
  }, [status]);

  // Format date and time from UTC time to local
  const formatDate = (utcTime) => {
    const dateString = new Date(utcTime);

    const date = dateString.toLocaleDateString();
    const time = dateString.toLocaleTimeString();

    return { date, time };
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <PageHeader
        title="Payments Overview"
        subtitle={
          "Track all payments from clients and view transaction details."
        }
        actionLabel="Payment Setting"
        onActionClick={() => navigate("/dashboard/payments/settings")}
        actionIcon={Settings}
        isButton
      />

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
        <SummaryCard
          icon={<DollarSign className="w-5 h-5" />}
          title={"Total Revenue"}
          value={`$${totalRevenue || "00"}`}
          // value="$350"
          color="bg-primary-500/10 text-primary-500"
        />
        {/* <SummaryCard
          icon={<CheckCircle2 className="w-5 h-5" />}
          title="Completed Payments"
          value={completedPayments}
          color="bg-green-500/10 text-green-500"
        /> */}
        <SummaryCard
          icon={<Clock className="w-5 h-5" />}
          title="Pending Payments"
          value={`$${totalBalances || "00"}`}
          color="bg-yellow-500/10 text-yellow-500"
        />
        <SummaryCard
          icon={<RotateCcw className="w-5 h-5" />}
          title="Total refunds"
          value={`$${totalRefunds || "00"}`}
          color="bg-danger-500/10 text-danger-500"
        />
      </div>

      <div className="bg-surface-500 dark:bg-surface-800 border border-border-500 dark:border-border-800 shadow-sm hover:shadow-md transition-shadow rounded-2xl p-2 md:p-6">
        <div className="w-full flex items-center justify-between gap-4">
          <h2 className="text-lg font-medium text-text-500 dark:text-white mb-4">
            Payment History <br></br>{" "}
            <span className="text-xs font-light">{`${
              totalPayments || 0
            } payments found`}</span>
          </h2>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="appearance-none pl-4 pr-8 py-2 rounded-lg bg-surface-500 dark:bg-surface-800 border border-border-500 dark:border-white/70 text-text-500 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-transparent shadow-sm hover:shadow-md"
          >
            <option value="">All Payments</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="w-full grid place-items-center">
              <ThreeDot
                color="var(--color-primary-500)"
                size="medium"
                textColor="blue"
              />
            </div>
          ) : (
            <table className="w-full text-sm text-left border-collapse text-text-500 dark:text-white">
              <thead>
                <tr className="text-text-500 dark:text-white border-b border-surface-600">
                  <th className="py-3 pr-2 md:px-4 font-medium">Client</th>
                  <th className="py-3 px-2 md:px-4 font-medium">Service</th>
                  <th className="py-3 px-2 md:px-4 font-medium">Amount</th>
                  <th className="py-3 px-2 md:px-4 font-medium">Status</th>
                  <th className="py-3 pl-2 md:px-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {vendorPayments?.map((p) => (
                  <tr
                    key={p._id}
                    onClick={() => setSelectedPayment(p)}
                    className="cursor-pointer border-b border-surface-600 hover:bg-surface-700 transition-colors"
                  >
                    <td className="py-3 pr-2 md:px-4">
                      {p.bookingId?.client?.name}
                    </td>
                    <td className="py-3 px-2 md:px-4 capitalize">
                      {p.serviceId?.name}
                    </td>
                    <td className="py-3 px-2 md:px-4 font-medium text-text-900">
                      $
                      {p.status === "pending" ? p.amountExpected : p.amountPaid}
                    </td>
                    <td className="py-3 px-2 md:px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          p.status === "paid"
                            ? "bg-green-500/10 text-green-500"
                            : p.status === "refunded"
                            ? "bg-danger-500/10 text-danger-500"
                            : "bg-yellow-500/10 text-yellow-500"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 pl-2 md:px-4">
                      {formatDate(p.createdAt).time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-4 py-2 text-sm rounded-md bg-surface-500 dark:bg-surface-700 border border-border-500 dark:border-border-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Previous
          </button>
          <span className="text-sm text-text-400 dark:text-text-600">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="px-4 py-2 text-sm rounded-md bg-surface-500 dark:bg-surface-700 border border-border-500 dark:border-border-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

function SummaryCard({ icon, title, value, color }) {
  return (
    <div className="p-4 rounded-2xl flex items-center gap-4 bg-surface-500 dark:bg-surface-800 border border-border-500 dark:border-border-800 shadow-sm hover:shadow-md transition-shadow">
      <div className={`p-3 rounded-xl ${color}`}>{icon}</div>
      <div>
        <p className="text-sm text-text-500 dark:text-white">{title}</p>
        <p className="text-xl font-semibold text-text-900 dark:text-white">
          {value}
        </p>
      </div>
    </div>
  );
}

export default Payments;
