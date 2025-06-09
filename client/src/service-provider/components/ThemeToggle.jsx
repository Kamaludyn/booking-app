import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react'


function ThemeToggle() {
  const [theme, setTheme] = useState('light');

  // On mount, set initial theme based on storage or system
  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (stored === 'dark' || (!stored && systemDark)) {
      document.documentElement.classList.add('dark');
      setTheme('dark');
    } else {
      document.documentElement.classList.remove('dark');
      setTheme('light');
    }
  }, []);

  // Toggle between dark and light
  const toggleTheme = () => {
    if (theme === 'dark') {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setTheme('light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setTheme('dark');
    }
  };

  return (
    <button className="border border-red-500" onClick={toggleTheme} aria-label="Toggle theme">
      {theme === 'dark' ? <Sun size={40} strokeWidth={1.75} absoluteStrokeWidth /> : <Moon size={40} strokeWidth={1.75} absoluteStrokeWidth />}
    </button>
  );
}

export default ThemeToggle;
