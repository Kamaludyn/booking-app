import { toast } from "@acrool/react-toaster";
import { ArrowRight } from "lucide-react";

const PaymentDetailsModal = ({
  selectedPayment,
  setSelectedPayment,
  formatDate,
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-surface-600 w-full max-w-md rounded-2xl p-6 shadow-lg relative">
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
          <Detail label="Payment Method" value={selectedPayment.method} />
          <Detail label="Status" value={selectedPayment.status} />
          <Detail
            label="Date"
            value={`${formatDate(selectedPayment.createdAt).time} ${
              formatDate(selectedPayment.createdAt).date
            }`}
          />
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
    <div className="flex justify-between">
      <span className="font-medium text-text-500">{label}</span>
      <span className="text-text-900">{value}</span>
    </div>
  );
}

export default PaymentDetailsModal;
