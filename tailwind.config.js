/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        esmeralda: {
          100: '#c8f5e0',
          200: '#8eedc0',
          300: '#00c878',
          400: '#00a86b',
          500: '#008f5a',
          600: '#006b42',
          700: '#004d30',
        }
      },
      fontFamily: {
        ubuntu: ['Ubuntu', 'sans-serif'],
        ubuntuc: ['Ubuntu Condensed', 'sans-serif'],
      }
    },
  },
  plugins: [],
}