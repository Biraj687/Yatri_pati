const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'nepali-red': '#DC143C',
        primary: colors.blue, // Centralized theme color. Change 'colors.blue' to any other tailwind color or custom hex map to change the entire site's theme.
      },
      fontFamily: {
        sans: ['Noto Sans Devanagari', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '128': '32rem',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
