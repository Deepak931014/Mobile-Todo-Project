/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3B5DF7',
          dark: '#2B48D9',
          light: '#EEF2FF',
          hover: '#2F4FE0',
        },
        cardPending: {
          bg: '#FFF1F2',
          border: '#FFE4E6',
          text: '#F43F5E',
          subtext: '#9F1239'
        },
        cardComplete: {
          bg: '#EEF4FF',
          border: '#DBEAFE',
          text: '#3B5DF7',
          subtext: '#1E3A8A'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 8px 30px rgba(0, 0, 0, 0.06)',
        'float': '0 12px 36px rgba(59, 93, 247, 0.35)',
        'modal': '0 -8px 40px rgba(0, 0, 0, 0.12)',
      }
    },
  },
  plugins: [],
}

