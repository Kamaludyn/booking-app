import { useState } from "react";
import PageHeader from "../../components/PageHeader";

const AccountSettings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [avatar, setAvatar] = useState("default-avatar.png");
  const [businessLogo, setBusinessLogo] = useState("default-logo.png");

  // Handle file uploads
  const handleFileChange = (e, setImage) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <PageHeader title="Profile Settings" />

      <div className="mx-auto p-6 bg-surface-500 dark:bg-surface-800 rounded-lg border border-border-500 dark:border-border-800 shadow-sm">
        <div className="flex border-b border-border-500 dark:border-border-800 mb-6">
          <button
            className={`px-4 py-2 font-medium text-text-500 border-b-2 dark:text-text-700 ${
              activeTab === "profile"
                ? "border-primary-500 text-primary-500"
                : "border-transparent"
            }`}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>
          <button
            className={`px-4 py-2 font-medium text-text-500 border-b-2 dark:text-text-700 ${
              activeTab === "business"
                ? "border-primary-500 text-primary-500"
                : "border-transparent"
            }`}
            onClick={() => setActiveTab("business")}
          >
            Business
          </button>
        </div>

        {activeTab === "profile" && (
          <form className="space-y-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-full bg-surface-600 border-2 border-border-500 overflow-hidden">
                <img
                  src={avatar}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <label className="px-4 py-2 bg-primary-500 text-white rounded-md cursor-pointer hover:bg-primary-600 transition">
                Change Avatar
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, setAvatar)}
                />
              </label>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-500 dark:text-text-400 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  defaultValue="John Doe"
                  className="w-full bg-white dark:bg-background-800 text-text-500 dark:text-white dark:border-border-800 border border-border-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-500 dark:text-text-400 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  defaultValue="john@example.com"
                  className="w-full bg-white dark:bg-background-800 text-text-500 dark:text-white dark:border-border-800 border border-border-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-500 dark:text-text-400 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  defaultValue="+1234567890"
                  className="w-full bg-white dark:bg-background-800 text-text-500 dark:text-white dark:border-border-800 border border-border-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                className="px-4 py-2 bg-surface-600 text-text-500 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition"
              >
                Save Profile
              </button>
            </div>
          </form>
        )}

        {activeTab === "business" && (
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-500 dark:text-text-400 mb-1">
                Business Name
              </label>
              <input
                type="text"
                defaultValue="Beauty Salon Inc."
                className="w-full bg-white dark:bg-background-800 text-text-500 dark:text-white dark:border-border-800 border border-border-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-500 dark:text-text-400 mb-1">
                  Contact Email
                </label>
                <input
                  type="email"
                  defaultValue="contact@beautysalon.com"
                  className="w-full bg-white dark:bg-background-800 text-text-500 dark:text-white dark:border-border-800 border border-border-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-500 dark:text-text-400 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  defaultValue="+18005551234"
                  className="w-full bg-white dark:bg-background-800 text-text-500 dark:text-white dark:border-border-800 border border-border-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-500 dark:text-text-400 mb-1">
                Address
              </label>
              <textarea
                defaultValue="123 Business St, City"
                className="w-full bg-white dark:bg-background-800 text-text-500 dark:text-white dark:border-border-800 border border-border-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-500 dark:text-text-400 mb-1">
                  Tax ID
                </label>
                <input
                  type="text"
                  defaultValue="TAX-123456"
                  className="w-full bg-white dark:bg-background-800 text-text-500 dark:text-white dark:border-border-800 border border-border-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* <div>
              <label className="block text-sm font-medium text-text-500 dark:text-text-400 mb-1">
                Logo
              </label>
              <input
                type="file"
                className="w-full p-1.5 border border-border-500 bg-surface-500 rounded-md"
                onChange={(e) => handleFileChange(e, setBusinessLogo)}
              />
            </div> */}
            </div>

            <div className="">
              <label className="block text-sm font-medium text-text-500 dark:text-text-400 mb-1">
                Description / Bio
              </label>
              <textarea
                name="description"
                defaultValue="Empowering people through 1 on 1 life coaching"
                className="w-full bg-white dark:bg-background-800 text-text-500 dark:text-white dark:border-border-800 border border-border-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="text-sm text-text-400 block mb-1">
                Booking Page URL
              </label>
              <div className="w-full bg-white dark:bg-background-800 text-text-500 dark:text-white dark:border-border-800 border border-border-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
                yourapp.com/book/jenny-smith
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                className="px-4 py-2 bg-surface-600 text-text-500 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition"
              >
                Save Business
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AccountSettings;
