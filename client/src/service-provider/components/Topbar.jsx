import { useNavigate } from "react-router-dom";
import { Menu, Bell } from "lucide-react";

export default function Topbar({ onMenuClick }) {
  const navigate = useNavigate();
  return (
    <header className="md:hidden w-full flex items-center justify-between px-4 py-3 border-b bg-surface-500 dark:bg-surface-800 border-border-500 dark:border-border-800 lg:pl-72">
      <button
        onClick={onMenuClick}
        className="lg:hidden text-text-500 dark:text-text-700 cursor-pointer"
      >
        <Menu className="w-6 h-6" />
      </button>
      <h1 className="text-lg font-semibold text-text-500 dark:text-text-700">
        Bookify Admin
      </h1>
      <div
        className="w-8 h-8 rounded-full bg-border-500 dark:bg-border-800"
        onClick={() => navigate("/dashboard/notifications")}
      >
        <Bell className="mt-1 mx-auto dark:text-white" />
      </div>
    </header>
  );
}
