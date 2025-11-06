import { toast } from "@acrool/react-toaster";
import { ArrowRight } from "lucide-react";

const PaymentDetailsModal = ({
  selectedPayment,
  setSelectedPayment,
  formatDate,
}) => {
  return (
    <div className="fixed inset-0 w-5/6 md:w-auto bg-black/50 flex items-center justify-center z-50">
      <div className="bg-surface-500 dark:bg-surface-800 border border-border-500 dark:border-border-800 text-text-500 dark:text-white  w-full max-w-md rounded-2xl p-6 shadow-lg relative">
        <h3 className="text-lg font-semibold text-text-900 mb-4">
          Payment Details
        </h3>

        <div className="space-y-3 text-sm text-text-400">
          <Detail
            label="Client"
            value={selectedPayment.bookingId.client.name}
          />
          <Detail
            label="Amount"
            value={`${
              selectedPayment.status === "pending"
                ? selectedPayment.amountExpected
                : selectedPayment.amountPaid
            }`}
          />
          <Detail
            label="Currency"
            value={selectedPayment.currency.toUpperCase()}
          />
          <Detail label="Status" value={selectedPayment.status} />
          <Detail label="Provider" value={selectedPayment.provider} />
          <Detail label="Payment Method" value={selectedPayment.method} />
          <Detail
            label="Date/Time"
            value={`${formatDate(selectedPayment.createdAt).time} ${
              formatDate(selectedPayment.createdAt).date
            }`}
          />
          <Detail label="Service" value={selectedPayment.serviceId.name} />
          <Detail
            label="Service Price"
            value={`$${selectedPayment.serviceId.price}`}
          />
          <Detail
            label="Booking Status"
            value={selectedPayment.bookingId.status}
          />
          <Detail label="Booking Date" value={selectedPayment.bookingId.date} />
          <Detail
            label="Transaction ID"
            value={selectedPayment.providerSessionId.toUpperCase()}
          />
        </div>

        <button
          onClick={() => {
            navigator.clipboard.writeText(selectedPayment._id);
            toast.success("Transaction ID copied!");
          }}
          className="mt-4 w-full bg-primary-500 hover:bg-primary-600 text-white rounded-lg py-2 text-sm font-medium flex items-center justify-center gap-2"
        >
          Copy Transaction ID <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={() => setSelectedPayment(null)}
          className="absolute top-3 right-3 text-text-400 hover:text-text-900 cursor-pointer"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

function Detail({ label, value }) {
  return (
    <div className="flex justify-between border-b border-border-500 dark:border-border-800 text-text-500 dark:text-white">
      <span className="w-1/2 font-medium">{label}</span>
      <span className="w-1/2 text-right word-break: break-all">{value}</span>
    </div>
  );
}

export default PaymentDetailsModal;
