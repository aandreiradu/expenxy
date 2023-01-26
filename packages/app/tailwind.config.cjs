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
    },
  },
  plugins: [],
};
