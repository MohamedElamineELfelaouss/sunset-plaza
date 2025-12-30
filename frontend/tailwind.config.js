/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./frontend/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./frontend/components/**/*.{js,ts,jsx,tsx,mdx}",
    // If you haven't moved folders yet, keep these too just in case:
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        serif: ["var(--font-playfair)", "serif"],
      },
      colors: {
        // We will map these to standard Tailwind colors to GUARANTEE they work
        sunset: {
          50: "#fffcf2",
          100: "#fef3c7", // amber-100
          500: "#f59e0b", // amber-500 (The Gold)
          600: "#d97706", // amber-600
        },
        plaza: {
          800: "#1e293b", // slate-800
          900: "#0f172a", // slate-900 (The Deep Dark)
        },
      },
    },
  },
  plugins: [],
};
