import { useState, useEffect } from 'react';
import { notificationService } from '../services/notificationService';

interface AppTheme {
  mode: 'light' | 'dark';
  primaryColor: string;
  accentColor: string;
}

interface KeyboardShortcut {
  action: string;
  defaultKeys: string[];
  customKeys?: string[];
}

interface AppSettings {
  theme: AppTheme;
  shortcuts: KeyboardShortcut[];
  preferences: {
    showNotifications: boolean;
    autoSave: boolean;
    compactView: boolean;
    defaultView: 'officers' | 'roster';
    pageSize: number;
  };
}

// Get initial theme mode from localStorage or system preference
const getInitialThemeMode = (): 'light' | 'dark' => {
  const storedMode = localStorage.getItem('color-mode');
  if (storedMode === 'light' || storedMode === 'dark') {
    return storedMode;
  }
  if (storedMode === 'system' || !storedMode) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
};

const DEFAULT_SETTINGS: AppSettings = {
  theme: {
    mode: getInitialThemeMode(),
    primaryColor: '#FFD700', // Police Yellow
    accentColor: '#000000', // Police Black
  },
  shortcuts: [
    { action: 'goToOfficers', defaultKeys: ['g', 'o'] },
    { action: 'goToRoster', defaultKeys: ['g', 'r'] },
    { action: 'addOfficer', defaultKeys: ['ctrl', 'n'] },
    { action: 'search', defaultKeys: ['ctrl', 'k'] },
    { action: 'print', defaultKeys: ['ctrl', 'p'] },
    { action: 'export', defaultKeys: ['ctrl', 'e'] },
    { action: 'save', defaultKeys: ['ctrl', 's'] },
    { action: 'refresh', defaultKeys: ['ctrl', 'r'] },
    { action: 'help', defaultKeys: ['?'] },
  ],
  preferences: {
    showNotifications: true,
    autoSave: true,
    compactView: false,
    defaultView: 'officers',
    pageSize: 10,
  },
};

const STORAGE_KEY = 'nccpd_app_settings';

export function useAppSettings() {
  const [settings, setSettings] = useState<AppSettings>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsedSettings = JSON.parse(stored);
        return {
          ...DEFAULT_SETTINGS,
          ...parsedSettings,
          theme: {
            ...DEFAULT_SETTINGS.theme,
            ...parsedSettings.theme,
            mode: getInitialThemeMode(), // Always use current theme mode
          },
        };
      } catch (error) {
        console.error('Error parsing stored settings:', error);
        return DEFAULT_SETTINGS;
      }
    }
    return DEFAULT_SETTINGS;
  });

  // Save settings to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
      notificationService.error('Failed to save settings');
    }
  }, [settings]);

  // Update theme
  const updateTheme = (theme: Partial<AppTheme>) => {
    setSettings(prev => ({
      ...prev,
      theme: {
        ...prev.theme,
        ...theme,
      },
    }));
  };

  // Update keyboard shortcuts
  const updateShortcut = (action: string, keys: string[]) => {
    setSettings(prev => ({
      ...prev,
      shortcuts: prev.shortcuts.map(shortcut =>
        shortcut.action === action
          ? { ...shortcut, customKeys: keys }
          : shortcut
      ),
    }));
  };

  // Reset keyboard shortcuts to defaults
  const resetShortcuts = () => {
    setSettings(prev => ({
      ...prev,
      shortcuts: prev.shortcuts.map(shortcut => ({
        action: shortcut.action,
        defaultKeys: shortcut.defaultKeys,
      })),
    }));
  };

  // Update preferences
  const updatePreferences = (updates: Partial<AppSettings['preferences']>) => {
    setSettings(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        ...updates,
      },
    }));
  };

  // Reset all settings to defaults
  const resetAllSettings = () => {
    const defaultWithCurrentTheme = {
      ...DEFAULT_SETTINGS,
      theme: {
        ...DEFAULT_SETTINGS.theme,
        mode: getInitialThemeMode(),
      },
    };
    setSettings(defaultWithCurrentTheme);
    notificationService.success('Settings reset to defaults');
  };

  // Get active keys for a shortcut (custom or default)
  const getShortcutKeys = (action: string): string[] => {
    const shortcut = settings.shortcuts.find(s => s.action === action);
    return shortcut ? shortcut.customKeys || shortcut.defaultKeys : [];
  };

  // Check if a shortcut has been customized
  const isShortcutCustomized = (action: string): boolean => {
    const shortcut = settings.shortcuts.find(s => s.action === action);
    return Boolean(shortcut?.customKeys);
  };

  return {
    settings,
    updateTheme,
    updateShortcut,
    resetShortcuts,
    updatePreferences,
    resetAllSettings,
    getShortcutKeys,
    isShortcutCustomized,
  };
}

// Export types
export type { AppSettings, AppTheme, KeyboardShortcut };
