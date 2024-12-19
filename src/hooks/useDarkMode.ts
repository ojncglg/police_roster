import { useState, useEffect, useCallback } from 'react';
import { useAppSettings } from './useAppSettings';

interface UseDarkModeReturn {
  isDark: boolean;
  toggle: () => void;
  enable: () => void;
  disable: () => void;
  isSystemDark: boolean;
  setMode: (mode: 'light' | 'dark' | 'system') => void;
  mode: 'light' | 'dark' | 'system';
}

export function useDarkMode(): UseDarkModeReturn {
  const { updateTheme } = useAppSettings();
  const [isSystemDark, setIsSystemDark] = useState(() => 
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  // Get initial mode from localStorage
  const [mode, setMode] = useState<'light' | 'dark' | 'system'>(
    localStorage.getItem('color-mode') as 'light' | 'dark' | 'system' || 'system'
  );

  // Calculate if dark mode is active based on mode and system preference
  const isDark = mode === 'system' ? isSystemDark : mode === 'dark';

  // Update theme class and store preference
  const updateThemeClass = useCallback((dark: boolean) => {
    if (dark) {
      document.documentElement.classList.add('dark');
      updateTheme({ mode: 'dark' });
    } else {
      document.documentElement.classList.remove('dark');
      updateTheme({ mode: 'light' });
    }
  }, [updateTheme]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setIsSystemDark(e.matches);
      if (mode === 'system') {
        updateThemeClass(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mode, updateThemeClass]);

  // Apply theme when mode or system preference changes
  useEffect(() => {
    const shouldBeDark = mode === 'system' ? isSystemDark : mode === 'dark';
    updateThemeClass(shouldBeDark);
  }, [mode, isSystemDark, updateThemeClass]);

  const setModeWithTransition = (newMode: 'light' | 'dark' | 'system') => {
    setMode(newMode);
    localStorage.setItem('color-mode', newMode);

    // Add transition class
    document.documentElement.classList.add('theme-transition');
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transition');
    }, 300);
  };

  const toggle = () => {
    const newMode = isDark ? 'light' : 'dark';
    setModeWithTransition(newMode);
  };

  const enable = () => setModeWithTransition('dark');
  const disable = () => setModeWithTransition('light');

  return {
    isDark,
    toggle,
    enable,
    disable,
    isSystemDark,
    setMode: setModeWithTransition,
    mode
  };
}
