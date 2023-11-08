/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      textOpacity: {
        '10': '0.1',
        '20': '0.2',
        '50': '0.5',
        '95': '0.95',
      }
    },
  },
  plugins: [],
}

