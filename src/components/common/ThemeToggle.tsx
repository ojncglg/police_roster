import React from 'react';
import { useDarkMode } from '../../hooks/useDarkMode';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  showLabel = false,
  size = 'medium'
}) => {
  const { isDark, toggle, mode, setMode } = useDarkMode();

  const sizes = {
    small: {
      button: 'h-8 w-8',
      icon: 'w-4 h-4',
      text: 'text-sm',
    },
    medium: {
      button: 'h-10 w-10',
      icon: 'w-5 h-5',
      text: 'text-base',
    },
    large: {
      button: 'h-12 w-12',
      icon: 'w-6 h-6',
      text: 'text-lg',
    },
  };

  const renderIcon = () => {
    if (isDark) {
      return (
        <svg
          className={`${sizes[size].icon} text-police-yellow`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
            clipRule="evenodd"
          />
        </svg>
      );
    }
    return (
      <svg
        className={`${sizes[size].icon} text-gray-500`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
      </svg>
    );
  };

  return (
    <div className={`flex items-center ${className}`}>
      {showLabel && (
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as 'light' | 'dark' | 'system')}
          className={`
            mr-2 ${sizes[size].text}
            bg-transparent border-none focus:ring-0
            dark:text-gray-300 text-gray-700
          `}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="system">System</option>
        </select>
      )}
      <button
        onClick={toggle}
        className={`
          ${sizes[size].button}
          rounded-lg
          flex items-center justify-center
          transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-police-yellow
          hover:bg-gray-100 dark:hover:bg-gray-800
          ${isDark ? 'bg-gray-900' : 'bg-white'}
          ${isDark ? 'text-police-yellow' : 'text-gray-500'}
          ${isDark ? 'border-gray-700' : 'border-gray-200'}
          border
        `}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {renderIcon()}
      </button>
      {showLabel && (
        <span className={`ml-2 ${sizes[size].text} dark:text-gray-300 text-gray-700`}>
          {isDark ? 'Dark Mode' : 'Light Mode'}
        </span>
      )}
    </div>
  );
};

export const ThemeSelect: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { mode, setMode } = useDarkMode();

  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Theme Mode
      </label>
      <div className="flex space-x-2">
        {(['light', 'dark', 'system'] as const).map((themeMode) => (
          <button
            key={themeMode}
            onClick={() => setMode(themeMode)}
            className={`
              px-4 py-2 rounded-md text-sm font-medium
              transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-police-yellow
              ${mode === themeMode
                ? 'bg-police-yellow text-black'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }
              hover:bg-police-gold hover:text-black
            `}
          >
            {themeMode.charAt(0).toUpperCase() + themeMode.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeToggle;
