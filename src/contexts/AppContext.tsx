import React, { createContext, useContext, useEffect } from 'react';
import { useAppSettings, type AppSettings } from '../hooks/useAppSettings';

interface AppContextType {
  settings: AppSettings;
  updateTheme: (theme: Partial<AppSettings['theme']>) => void;
  updatePreferences: (prefs: Partial<AppSettings['preferences']>) => void;
  updateShortcut: (action: string, keys: string[]) => void;
  resetShortcuts: () => void;
  resetAllSettings: () => void;
  getShortcutKeys: (action: string) => string[];
  isShortcutCustomized: (action: string) => boolean;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const {
    settings,
    updateTheme,
    updatePreferences,
    updateShortcut,
    resetShortcuts,
    resetAllSettings,
    getShortcutKeys,
    isShortcutCustomized,
  } = useAppSettings();

  // Apply theme settings to document
  useEffect(() => {
    const root = document.documentElement;
    const { theme } = settings;

    // Update CSS variables
    root.style.setProperty('--color-primary', theme.primaryColor);
    root.style.setProperty('--color-accent', theme.accentColor);

    // Update theme mode
    if (theme.mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [settings.theme]);

  // Apply preferences
  useEffect(() => {
    const { preferences } = settings;

    // Apply compact view
    if (preferences.compactView) {
      document.body.classList.add('compact-view');
    } else {
      document.body.classList.remove('compact-view');
    }

    // Store preferences in localStorage for persistence
    localStorage.setItem('nccpd_preferences', JSON.stringify(preferences));
  }, [settings.preferences]);

  const value: AppContextType = {
    settings,
    updateTheme,
    updatePreferences,
    updateShortcut,
    resetShortcuts,
    resetAllSettings,
    getShortcutKeys,
    isShortcutCustomized,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

// Custom hook for theme values
export function useTheme() {
  const { settings } = useApp();
  return settings.theme;
}

// Custom hook for preferences
export function usePreferences() {
  const { settings } = useApp();
  return settings.preferences;
}

// Custom hook for keyboard shortcuts
export function useShortcuts() {
  const { settings, updateShortcut, getShortcutKeys, isShortcutCustomized } = useApp();
  return {
    shortcuts: settings.shortcuts,
    updateShortcut,
    getShortcutKeys,
    isShortcutCustomized,
  };
}

// Utility function to get CSS variable value
export function getCSSVariable(name: string): string {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
}

// Dark mode utilities
export function isDarkMode(): boolean {
  return document.documentElement.classList.contains('dark');
}

export function getThemeColor(colorVar: string, darkFallback?: string): string {
  const color = getCSSVariable(colorVar);
  if (isDarkMode() && darkFallback) {
    return darkFallback;
  }
  return color;
}
