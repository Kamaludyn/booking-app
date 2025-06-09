import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LockKeyhole,
  ShieldCheck,
  Smartphone,
  Mail,
  ChevronLeft,
} from "lucide-react";

const SecuritySettings = () => {
  const [securitySettings, setSecuritySettings] = useState({
    passwordUpdatedAt: "2023-05-15",
    twoFactorEnabled: false,
    trustedDevices: [
      { id: 1, name: "MacBook Pro", lastUsed: "2 hours ago", os: "macOS" },
      { id: 2, name: "iPhone 13", lastUsed: "1 day ago", os: "iOS" },
    ],
    activeSessions: [
      {
        id: 1,
        location: "New York, US",
        ip: "192.168.1.1",
        device: "Chrome on Mac",
        lastActive: "Currently active",
      },
      {
        id: 2,
        location: "London, UK",
        ip: "203.0.113.42",
        device: "Firefox on Windows",
        lastActive: "3 days ago",
      },
    ],
  });

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showForgotPasswordForm, setShowForgotPasswordForm] = useState(false);
  const [resetLinkSent, setResetLinkSent] = useState(false);

  const navigate = useNavigate();

  const handlePasswordChange = (e) => {
    e.preventDefault();
    alert("Password changed successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowPasswordForm(false);
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setResetLinkSent(true);
    setTimeout(() => {
      setResetLinkSent(false);
      setShowForgotPasswordForm(false);
    }, 3000);
  };

  const toggleTwoFactor = () => {
    setSecuritySettings((prev) => ({
      ...prev,
      twoFactorEnabled: !prev.twoFactorEnabled,
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
          Security Settings
        </h1>
      </div>

      <section className="mb-8 p-6 bg-surface-500 dark:bg-surface-800 rounded-lg">
        <div className="flex items-center gap-3 mb-4">
          <LockKeyhole className="dark:text-white w-6 h-6" />
          <h2 className="text-lg font-semibold text-text-500 dark:text-white">
            Password
          </h2>
        </div>

        <p className="text-sm text-text-400 mb-4">
          Last changed: {securitySettings.passwordUpdatedAt}
        </p>

        {!showPasswordForm && !showForgotPasswordForm ? (
          <div className="flex gap-4">
            <button
              onClick={() => {
                setShowPasswordForm(true);
                setShowForgotPasswordForm(false);
              }}
              className="px-4 py-2 bg-primary-500 dark:bg-primary-500/50 dark:hover:bg-primary-500/40 text-white rounded-md hover:bg-primary-600 transition cursor-pointer"
            >
              Change Password
            </button>
            <button
              onClick={() => {
                setShowForgotPasswordForm(true);
                setShowPasswordForm(false);
              }}
              className="px-4 py-2 bg-primary-500 dark:bg-primary-500/50 dark:hover:bg-primary-500/40 text-white rounded-md hover:bg-primary-600 transition cursor-pointer"
            >
              Forgot Password
            </button>
          </div>
        ) : showPasswordForm ? (
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label
                htmlFor="currentPassword"
                className="block text-sm font-medium text-text-500 dark:text-text-400 mb-1"
              >
                Current Password
              </label>
              <input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-white dark:bg-background-800 text-text-500 dark:text-white dark:border-border-800 border border-border-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-text-500 dark:text-text-400 mb-1"
              >
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-white dark:bg-background-800 text-text-500 dark:text-white dark:border-border-800 border border-border-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
                minLength="8"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-text-500 dark:text-text-400 mb-1"
              >
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-white dark:bg-background-800 text-text-500 dark:text-white dark:border-border-800 border border-border-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="px-4 py-2 bg-primary-500 dark:bg-primary-500/50 dark:hover:bg-primary-500/40 text-white rounded-md hover:bg-primary-600 transition cursor-pointer"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setShowPasswordForm(false)}
                className="px-4 py-2 border border-border-500 dark:border-border-800 text-text-500 dark:text-white rounded-md hover:bg-surface-600 dark:hover:bg-surface-700 dark:hover:text-text-500 transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            {resetLinkSent ? (
              <div className="p-4 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-md">
                Password reset link has been sent to your email address.
              </div>
            ) : (
              <>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-text-500 dark:text-text-400 mb-1"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white dark:bg-background-800 text-text-500 dark:text-white dark:border-border-800 border border-border-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary-500 dark:bg-primary-500/50 dark:hover:bg-primary-500/40 text-white rounded-md hover:bg-primary-600 transition cursor-pointer"
                  >
                    Send Reset Link
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForgotPasswordForm(false)}
                    className="px-4 py-2 border border-border-500 dark:border-border-800 text-text-500 dark:text-white rounded-md hover:bg-surface-600 dark:hover:bg-surface-700 dark:hover:text-text-500 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </form>
        )}
      </section>

      <section className="mb-8 p-6 bg-surface-500 dark:bg-surface-800 rounded-lg">
        <div className="flex items-center gap-3 mb-4">
          <ShieldCheck className="dark:text-white w-6 h-6" />
          <h2 className="text-lg font-semibold text-text-500 dark:text-white">
            Two-Factor Authentication
          </h2>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-text-500 dark:text-text-400">
              Status:{" "}
              {securitySettings.twoFactorEnabled ? "Enabled" : "Disabled"}
            </h3>
            <p className="text-sm text-text-400 dark:text-text-400">
              {securitySettings.twoFactorEnabled
                ? "Adds an extra layer of security to your account"
                : "Protect your account with an additional verification step"}
            </p>
          </div>
          <button
            onClick={toggleTwoFactor}
            className={`w-12 h-6 rounded-full p-1 transition-colors flex items-center ${
              securitySettings.twoFactorEnabled
                ? "bg-primary-500 justify-end"
                : "bg-background-800 justify-start"
            }`}
          >
            <span className="block w-4 h-4 rounded-full bg-surface-500" />
          </button>
        </div>

        {securitySettings.twoFactorEnabled && (
          <div className="mt-4 p-4 bg-surface-700 rounded-md">
            <div className="flex items-start gap-3">
              <Smartphone className="dark:text-white w-6 h-6" />
              <div>
                <h4 className="font-medium text-text-500 dark:text-text-400">
                  SMS Verification
                </h4>
                <p className="text-sm text-text-400">
                  Receive codes via text message
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 mt-3">
              <Mail className="dark:text-white w-6 h-6" />
              <div>
                <h4 className="font-medium text-text-500 dark:text-text-400">
                  Email Verification
                </h4>
                <p className="text-sm text-text-400">Receive codes via email</p>
              </div>
            </div>
          </div>
        )}
      </section>
    </section>
  );
};

export default SecuritySettings;
