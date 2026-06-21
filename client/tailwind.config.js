/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          150: '#e8ecf4',
          450: '#7e8fa4',
          650: '#3d4b5f',
          655: '#38465a',
          750: '#263347',
        },
        amber: {
          250: '#fddc6b',
          650: '#c66508',
        },
        emerald: {
          650: '#058760',
        },
        red: {
          650: '#cb2121',
        },
        indigo: {
          650: '#493fdd',
        },
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1', // Indigo primary
          600: '#4f46e5',
          650: '#493fdd',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glass-sm': '0 2px 8px 0 rgba(31, 38, 135, 0.08)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'glass-lg': '0 12px 40px 0 rgba(31, 38, 135, 0.12)',
      },
      backdropBlur: {
        'glass': '12px',
      }
    },
  },
  plugins: [],
}
