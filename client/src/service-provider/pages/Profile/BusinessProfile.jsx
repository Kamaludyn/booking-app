import { useState, useEffect } from "react";
import { useAuth } from "../../../shared/context/AuthContext.jsx";
import PageHeader from "../../components/PageHeader";
import { useVendor, useSaveVendor } from "../../hooks/UseVendor";
import { ThreeDot } from "react-loading-indicators";

const ProfileSettings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const { user } = useAuth();
  const { data: vendorProfile } = useVendor();
  const { mutate, isPending } = useSaveVendor();
  const [bizProfile, setBizProfile] = useState({
    businessName: "",
    businessEmail: "",
    phone: "",
    address: "",
    bio: "",
    taxId: "",
    isProfileComplete: false,
  });

  // Populate form when vendorProfile is loaded
  useEffect(() => {
    if (vendorProfile) {
      setBizProfile({
        businessName: vendorProfile.businessName || "",
        businessEmail: vendorProfile.businessEmail || "",
        phone: vendorProfile.phone || "",
        address: vendorProfile.address || "",
        bio: vendorProfile.bio || "",
        taxId: vendorProfile.taxId || "",
        isProfileComplete: vendorProfile.isProfileComplete || false,
      });
    }
  }, [vendorProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBizProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle profile form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Call mutation to save vendor profile
    mutate(bizProfile);
  };

  return (
    <div>
      <PageHeader title="Profile Settings" />

      <div className="mx-auto p-6 bg-surface-500 dark:bg-surface-800 rounded-lg border border-border-500 dark:border-border-800 shadow-sm">
        <div className="flex border-b border-border-500 dark:border-border-800 mb-6">
          <button
            className={`px-4 py-2 font-medium text-text-500 border-b-2 dark:text-text-700 cursor-pointer ${
              activeTab === "profile"
                ? "border-primary-500 text-primary-500"
                : "border-transparent"
            }`}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>
          <button
            className={`px-4 py-2 font-medium text-text-500 border-b-2 dark:text-text-700 cursor-pointer ${
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
          <form className="space-y-4 h-[65vh]">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-500 dark:text-text-400 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  defaultValue={`${user.surname}, ${user.othername}`}
                  className="w-full bg-white dark:bg-background-800 text-text-500 dark:text-white dark:border-border-800 border border-border-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-500 dark:text-text-400 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  defaultValue={user.email}
                  className="w-full bg-white dark:bg-background-800 text-text-500 dark:text-white dark:border-border-800 border border-border-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-500 dark:text-text-400 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  defaultValue={bizProfile.phone || ""}
                  className="w-full bg-white dark:bg-background-800 text-text-500 dark:text-white dark:border-border-800 border border-border-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </form>
        )}

        {activeTab === "business" && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-500 dark:text-text-400 mb-1">
                Business Name
              </label>
              <input
                type="text"
                name="businessName"
                value={bizProfile.businessName || ""}
                onChange={handleChange}
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
                  name="businessEmail"
                  value={bizProfile.businessEmail || ""}
                  onChange={handleChange}
                  className="w-full bg-white dark:bg-background-800 text-text-500 dark:text-white dark:border-border-800 border border-border-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-500 dark:text-text-400 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={bizProfile.phone || ""}
                  onChange={handleChange}
                  className="w-full bg-white dark:bg-background-800 text-text-500 dark:text-white dark:border-border-800 border border-border-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-500 dark:text-text-400 mb-1">
                Address
              </label>
              <textarea
                name="address"
                value={bizProfile.address || ""}
                onChange={handleChange}
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
                  name="taxId"
                  value={bizProfile.taxId || ""}
                  onChange={handleChange}
                  className="w-full bg-white dark:bg-background-800 text-text-500 dark:text-white dark:border-border-800 border border-border-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="">
              <label className="block text-sm font-medium text-text-500 dark:text-text-400 mb-1">
                Description / Bio
              </label>
              <textarea
                name="bio"
                value={bizProfile.bio || ""}
                onChange={handleChange}
                className="w-full bg-white dark:bg-background-800 text-text-500 dark:text-white dark:border-border-800 border border-border-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            {/* <div className="flex justify-end gap-3 pt-4"> */}
            <button
              type="submit"
              className={`px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition cursor-pointer ${
                isPending && "cursor-not-allowed px-11.5"
              }`}
            >
              {isPending ? (
                <ThreeDot color="white" size="small" textColor="blue" />
              ) : (
                "Save Changes"
              )}
            </button>
            {/* </div> */}
          </form>
        )}
      </div>
    </div>
  );
};

export default ProfileSettings;
