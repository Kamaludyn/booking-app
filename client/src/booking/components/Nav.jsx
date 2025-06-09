import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sun, Moon, LayoutDashboard } from "lucide-react";
const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <nav
      className={`w-full fixed top-0 right-0 left-0 mx-auto py-4 flex justify-between items-center transition-all duration-300 z-50 ${
        scrolled ? "bg-[#cfe6ff] dark:bg-surface-4 shadow" : ""
      }`}
    >
      <header className="flex items-center justify-between w-full px-4 md:px-14">
        <h1
          className="text-2xl font-bold bg-gradient-to-r from-primary-2 to-accent-2 bg-clip-text text-transparent cursor-pointer"
          onClick={() => navigate("/")}
        >
          Bookify
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/user-dashboard")}
            className="p-2 rounded-full transition-colors duration-200 hover:bg-surface-2 dark:hover:bg-surface-4"
            aria-label="Go to dashboard"
            title="Dashboard"
          >
            <LayoutDashboard className="w-5 h-5 text-primary-2 dark:text-primary-400" />
          </button>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full transition-colors duration-200 hover:bg-surface-2 dark:hover:bg-surface-4"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-indigo-600" />
            )}
          </button>
        </div>
      </header>
    </nav>
  );
};

export default Nav;
