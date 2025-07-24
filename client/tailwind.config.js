/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./node_modules/@heroui/theme/dist/components/(button|ripple|spinner).js",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4f46e5',  
        secondary: '#3b82f6',
        muted: '#f3f4f6',
      },
    },
  },
  darkMode: "class",
  plugins: [],
};
