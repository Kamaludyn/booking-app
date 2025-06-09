import { Users, CalendarPlus, Settings } from "lucide-react";

export default function QuickActions() {
  const actions = [
    {
      label: "Add Appointment",
      icon: <CalendarPlus />,
      href: "/dashboard/appointments/new",
    },
    { label: "Add Client", icon: <Users />, href: "/dashboard/clients/new" },
    { label: "Settings", icon: <Settings />, href: "/dashboard/settings" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {actions.map(({ label, icon, href }) => (
        <a
          key={label}
          href={href}
          className="flex items-center gap-2 p-4 rounded-xl bg-surface-500 dark:bg-surface-800 border border-border-500 dark:border-border-800 text-text-500 dark:text-text-700  shadow-sm hover:shadow-md transition"
        >
          {icon}
          <span className="text-sm font-medium">{label}</span>
        </a>
      ))}
    </div>
  );
}
