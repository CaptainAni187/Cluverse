/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        skin: {
          base: '#1e1e1e',   // main canvas
          card: '#232a3b',   // cards / inner blocks
          header: '#0b1638', // top bar
          accent: '#70c6ff', // blue accent strip in mock-up
        },
      },
      borderRadius: { 'lgx': '1.25rem' },
      boxShadow: {
        card: '0 4px 12px 0 rgba(0,0,0,.35)',
      },
    },
  },
  plugins: [],
}
