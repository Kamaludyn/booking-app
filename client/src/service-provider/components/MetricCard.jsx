import { CalendarDays, Users, DollarSign, UserCog } from "lucide-react";

const icons = {
  appointments: <CalendarDays className="w-6 h-6 text-primary-600" />,
  clients: <Users className="w-6 h-6 text-primary-600" />,
  revenue: <DollarSign className="w-6 h-6 text-primary-600" />,
  staff: <UserCog className="w-6 h-6 text-primary-600" />,
};

export default function MetricCard({ title, value, type }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl shadow-sm bg-surface-500 dark:bg-surface-800 border border-border-500 dark:border-border-800">
      <div>
        <p className="text-sm text-text-400 dark:text-text-700">{title}</p>
        <p className="text-xl font-semibold text-text-500 dark:text-white">
          {value}
        </p>
      </div>
      {icons[type]}
    </div>
  );
}
