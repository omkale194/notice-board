/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f2f0ff",
          100: "#e6e2ff",
          500: "#6952f0",
          600: "#5a3fe0",
          700: "#4a30c2",
        },
      },
    },
  },
  plugins: [],
};
