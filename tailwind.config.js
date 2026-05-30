/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // 粉嫩主色 (soft candy pink)
        brand: {
          50: '#fff1f7',
          100: '#ffe1ee',
          200: '#ffc6df',
          300: '#ff9ec8',
          400: '#fb72b4',
          500: '#f4509b',
          600: '#e23080',
          700: '#bd1e66',
          800: '#9c1c56',
          900: '#821a4a',
        },
        // 粉白紙底
        cream: '#fff6fb',
        // 兒童畫風的描邊色 (crayon outline)
        line: '#6b5570',
        candy: {
          pink: '#ffb3d6',
          lavender: '#c9b8f0',
          mint: '#9ae8c8',
          peach: '#ffc09a',
          sky: '#a9d8f5',
          lemon: '#ffe08a',
        },
        ink: {
          DEFAULT: '#5b4660',
          soft: '#8a7593',
          faint: '#bda9c4',
        },
        meadow: '#8fd6a0',
        sunset: '#ff9f6b',
      },
      fontFamily: {
        sans: ['"Noto Sans TC"', 'system-ui', 'sans-serif'],
        // 手寫童趣字體
        display: ['"Klee One"', '"Noto Sans TC"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        // 卡通貼紙感的偏移實心陰影
        soft: '4px 5px 0 -1px rgba(244, 80, 155, 0.22)',
        cute: '3px 3px 0 0 rgba(107, 85, 112, 0.22)',
      },
      borderRadius: {
        '4xl': '1.9rem',
      },
    },
  },
  plugins: [],
}
