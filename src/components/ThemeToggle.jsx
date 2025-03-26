import React from 'react';
import { useDarkMode } from '../utils/DarkModeContext';
import { Moon, Sun } from 'lucide-react';

function ThemeToggle({ className = '' }) {
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <button
      onClick={toggleDarkMode}
      className={`p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 
      ${darkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-100 text-gray-700'}
      ${className}`}
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {darkMode ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}

export default ThemeToggle; 