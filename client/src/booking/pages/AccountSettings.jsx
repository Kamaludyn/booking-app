import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  User,
  Lock,
  Bell,
  CreditCard,
  Trash2,
  LogOut,
} from "lucide-react";

export default function AccountSettings() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [user, setUser] = useState({
    name: "Alex Johnson",
    email: "alex@example.com",
    phone: "(555) 123-4567",
    avatar: "",
    notifications: {
      email: true,
      sms: false,
      reminders: true,
    },
    paymentMethods: [{ id: 1, last4: "4242", brand: "visa", default: true }],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleNotificationToggle = (type) => {
    setUser((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: !prev.notifications[type],
      },
    }));
  };

  return (
    <section className="container mx-auto px-4 pb-8">
      <div className="relative w-full flex items-center justify-center">
        <Link
          to="/user-dashboard"
          className="absolute top-0 left-0 justify-self-start flex items-center p-2 rounded-lg bg-primary-2/10 text-primary-2 mb-4"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
        </Link>
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="relative inline-block">
              <span className="relative z-10">Account Settings</span>
              <span className="absolute bottom-0 left-0 w-full h-2 bg-accent-3 dark:bg-accent-3/30 -rotate-1"></span>
            </span>
          </h1>
          <p className="text-lg text-text-600 dark:text-text-400 max-w-2xl mx-auto">
            Browse and book from our wide range of professional services
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-surface-3 rounded-xl shadow-sm overflow-hidden">
            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full cursor-pointer px-4 py-3 text-left flex items-center ${
                activeTab === "profile"
                  ? "bg-primary-2/10 text-primary-2"
                  : "hover:bg-surface-2 dark:hover:bg-surface-4"
              }`}
            >
              <User className="w-5 h-5 mr-3" />
              Profile
            </button>
            <button
              onClick={() => setActiveTab("notifications")}
              className={`w-full cursor-pointer px-4 py-3 text-left flex items-center ${
                activeTab === "notifications"
                  ? "bg-primary-2/10 text-primary-2"
                  : "hover:bg-surface-2 dark:hover:bg-surface-4"
              }`}
            >
              <Bell className="w-5 h-5 mr-3" />
              Notifications
            </button>
            <button
              onClick={() => setActiveTab("payments")}
              className={`w-full cursor-pointer px-4 py-3 text-left flex items-center ${
                activeTab === "payments"
                  ? "bg-primary-2/10 text-primary-2"
                  : "hover:bg-surface-2 dark:hover:bg-surface-4"
              }`}
            >
              <CreditCard className="w-5 h-5 mr-3" />
              Payments
            </button>
            <div className="border-t border-border-800/20 dark:border-text-400/50">
              <button
                onClick={() => setActiveTab("security")}
                className={`w-full cursor-pointer px-4 py-3 text-left flex items-center ${
                  activeTab === "security"
                    ? "bg-primary-2/10 text-primary-2"
                    : "hover:bg-surface-2 dark:hover:bg-surface-4"
                }`}
              >
                <Lock className="w-5 h-5 mr-3" />
                Security
              </button>
            </div>
          </div>

          <div className="hidden lg:block mt-6 bg-white dark:bg-surface-3 rounded-xl shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-border-800/20 dark:border-text-400/50 font-medium text-red-500">
              Danger Zone
            </div>
            <button
              className="w-full cursor-pointer px-4 py-3 text-left flex items-center hover:bg-surface-2 dark:hover:bg-surface-4 text-red-500"
              onClick={() => setShowDeleteModal(true)}
            >
              <Trash2 className="w-5 h-5 mr-3" />
              Delete Account
            </button>
          </div>
        </div>

        <div className="lg:col-span-9">
          {activeTab === "profile" && (
            <div className="bg-white dark:bg-surface-3 rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center">
                <User className="w-5 h-5 mr-2" /> Profile Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={user.name}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-border-800/20 dark:border-text-400/50 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={user.email}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-border-800/20 dark:border-text-400/50 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={user.phone}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-border-800/20 dark:border-text-400/50 rounded-lg"
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button className="px-6 py-2 bg-primary-2 text-white rounded-lg hover:bg-primary-2/90">
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="bg-white dark:bg-surface-3 rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center">
                <Bell className="w-5 h-5 mr-2" /> Notification Preferences
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-border-800/20 dark:border-text-400/50 rounded-lg">
                  <div>
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className="text-sm text-text-500 dark:text-text-400">
                      Receive booking confirmations and updates via email
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={user.notifications.email}
                      onChange={() => handleNotificationToggle("email")}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-surface-3/30 dark:bg-surface-800/40 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-2"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border border-border-800/20 dark:border-text-400/50 rounded-lg">
                  <div>
                    <h3 className="font-medium">SMS Notifications</h3>
                    <p className="text-sm text-text-500 dark:text-text-400">
                      Receive text message reminders
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={user.notifications.sms}
                      onChange={() => handleNotificationToggle("sms")}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-surface-3/30 dark:bg-surface-800/40 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-2"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border border-border-800/20 dark:border-text-400/50 rounded-lg">
                  <div>
                    <h3 className="font-medium">Appointment Reminders</h3>
                    <p className="text-sm text-text-500 dark:text-text-400">
                      Get reminders before your appointments
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={user.notifications.reminders}
                      onChange={() => handleNotificationToggle("reminders")}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-surface-3/30 dark:bg-surface-800/40 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-2"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === "payments" && (
            <div className="bg-white dark:bg-surface-3 rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center">
                <CreditCard className="w-5 h-5 mr-2" /> Payment Methods
              </h2>

              <div className="space-y-4">
                {user.paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className="flex items-center justify-between p-4 border border-border-800/20 dark:border-text-400/50 rounded-lg"
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-6 bg-surface-2 dark:bg-surface-4 rounded flex items-center justify-center mr-3">
                        {method.brand === "visa" ? "VISA" : method.brand}
                      </div>
                      <span>•••• •••• •••• {method.last4}</span>
                      {method.default && (
                        <span className="ml-2 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs rounded">
                          Default
                        </span>
                      )}
                    </div>
                    <button className="text-primary-2 hover:underline text-sm">
                      {method.default ? "Edit" : "Set as default"}
                    </button>
                  </div>
                ))}

                <button className="w-full mt-4 p-3 border-2 border-dashed border-border-800/20 dark:border-text-400/50 rounded-lg hover:bg-surface-2 dark:hover:bg-surface-4 text-primary-2">
                  + Add Payment Method
                </button>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="bg-white dark:bg-surface-3 rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center">
                <Lock className="w-5 h-5 mr-2" /> Security
              </h2>

              <div className="space-y-6">
                <div className="p-4 border border-border-800/20 dark:border-text-400/50 rounded-lg">
                  <h3 className="font-medium mb-2">Change Password</h3>
                  <div className="space-y-3">
                    <input
                      type="password"
                      placeholder="Current Password"
                      className="w-full p-2 border border-border-800/20 dark:border-text-400/50 rounded-lg"
                    />
                    <input
                      type="password"
                      placeholder="New Password"
                      className="w-full p-2 border border-border-800/20 dark:border-text-400/50 rounded-lg"
                    />
                    <input
                      type="password"
                      placeholder="Confirm New Password"
                      className="w-full p-2 border border-border-800/20 dark:border-text-400/50 rounded-lg"
                    />
                  </div>
                  <button className="mt-3 px-4 py-2 bg-primary-2 text-white rounded-lg hover:bg-primary-2/90 text-sm">
                    Update Password
                  </button>
                </div>

                <div className="p-4 border border-border-800/20 dark:border-text-400/50 rounded-lg">
                  <div className="py-2">
                    <button className="text-red-500 hover:underline text-sm flex items-center">
                      <LogOut className="w-4 h-4 mr-1" /> Log out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="block lg:hidden mt-6 bg-white dark:bg-surface-3 rounded-xl shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-border-800/20 dark:border-text-400/50 font-medium text-red-500">
          Danger Zone
        </div>
        <button
          className="w-full cursor-pointer px-4 py-3 text-left flex items-center hover:bg-surface-2 dark:hover:bg-surface-4 text-red-500"
          onClick={() => setShowDeleteModal(true)}
        >
          <Trash2 className="w-5 h-5 mr-3" />
          Delete Account
        </button>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-surface-3 rounded-xl shadow-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4 text-red-500">
              Delete Account
            </h3>
            <p className="text-text-600 dark:text-text-400 mb-6">
              Are you sure you want to delete your account? This action cannot
              be undone. All your data will be permanently removed.
            </p>
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button
                className="px-4 py-2 border border-border-800/20 dark:border-text-400/50 rounded-lg hover:bg-surface-2 dark:hover:bg-surface-4"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center justify-center"
                onClick={() => {
                  navigate("/");
                }}
              >
                <Trash2 className="w-5 h-5 mr-2" />
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
