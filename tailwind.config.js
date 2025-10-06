/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#7c3aed',
        accent: '#06b6d4',
        glass: 'rgba(255,255,255,0.04)'
      },
      backgroundImage: {
        'gradient-hero': "radial-gradient( circle at 10% 20%, rgba(124,58,237,0.15), transparent 20% ), linear-gradient(180deg, rgba(6,182,212,0.06), transparent)"
      }
    },
  },
  plugins: [],
}

