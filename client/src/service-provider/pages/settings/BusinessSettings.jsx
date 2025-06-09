import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/PageHeader";

const sections = [
  { label: "Calendar Integrations", path: "/dashboard/settings/calender" },
  {
    label: "Booking Preferences",
    path: "/dashboard/settings/booking-preference",
  },
  { label: "Security Settings", path: "/dashboard/settings/security" },
];

export default function BusinessSettings() {
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader title={"Settings"} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {sections.map(({ label, path }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className="w-full py-4 px-6 bg-primary-500 hover:bg-primary-600 dark:bg-primary-500/50 dark:hover:bg-primary-500/40 text-white font-semibold rounded-lg shadow transition-colors cursor-pointer"
            type="button"
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
