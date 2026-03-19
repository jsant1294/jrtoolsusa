/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        red: '#C41230',
        navy: '#0A1628',
        cream: '#F5F0E8',
        gold: '#D4A017',
        steel: '#2C3E50',
        mid: '#6B7280',
        light: '#E8E4DC',
      },
      fontFamily: {
        barlow: ['\'Barlow\', sans-serif'],
        'barlow-condensed': ['\'Barlow Condensed\', sans-serif'],
      },
    },
  },
  plugins: [],
}
