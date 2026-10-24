/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        vault: {
          dark: '#121212',
          card: '#f4f1ea',
          border: '#e8e4db',
          red: '#c81d25',
          crimson: '#b91c1c',
          badge: '#fdf2f2',
          muted: '#737373',
        }
      }
    },
  },
  plugins: [],
}
