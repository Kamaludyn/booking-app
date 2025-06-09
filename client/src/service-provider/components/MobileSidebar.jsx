import { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { X, Moon, Sun, User } from "lucide-react";

const navItems = [
  { title: "Dashboard", path: "/dashboard/" },
  { title: "Appointments", path: "/dashboard/appointments" },
  { title: "Availability", path: "/dashboard/availability" },
  { title: "Clients", path: "/dashboard/clients" },
  { title: "Services", path: "/dashboard/services" },
  { title: "Staff", path: "/dashboard/staff" },
  { title: "Payments", path: "/dashboard/payments" },
  { title: "Settings", path: "/dashboard/settings" },
];

export default function MobileSidebar({ open, onClose }) {
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    document.documentElement.classList.toggle("dark");
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
  }, [open]);

  return (
    <div
      className={`fixed inset-0 z-50 transition-all duration-300 dark:text-white ${
        open ? "translate-x-0" : "-translate-x-full"
      } lg:hidden`}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <aside className="relative w-64 h-full bg-surface-500 dark:bg-surface-800 p-4 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold ">Bookify</h2>
          <div className="flex gap-4">
            <div
              className="w-8 h-8 rounded-full bg-border-500 dark:bg-border-800"
              onClick={() => navigate("/dashboard/profile")}
            >
              <User className="mt-1 mx-auto dark:text-white" />
            </div>
            <button onClick={onClose}>
              <X className="w-5 h-5  cursor-pointer" />
            </button>
          </div>
        </div>

        <nav className="flex flex-col space-y-3">
          {navItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              end
              className={({ isActive }) =>
                isActive
                  ? "block rounded-lg text-sm bg-primary-500 dark:bg-primary-500/50 text-white  px-4 py-2 cursor-pointer"
                  : "text-sm hover:bg-primary-500/20 px-4 py-2 "
              }
            >
              {item.title}
            </NavLink>
          ))}
        </nav>

        <div className="mt-8 flex items-center gap-3">
          <Sun className="w-4 h-4 " />
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
          <Moon className="w-4 h-4 " />
        </div>
      </aside>
    </div>
  );
}
