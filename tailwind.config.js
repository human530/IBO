/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // 苔綠主色 (cozy moss / primary)
        brand: {
          50: '#f2f4ea',
          100: '#e3e8d2',
          200: '#c9d4ac',
          300: '#a9bd82',
          400: '#8aa35f',
          500: '#6f8a48',
          600: '#586f39',
          700: '#46582f',
          800: '#3a4928',
          900: '#2f3a23',
        },
        // 羊皮紙底色 (warm parchment)
        cream: '#f5ead0',
        // 手繪墨線描邊 (sketchy ink outline)
        line: '#3a2f28',
        // 大地色點綴 (earth-tone accents; token name kept as `candy`)
        candy: {
          pink: '#c97b6a',
          lavender: '#998aa6',
          mint: '#8bbf9a',
          peach: '#e0a35e',
          sky: '#7fa8a0',
          lemon: '#e3c25a',
        },
        ink: {
          DEFAULT: '#43352b',
          soft: '#7a6a58',
          faint: '#a8967f',
        },
        wood: '#b08453',
        clay: '#b9573e',
      },
      fontFamily: {
        sans: ['"Noto Sans TC"', 'system-ui', 'sans-serif'],
        // 手寫繪本字體
        display: ['"Klee One"', '"Noto Sans TC"', 'system-ui', 'serif'],
      },
      boxShadow: {
        // 手繪墨線的偏移實心陰影
        soft: '4px 5px 0 -1px rgba(58, 47, 40, 0.28)',
        cute: '3px 3px 0 0 rgba(58, 47, 40, 0.3)',
      },
      borderRadius: {
        '4xl': '1.4rem',
      },
    },
  },
  plugins: [],
}
