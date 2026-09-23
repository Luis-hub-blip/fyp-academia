/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#1e3a8a',
          purple: '#4a2574',
          gold: '#f59e0b',
          dark: '#0f172a',
          slate: '#1e293b',
          surface: '#090d16',
          cyan: '#06b6d4',
          light: '#f8fafc',
        },
      },
      fontFamily: {
        sans: ['Segoe UI', '-apple-system', 'BlinkMacSystemFont', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
