import { useState } from "react";
import {
  DollarSign,
  X,
  Plus,
  Calendar,
  CreditCard,
  Banknote,
  HandCoins,
} from "lucide-react";

const paymentMethodIcons = {
  cash: <Banknote size={16} className="text-success-500" />,
  card: <CreditCard size={16} className="text-primary-500" />,
  bank: <HandCoins size={16} className="text-text-400" />,
  offline: <DollarSign size={16} className="text-text-400" />,
};

export default function PaymentHistorySection({ appointment, onAddPayment }) {
  const [showForm, setShowForm] = useState(false);
  const [newPayment, setNewPayment] = useState({
    amount: "",
    method: "cash",
    note: "",
  });

  // Calculate payment totals
  const totalPaid =
    appointment.payments?.reduce((sum, p) => sum + p.amount, 0) || 0;
  const remaining = Math.max(0, appointment.servicePrice - totalPaid);
  const paymentPercentage = Math.round(
    (totalPaid / appointment.servicePrice) * 100
  );
  const paymentStatus =
    totalPaid >= appointment.servicePrice ? "Paid" : "Partial";

  // Format date consistently
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newPayment.amount || isNaN(newPayment.amount)) return;

    const paymentRecord = {
      id: crypto.randomUUID(),
      method: newPayment.method,
      amount: parseFloat(newPayment.amount),
      date: new Date().toISOString(),
      note: newPayment.note.trim(),
    };

    onAddPayment(paymentRecord);
    setNewPayment({ amount: "", method: "cash", note: "" });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-text-500 dark:text-white">
            Payment History
          </h2>
          <p className="text-sm text-text-400 dark:text-text-600">
            {appointment.payments?.length || 0} payment(s) recorded
          </p>
        </div>

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white text-sm px-3 py-2 rounded-lg transition cursor-pointer"
            disabled={remaining <= 0}
          >
            <Plus size={16} />
            Add Payment
          </button>
        )}
      </div>

      {/* Payment Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-text-500 dark:text-text-400">
            ${totalPaid.toFixed(2)} of ${appointment.servicePrice.toFixed(2)}
          </span>
          <span className="font-medium text-text-500 dark:text-white">
            {paymentPercentage}%
          </span>
        </div>
        <div className="w-full bg-surface-600 dark:bg-surface-700 rounded-full h-2">
          <div
            className="bg-success-500 h-2 rounded-full"
            style={{ width: `${paymentPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Payment List */}
      <div className="space-y-3">
        {appointment.payments?.length === 0 ? (
          <div className="p-4 rounded-lg bg-surface-600 dark:bg-surface-700 border border-border-500 dark:border-border-800 text-center">
            <p className="text-text-400 dark:text-text-600">
              No payments recorded yet
            </p>
          </div>
        ) : (
          appointment.payments?.map((payment) => (
            <div
              key={payment.id}
              className="p-3 rounded-lg border border-border-500 dark:border-border-800 bg-surface-600 dark:bg-surface-600/10"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-surface-500 dark:bg-surface-800">
                    {paymentMethodIcons[payment.method] ||
                      paymentMethodIcons.offline}
                  </div>
                  <div>
                    <p className="font-medium text-text-500 dark:text-white">
                      ${payment.amount.toFixed(2)}
                    </p>
                    <p className="text-xs text-text-400 dark:text-text-600 mt-1">
                      {formatDate(payment.date)}
                    </p>
                  </div>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-surface-500 dark:bg-surface-800 text-text-500 dark:text-text-400">
                  {payment.method.charAt(0).toUpperCase() +
                    payment.method.slice(1)}
                </span>
              </div>
              {payment.note && (
                <p className="text-xs text-text-400 dark:text-text-600 mt-2 pl-11">
                  {payment.note}
                </p>
              )}
            </div>
          ))
        )}
      </div>

      {/* Payment Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md bg-surface-500 dark:bg-surface-800 rounded-lg border border-border-500 dark:border-border-800 p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-text-500 dark:text-white">
                Record Payment
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="text-text-400 hover:text-danger-500"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-text-500 dark:text-text-400">
                  Amount (max: ${remaining.toFixed(2)})
                </label>
                <input
                  type="number"
                  value={newPayment.amount}
                  onChange={(e) =>
                    setNewPayment({ ...newPayment, amount: e.target.value })
                  }
                  max={remaining}
                  min="0.01"
                  step="0.01"
                  placeholder="0.00"
                  className="w-full rounded-lg border border-border-500 dark:border-border-800 bg-surface-400 dark:bg-surface-700 px-3 py-2 text-text-500 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-text-500 dark:text-text-400">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {["cash", "card", "bank", "offline"].map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setNewPayment({ ...newPayment, method })}
                      className={`flex items-center gap-2 p-2 rounded-lg border ${
                        newPayment.method === method
                          ? "border-primary-500 bg-primary-500/10"
                          : "border-border-500 dark:border-border-800"
                      }`}
                    >
                      {paymentMethodIcons[method]}
                      <span className="text-sm text-text-500 dark:text-white">
                        {method.charAt(0).toUpperCase() + method.slice(1)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-text-500 dark:text-text-400">
                  Note (optional)
                </label>
                <textarea
                  value={newPayment.note}
                  onChange={(e) =>
                    setNewPayment({ ...newPayment, note: e.target.value })
                  }
                  className="w-full rounded-lg border border-border-500 dark:border-border-800 bg-surface-400 dark:bg-surface-700 px-3 py-2 text-text-500 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows={3}
                  placeholder="Additional payment details..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(true)}
                  className="px-4 py-2 rounded-lg border border-border-500 dark:border-border-800 text-text-500 dark:text-white hover:bg-surface-600 dark:hover:bg-surface-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary-500 hover:bg-primary-600 text-white cursor-pointer"
                >
                  Record Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
