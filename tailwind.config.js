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
        'brand-red': '#ea0031',
        'brand-blue': '#5e5ca7',
        'nepali-red': '#ea0031',
        primary: {
          50: '#fce7eb',
          100: '#f8c4d8',
          200: '#f5a1c4',
          300: '#f17eb1',
          400: '#ed5b9d',
          500: '#ea0031', // Main brand red
          600: '#c9002a',
          700: '#a80023',
          800: '#87001c',
          900: '#660015',
        },
        secondary: {
          50: '#f0eef7',
          100: '#ddd9f0',
          200: '#cac4e8',
          300: '#b7afe1',
          400: '#a49ad9',
          500: '#5e5ca7', // Main brand blue
          600: '#524d91',
          700: '#463e7b',
          800: '#3a2f65',
          900: '#2e244f',
        },
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
