/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable dark mode with class strategy
  theme: {
    extend: {
      colors: {
        police: {
          yellow: 'var(--color-police-yellow)',
          gold: 'var(--color-police-gold)',
          black: 'var(--color-police-black)',
          darkGray: '#1a1a1a',
        },
        // Dynamic theme colors
        primary: 'var(--color-primary)',
        accent: 'var(--color-accent)',
        // Background colors
        'bg-primary': 'var(--color-bg-primary)',
        'bg-secondary': 'var(--color-bg-secondary)',
        // Text colors
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        // Border colors
        border: 'var(--color-border)',
      },
      boxShadow: {
        'highlight': '0 0 15px rgba(255, 215, 0, 0.3)',
        'card': '0 2px 4px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 4px 12px rgba(255, 215, 0, 0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'fade-out': 'fadeOut 0.2s ease-in',
        'slide-in': 'slideIn 0.3s ease-out',
        'slide-out': 'slideOut 0.2s ease-in',
        'modal-enter': 'modalEnter 0.3s ease-out',
        'modal-exit': 'modalExit 0.2s ease-in',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideIn: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideOut: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        },
        modalEnter: {
          '0%': {
            opacity: '0',
            transform: 'scale(0.95) translateY(-10px)',
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1) translateY(0)',
          },
        },
        modalExit: {
          '0%': {
            opacity: '1',
            transform: 'scale(1) translateY(0)',
          },
          '100%': {
            opacity: '0',
            transform: 'scale(0.95) translateY(-10px)',
          },
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '2rem',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
  ],
  variants: {
    extend: {
      backgroundColor: ['dark', 'dark:hover'],
      borderColor: ['dark', 'dark:hover'],
      textColor: ['dark', 'dark:hover'],
      opacity: ['dark'],
      display: ['print'],
    },
  },
}
