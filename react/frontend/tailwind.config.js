/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter','ui-sans-serif','system-ui','Segoe UI','Roboto','Helvetica Neue','Arial','Noto Sans','sans-serif']
      },
      boxShadow: {
        glow: '0 10px 30px -5px rgba(16,185,129,0.35), 0 8px 16px -8px rgba(59,130,246,0.25)'
      },
      keyframes: {
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
        shine: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } }
      },
      animation: {
        float: 'float 8s ease-in-out infinite',
        shine: 'shine 2.5s linear infinite'
      }
    }
  },
  plugins: [],
}
