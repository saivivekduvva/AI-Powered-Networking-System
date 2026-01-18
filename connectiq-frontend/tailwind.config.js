/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // 👇 ADD THIS LINE HERE
  darkMode: 'class', 
  theme: {
    extend: {},
  },
  plugins: [],
}