import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const NotificationsSettings = () => {
  const navigate = useNavigate();

  // Mock data
  const [notificationSettings, setNotificationSettings] = useState({
    email: {
      bookingConfirmation: true,
      reminders: true,
      cancellations: true,
      promotions: false,
    },
    sms: {
      reminders: true,
      urgentUpdates: false,
    },
    push: {
      newBookings: true,
      cancellations: false,
    },
  });

  const handleToggle = (type, field) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: !prev[type][field],
      },
    }));
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={() => navigate(-1)}
          className="text-primary-500 hover:text-primary-500/70 p-2 bg-primary-500/20 rounded-lg cursor-pointer"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-2xl font-semibold text-text-500 dark:text-white">
          Notifications Settings
        </h1>
      </div>
      <div className="mx-auto p-6 bg-surface-500 dark:bg-surface-800 rounded-lg shadow-sm">
        {/* Email Notifications */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-text-500 dark:text-text-400">
              Email Notifications
            </h2>
            <div className="flex items-center">
              <span
                className={`mr-2 text-sm ${
                  notificationSettings.email.bookingConfirmation
                    ? "text-success-500"
                    : "text-text-400"
                }`}
              >
                {notificationSettings.email.bookingConfirmation
                  ? "All On"
                  : "Some Off"}
              </span>
              <button
                onClick={() => {
                  const newState = !Object.values(
                    notificationSettings.email
                  ).every(Boolean);
                  setNotificationSettings((prev) => ({
                    ...prev,
                    email: {
                      bookingConfirmation: newState,
                      reminders: newState,
                      cancellations: newState,
                      promotions: newState,
                    },
                  }));
                }}
                className="text-sm text-primary-500 hover:text-primary-600"
              >
                {Object.values(notificationSettings.email).every(Boolean)
                  ? "Turn All Off"
                  : "Turn All On"}
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {Object.entries(notificationSettings.email).map(([key, value]) => (
              <div
                key={key}
                className="flex items-center justify-between p-3 bg-surface-600 dark:bg-surface-600/10 rounded-md"
              >
                <div>
                  <h3 className="font-medium text-text-500 dark:text-text-400 capitalize">
                    {key.replace(/([A-Z])/g, " $1")}
                  </h3>
                  <p className="text-sm text-text-400">
                    {key === "bookingConfirmation" &&
                      "When a customer books an appointment"}
                    {key === "reminders" &&
                      "24 hours before scheduled appointments"}
                    {key === "cancellations" &&
                      "When appointments are cancelled"}
                    {key === "promotions" && "Special offers and discounts"}
                  </p>
                </div>
                <button
                  onClick={() => handleToggle("email", key)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${
                    value ? "bg-primary-500" : "bg-surface-800"
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-surface-500 transform transition-transform ${
                      value ? "translate-x-6" : ""
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* SMS Notifications */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-text-500 dark:text-text-400 mb-4">
            SMS Notifications
          </h2>
          <div className="space-y-3">
            {Object.entries(notificationSettings.sms).map(([key, value]) => (
              <div
                key={key}
                className="flex items-center justify-between p-3 bg-surface-600 dark:bg-surface-600/10 rounded-md"
              >
                <div>
                  <h3 className="font-medium text-text-500 dark:text-text-400 capitalize">
                    {key.replace(/([A-Z])/g, " $1")}
                  </h3>
                  <p className="text-sm text-text-400">
                    {key === "reminders" &&
                      "1 hour before appointments (standard rates apply)"}
                    {key === "urgentUpdates" &&
                      "Last-minute changes or closures"}
                  </p>
                </div>
                <button
                  onClick={() => handleToggle("sms", key)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${
                    value ? "bg-primary-500" : "bg-surface-800"
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-surface-500 transform transition-transform ${
                      value ? "translate-x-6" : ""
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Push Notifications */}
        <section>
          <h2 className="text-lg font-semibold text-text-500 dark:text-text-400 mb-4">
            Push Notifications
          </h2>
          <div className="space-y-3">
            {Object.entries(notificationSettings.push).map(([key, value]) => (
              <div
                key={key}
                className="flex items-center justify-between p-3 bg-surface-600 dark:bg-surface-600/10 rounded-md"
              >
                <div>
                  <h3 className="font-medium text-text-500 dark:text-text-400 capitalize">
                    {key.replace(/([A-Z])/g, " $1")}
                  </h3>
                  <p className="text-sm text-text-400">
                    {key === "newBookings" && "When you receive new bookings"}
                    {key === "cancellations" &&
                      "When appointments are cancelled"}
                  </p>
                </div>
                <button
                  onClick={() => handleToggle("push", key)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${
                    value ? "bg-primary-500" : "bg-surface-800"
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-surface-500 transform transition-transform ${
                      value ? "translate-x-6" : ""
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default NotificationsSettings;
