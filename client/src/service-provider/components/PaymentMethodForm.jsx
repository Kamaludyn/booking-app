import { useState } from "react";

const PaymentMethodForm = ({ onClose, onSave }) => {
  const [selectedMethod, setSelectedMethod] = useState("");
  const [formData, setFormData] = useState({});

  const paymentOptions = [
    { value: "stripe", label: "Stripe" },
    { value: "paypal", label: "PayPal" },
    { value: "bank_transfer", label: "Bank Transfer" },
    { value: "mobile_money", label: "Mobile Money" },
  ];

  const methodFields = {
    stripe: [
      { name: "publishableKey", label: "Publishable Key", type: "text" },
      { name: "secretKey", label: "Secret Key", type: "password" },
    ],
    paypal: [{ name: "email", label: "PayPal Email", type: "email" }],
    bank_transfer: [
      { name: "accountName", label: "Account Name", type: "text" },
      { name: "accountNumber", label: "Account Number", type: "text" },
      { name: "bankName", label: "Bank Name", type: "text" },
    ],
    mobile_money: [
      { name: "phoneNumber", label: "Phone Number", type: "tel" },
      { name: "provider", label: "Provider", type: "text" },
    ],
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      id: Date.now(),
      name: paymentOptions.find((opt) => opt.value === selectedMethod)?.label,
      type: selectedMethod,
      details: { ...formData },
      enabled: true,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-surface-500 dark:bg-surface-800 rounded-2xl p-6 w-full max-w-md border border-border-500 dark:border-border-800 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-text-500 dark:text-white">
            Add Payment Method
          </h2>
          <button
            onClick={onClose}
            className="text-text-400 hover:text-text-500"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-text-400 mb-1">
              Payment Method
            </label>
            <select
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="w-full bg-surface-500 dark:bg-surface-800 rounded-lg border border-border-500 dark:border-border-800 px-3 py-2 text-text-500 dark:text-text-400"
              required
            >
              <option value="">Select a method</option>
              {paymentOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {selectedMethod &&
            methodFields[selectedMethod]?.map((field) => (
              <div key={field.name}>
                <label className="block text-sm text-text-400 mb-1">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  onChange={(e) =>
                    setFormData({ ...formData, [field.name]: e.target.value })
                  }
                  className="w-full rounded-lg bg-surface-500 dark:bg-surface-800 border border-border-500 dark:border-border-800 px-3 py-2 text-text-500 dark:text-white"
                  required={field.type !== "password"}
                />
              </div>
            ))}

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-border-500 dark:border-border-800 text-text-500 dark:text-white rounded-lg hover:bg-surface-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-primary-500 text-white rounded-lg hover:opacity-90"
            >
              Save Method
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentMethodForm;
