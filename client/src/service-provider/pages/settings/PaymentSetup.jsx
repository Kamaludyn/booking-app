import { useState } from "react";

export default function PaymentSetup() {
  const [settings, setSettings] = useState({
    provider: "mock",
    currency: "USD",
    depositOptions: [25, 50, 100],
    instructions:
      "A minimum 25% deposit is required to confirm your booking. - Refund rules: - Cancellation rules: - Other payments:",
  });

  const handleCheckboxChange = (percentage) => {
    setSettings((prev) => {
      const exists = prev.depositOptions.includes(percentage);
      const updated = exists
        ? prev.depositOptions.filter((p) => p !== percentage)
        : [...prev.depositOptions, percentage];
      return { ...prev, depositOptions: updated.sort((a, b) => a - b) };
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-6">
      <h1 className="text-2xl font-semibold text-text-500 dark:text-white">
        Payment Settings
      </h1>

      <div className="space-y-4 bg-surface-500 dark:bg-surface-800 p-6 rounded-xl border border-border-500 dark:border-border-800">
        <div>
          <label className="block text-sm mb-1 text-text-400">
            Payment Provider
          </label>
          <select
            className="w-full rounded-lg border border-border-500 dark:border-border-800 bg-transparent px-3 py-2 text-text-500 dark:text-white"
            value={settings.provider}
            onChange={(e) =>
              setSettings({ ...settings, provider: e.target.value })
            }
          >
            <option className="text-text-500" value="mock">
              Mock Payments Only
            </option>
            <option className="text-text-500" value="stripe">
              Stripe
            </option>
            <option className="text-text-500" value="paypal">
              PayPal
            </option>
            <option className="text-text-500" value="flutterwave">
              Flutterwave
            </option>
            <option className="text-text-500" value="razorpay">
              RazorPay
            </option>
            <option className="text-text-500" value="payoneer">
              Payoneer
            </option>
            <option className="text-text-500" value="grey">
              Grey
            </option>
            <option className="text-text-500" value="geegpay">
              Geegpay
            </option>
            <option className="text-text-500" value="bank">
              Bank Transfer
            </option>
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1 text-text-400">Currency</label>
          <input
            type="text"
            value={settings.currency}
            onChange={(e) =>
              setSettings({ ...settings, currency: e.target.value })
            }
            className="w-full rounded-lg border border-border-500 dark:border-border-800 bg-transparent px-3 py-2 text-text-500 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm mb-1 text-text-400">
            Accepted Deposit Percentages
          </label>
          <div className="flex flex-wrap gap-4">
            {[25, 50, 75, 100].map((p) => (
              <label
                key={p}
                className="flex items-center gap-2 text-text-500 dark:text-white"
              >
                <input
                  type="checkbox"
                  checked={settings.depositOptions.includes(p)}
                  onChange={() => handleCheckboxChange(p)}
                  className="accent-primary-500"
                />
                {p}%
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1 text-text-400">
            Payment Instructions
          </label>
          <textarea
            value={settings.instructions}
            onChange={(e) =>
              setSettings({ ...settings, instructions: e.target.value })
            }
            rows={4}
            className="w-full rounded-lg border border-border-500 dark:border-border-800 bg-transparent px-3 py-2 text-text-500 dark:text-white"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => console.log("Saved settings:", settings)}
          className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:opacity-90"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
}
