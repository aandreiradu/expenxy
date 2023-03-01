/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      gridTemplateColumns: {
        '2_20px': 'repeat(2, 12px)',
        'content-main-color':
          'linear-gradient(to top, #e6e9f0 0%, #eef1f5 100%)',
      },
      backgroundImage: {
        landing: "url('landing-background.jpg')",
      },
      boxShadow: {
        modal: '0 2px 8px rgba(0, 0, 0, 0.26)',
      },
      keyframes: {
        typing: {
          from: { width: '0' },
        },
        cursor: {
          '50%': { 'border-color': 'transparent' },
        },
        openScale: {
          '0%': { transform: 'scale(0)' },
          '100%': { transform: 'scale(1)' },
        },
        growingWidth: {
          from: {
            width: '0%',
          },
          to: {
            width: '100%',
          },
        },
      },
      animation: {
        typing: 'typing 3s infinite',
        cursor: 'cursor 1s infinite',
        openScale: 'openScale .25s linear',
        growingWidth: 'growingWidth .25s linear',
      },
    },
  },
  plugins: [],
};
