import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, ChevronLeft, Link2, Check } from "lucide-react";

const CalenderIntegration = () => {
  const [integrations, setIntegrations] = useState({
    stripe: {
      connected: true,
      account: "acct_1J4j...5Fd8",
      lastSync: "Today, 9:42 AM",
    },
    paypal: {
      connected: false,
      account: "",
      lastSync: "",
    },
    googleCalendar: {
      connected: true,
      account: "user@business.com",
      lastSync: "Today, 8:15 AM",
    },
    email: {
      connected: true,
      account: "notifications@business.com",
      lastSync: "Currently active",
    },
  });

  const navigate = useNavigate();

  const toggleConnection = (service) => {
    setIntegrations((prev) => ({
      ...prev,
      [service]: {
        ...prev[service],
        connected: !prev[service].connected,
      },
    }));
  };

  return (
    <section>
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={() => navigate(-1)}
          className="text-primary-500 hover:text-primary-500/70 p-2 bg-primary-500/20 rounded-lg cursor-pointer"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-2xl font-semibold text-text-500 dark:text-white">
          Calender Integration
        </h1>
      </div>
      <div className="mx-auto p-6 bg-surface-500 dark:bg-surface-800 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold text-text-500 dark:text-text-400 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary-500" />
          Calendar & Notifications
        </h2>

        <div className="p-4 bg-surface-600 dark:bg-surface-600/10 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-surface-700 rounded-md">
                <Calendar className="w-5 h-5 text-primary-500" />
              </div>
              <div>
                <h3 className="font-medium text-text-500 dark:text-text-400">
                  Google Calendar
                </h3>
                {integrations.googleCalendar.connected ? (
                  <p className="text-sm text-text-400">
                    Connected: {integrations.googleCalendar.account}
                  </p>
                ) : (
                  <p className="text-sm text-text-400">
                    Sync appointments with Google Calendar
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {integrations.googleCalendar.connected && (
                <span className="text-xs bg-success-500 text-white px-2 py-1 rounded-full flex items-center gap-1">
                  <Check className="w-3 h-3" /> Active
                </span>
              )}
              <button
                onClick={() => toggleConnection("googleCalendar")}
                className={`px-3 py-1 rounded-md text-sm ${
                  integrations.googleCalendar.connected
                    ? "text-danger-500 hover:text-danger-600"
                    : "text-primary-500 hover:text-primary-600"
                }`}
              >
                {integrations.googleCalendar.connected
                  ? "Disconnect"
                  : "Connect"}
              </button>
            </div>
          </div>
          {integrations.googleCalendar.connected && (
            <div className="mt-3 pt-3 border-t border-white dark:border-border-800 text-sm text-text-400">
              <p>Last sync: {integrations.googleCalendar.lastSync}</p>
              <button className="text-primary-500 hover:text-primary-600 flex items-center gap-1 mt-1">
                <Link2 className="w-4 h-4" /> Configure sync settings
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CalenderIntegration;
