/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // 天空之城藍 (clean Ghibli sky-blue / primary)
        brand: {
          50: '#f1f7fc',
          100: '#dcebf8',
          200: '#bedaef',
          300: '#92c1e3',
          400: '#5fa1d3',
          500: '#3d83bf',
          600: '#2f69a0',
          700: '#295681',
          800: '#26486a',
          900: '#233d59',
        },
        // 雲白紙感底色 (soft cloud white)
        cream: '#f7fbff',
        // 點綴色 (kept the `candy` token name to minimise churn)
        candy: {
          pink: '#e7a3a8',
          lavender: '#a9b8e0',
          mint: '#9fd6cf',
          peach: '#f0b27a',
          sky: '#a9d6e5',
          lemon: '#f2d281',
        },
        // 冷調墨藍文字
        ink: {
          DEFAULT: '#324155',
          soft: '#5f7088',
          faint: '#93a3b8',
        },
        meadow: '#7fb069',
        sunset: '#ef9d6b',
      },
      fontFamily: {
        sans: ['"Noto Sans TC"', 'system-ui', 'sans-serif'],
        // 手寫故事感字體 (Klee One supports Traditional Chinese)
        display: ['"Klee One"', '"Noto Sans TC"', 'system-ui', 'serif'],
      },
      boxShadow: {
        soft: '0 12px 30px -14px rgba(79, 70, 54, 0.35)',
        cute: '0 5px 0 0 rgba(54, 111, 128, 0.18)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}
