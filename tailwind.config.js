/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // 吉卜力天空藍 (Ghibli sky / primary)
        brand: {
          50: '#eef6f8',
          100: '#d8ebef',
          200: '#b6dae1',
          300: '#8bc3ce',
          400: '#5ca5b5',
          500: '#43899b',
          600: '#366f80',
          700: '#2e5a68',
          800: '#2a4a55',
          900: '#263e48',
        },
        // 紙感奶油底色 (warm paper)
        cream: '#fbf5e6',
        // 自然色點綴 (kept the `candy` token name to minimise churn)
        candy: {
          pink: '#e7a3a8',
          lavender: '#b3a4d4',
          mint: '#9fd6b6',
          peach: '#f0b27a',
          sky: '#a9d6e5',
          lemon: '#f2d281',
        },
        // 暖棕墨色文字
        ink: {
          DEFAULT: '#4f4636',
          soft: '#7a715f',
          faint: '#a89f8c',
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
