import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { Moon, Sun, User, Bell } from "lucide-react";

const navItems = [
  { title: "Dashboard", path: "/dashboard" },
  { title: "Appointments", path: "/dashboard/appointments" },
  { title: "Availability", path: "/dashboard/availability" },
  { title: "Clients", path: "/dashboard/clients" },
  { title: "Services", path: "/dashboard/services" },
  { title: "Staff", path: "/dashboard/staff" },
  { title: "Payments", path: "/dashboard/payments" },
  { title: "Settings", path: "/dashboard/settings" },
];

export default function Sidebar() {
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    document.documentElement.classList.toggle("dark");
    setDarkMode(!darkMode);
  };
  return (
    <aside className="min-h-screen h-full bg-surface-500 dark:bg-surface-800 text-text-500 dark:text-white border-r border-border-500 dark:border-border-800 p-4 md:pt-5">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold ">Bookify</h2>
        <div className="flex gap-2">
          <div
            className="w-8 h-8 rounded-full bg-primary-500/20 dark:bg-surface-500/20 cursor-pointer"
            onClick={() => navigate("/dashboard/profile")}
          >
            <User className="mt-1 mx-auto text-primary-500" />
          </div>
          <div
            className="w-8 h-8 rounded-full bg-primary-500/20 dark:bg-surface-500/20 cursor-pointer"
            onClick={() => navigate("/dashboard/notifications")}
          >
            <Bell className="mt-1 mx-auto text-primary-500" />
          </div>
        </div>
      </div>
      <nav className="flex flex-col space-y-1">
        {navItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            end
            className={({ isActive }) =>
              isActive
                ? "block text-sm rounded-lg bg-primary-500 dark:bg-primary-500/50 text-white p-2 cursor-pointer"
                : "text-sm rounded-lg hover:bg-primary-500/20 p-2"
            }
          >
            {item.title}
          </NavLink>
        ))}
      </nav>
      <div className="mt-8 flex items-center gap-3">
        <Sun className="w-4 h-4" />
        <div
          className="w-8 h-5 bg-primary-500/20 dark:bg-surface-500/20 rounded-full peer transition duration-300 relative cursor-pointer"
          onClick={handleClick}
        >
          <div
            className={`absolute w-3 h-3 top-1 left-1 rounded-full shadow transition-transform ${
              darkMode ? "translate-x-3 bg-white" : "bg-primary-500"
            }`}
          ></div>
        </div>
        <Moon className="w-4 h-4" />
      </div>
    </aside>
  );
}
