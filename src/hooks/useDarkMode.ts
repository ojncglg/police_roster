import { useState, useEffect } from 'react';
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
  const { settings, updateTheme } = useAppSettings();
  const [isSystemDark, setIsSystemDark] = useState(() => 
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  // Get initial mode from settings or system preference
  const [mode, setMode] = useState<'light' | 'dark' | 'system'>(
    localStorage.getItem('color-mode') as 'light' | 'dark' | 'system' || 'system'
  );

  // Calculate if dark mode is active based on mode and system preference
  const isDark = mode === 'system' ? isSystemDark : mode === 'dark';

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setIsSystemDark(e.matches);
      if (mode === 'system') {
        updateThemeClass(e.matches);
      }
    };

    // Add listener for system theme changes
    mediaQuery.addEventListener('change', handleChange);

    // Initial setup
    setIsSystemDark(mediaQuery.matches);
    updateThemeClass(isDark);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mode]);

  // Update theme class and store preference
  const updateThemeClass = (dark: boolean) => {
    if (dark) {
      document.documentElement.classList.add('dark');
      updateTheme({ mode: 'dark' });
    } else {
      document.documentElement.classList.remove('dark');
      updateTheme({ mode: 'light' });
    }

    // Add transition class for smooth theme changes
    document.documentElement.classList.add('theme-transition');
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transition');
    }, 300);
  };

  const setModeWithTransition = (newMode: 'light' | 'dark' | 'system') => {
    setMode(newMode);
    localStorage.setItem('color-mode', newMode);

    const shouldBeDark = newMode === 'system' ? isSystemDark : newMode === 'dark';
    updateThemeClass(shouldBeDark);
  };

  const toggle = () => {
    const newMode = isDark ? 'light' : 'dark';
    setModeWithTransition(newMode);
  };

  const enable = () => setModeWithTransition('dark');
  const disable = () => setModeWithTransition('light');

  // Add CSS variables for theme transitions
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .theme-transition * {
        transition: background-color 0.3s ease, 
                    color 0.3s ease, 
                    border-color 0.3s ease, 
                    box-shadow 0.3s ease !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

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

// Helper function to get theme-aware color
export function getThemeAwareColor(lightColor: string, darkColor: string): string {
  const isDark = document.documentElement.classList.contains('dark');
  return isDark ? darkColor : lightColor;
}

// Helper function to get CSS variable value
export function getCSSVariable(name: string): string {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
}

// Helper function to set CSS variable
export function setCSSVariable(name: string, value: string): void {
  document.documentElement.style.setProperty(name, value);
}

// Helper function to generate theme-aware styles
export function createThemeAwareStyle(
  lightStyles: Record<string, string>,
  darkStyles: Record<string, string>
): string {
  const lightStylesStr = Object.entries(lightStyles)
    .map(([prop, value]) => `${prop}: ${value};`)
    .join('\n');

  const darkStylesStr = Object.entries(darkStyles)
    .map(([prop, value]) => `${prop}: ${value};`)
    .join('\n');

  return `
    ${lightStylesStr}
    .dark & {
      ${darkStylesStr}
    }
  `;
}
