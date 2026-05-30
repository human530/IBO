/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // 粉嫩主色 (soft candy pink)
        brand: {
          50: '#fff1f7',
          100: '#ffe4f0',
          200: '#fecde3',
          300: '#fda4cf',
          400: '#fb72b4',
          500: '#f4509b',
          600: '#e23080',
          700: '#bd1e66',
          800: '#9c1c56',
          900: '#821a4a',
        },
        cream: '#fff7fb',
        candy: {
          pink: '#fda4cf',
          lavender: '#c4b5fd',
          mint: '#7ef0c8',
          peach: '#fdba9b',
          sky: '#9cd4fb',
          lemon: '#ffd97a',
        },
        ink: {
          DEFAULT: '#5b4660',
          soft: '#8a7593',
          faint: '#b8a9bf',
        },
      },
      fontFamily: {
        sans: ['"Noto Sans TC"', 'system-ui', 'sans-serif'],
        display: ['"Fredoka"', '"Noto Sans TC"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 30px -12px rgba(244, 80, 155, 0.35)',
        cute: '0 6px 0 0 rgba(244, 80, 155, 0.18)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}
