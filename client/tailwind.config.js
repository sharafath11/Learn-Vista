/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./node_modules/@heroui/theme/dist/components/(button|ripple|spinner).js",
    "./src/**/*.{js,ts,jsx,tsx}", // Add your source path too!
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6366f1', // Hex for indigo-500
        destructive: '#dc2626', // Hex for red-600
        'red-50': '#fef2f2',
        'blue-50': '#eff6ff',
        // Add any others you use
      },
    },
  },
  darkMode: "class",
  plugins: [],
  
  // ✅ This is the key to disabling `oklch()` completely
  future: {
    useColorFunction: false,
  },
};
