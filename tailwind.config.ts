import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f4fb',
          100: '#e0e8f7',
          200: '#c1d1ef',
          300: '#a2bae7',
          400: '#8ba1df',
          500: '#4d6fb3',
          600: '#1a3a7d',
          700: '#0F3A7D',
          800: '#092654',
          900: '#051a33',
        },
        teal: {
          50: '#e0f7fa',
          100: '#b2ebf2',
          200: '#80deea',
          300: '#4dd0e1',
          400: '#26c6da',
          500: '#06B6D4',
          600: '#00acc1',
          700: '#00838f',
          800: '#006064',
          900: '#004d4d',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
