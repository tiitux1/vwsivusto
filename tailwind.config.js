/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'vw-blue': '#001e50',
        'vw-light-blue': '#005ca9',
        'vw-accent': '#00b5e2',
        'vw-silver': '#c0c0c0',
        'vw-dark-gray': '#333333',
        'vw-light-gray': '#f5f5f5',
        'vw-white': '#ffffff',
        'vw-red': '#cc0000',
        'vw-green': '#00aa00',
      },
      fontFamily: {
        sans: ['Segoe UI', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'vw': '0 4px 6px rgba(0, 0, 0, 0.1)',
        'vw-lg': '0 8px 25px rgba(0, 0, 0, 0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
