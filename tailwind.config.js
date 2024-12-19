/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'police-yellow': 'var(--color-police-yellow)',
        'police-gold': 'var(--color-police-gold)',
        'police-black': 'var(--color-police-black)',
        'bg-primary': 'var(--color-bg-primary)',
        'bg-secondary': 'var(--color-bg-secondary)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
      },
      screens: {
        'print': {'raw': 'print'},
      },
    },
  },
  plugins: [],
}
