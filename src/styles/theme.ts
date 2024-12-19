export const theme = {
  colors: {
    primary: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
    },
    secondary: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
    police: {
      yellow: 'var(--color-police-yellow)',
      black: 'var(--color-police-black)',
      gold: 'var(--color-police-gold)',
      darkGray: '#1a1a1a',
    },
    // Theme-aware colors
    background: {
      primary: 'var(--color-bg-primary)',
      secondary: 'var(--color-bg-secondary)',
    },
    text: {
      primary: 'var(--color-text-primary)',
      secondary: 'var(--color-text-secondary)',
    },
    border: 'var(--color-border)',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },
  typography: {
    fontFamily: {
      sans: [
        'Inter',
        'ui-sans-serif',
        'system-ui',
        '-apple-system',
        'BlinkMacSystemFont',
        'Segoe UI',
        'Roboto',
        'Helvetica Neue',
        'Arial',
        'sans-serif',
      ].join(', '),
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
    },
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  shadows: {
    sm: {
      light: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      dark: '0 1px 2px 0 rgba(0, 0, 0, 0.15)',
    },
    md: {
      light: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      dark: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.18)',
    },
    lg: {
      light: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      dark: '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.15)',
    },
    xl: {
      light: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      dark: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.12)',
    },
    highlight: {
      light: '0 0 15px rgba(255, 215, 0, 0.3)',
      dark: '0 0 15px rgba(255, 215, 0, 0.15)',
    },
  },
  transitions: {
    duration: {
      fast: '150ms',
      normal: '200ms',
      slow: '300ms',
      theme: '250ms',
    },
    timing: {
      default: 'ease',
      linear: 'linear',
      theme: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
} as const;

// Type utilities
export type Theme = typeof theme;
export type ThemeColor = keyof typeof theme.colors;
export type ThemeSpacing = keyof typeof theme.spacing;
export type ThemeFontSize = keyof typeof theme.typography.fontSize;
export type ThemeFontWeight = keyof typeof theme.typography.fontWeight;
export type ThemeBreakpoint = keyof typeof theme.breakpoints;
export type ThemeShadow = keyof typeof theme.shadows;
export type ThemeTransitionDuration = keyof typeof theme.transitions.duration;
export type ThemeTransitionTiming = keyof typeof theme.transitions.timing;

// Helper functions
export const getThemeColor = (color: ThemeColor) => theme.colors[color];
export const getThemeSpacing = (spacing: ThemeSpacing) => theme.spacing[spacing];
export const getThemeFontSize = (size: ThemeFontSize) => theme.typography.fontSize[size];
export const getThemeFontWeight = (weight: ThemeFontWeight) => theme.typography.fontWeight[weight];
export const getThemeBreakpoint = (breakpoint: ThemeBreakpoint) => theme.breakpoints[breakpoint];
export const getThemeShadow = (shadow: ThemeShadow, mode: 'light' | 'dark' = 'light') => theme.shadows[shadow][mode];
export const getThemeTransitionDuration = (duration: ThemeTransitionDuration) => theme.transitions.duration[duration];
export const getThemeTransitionTiming = (timing: ThemeTransitionTiming) => theme.transitions.timing[timing];

export default theme;
