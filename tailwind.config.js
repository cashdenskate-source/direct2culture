/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Neue Haas Grotesk Display"', '"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
        sans: ['"Inter"', '"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
        serif: ['"PP Editorial New"', '"Times New Roman"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        ink: '#0A0A0A',
        bone: '#F4F2EE',
        smoke: '#1A1A1A',
        ash: '#8A8A8A',
      },
      letterSpacing: {
        tightest: '-0.04em',
        tighter: '-0.03em',
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
        'fade-up': 'fadeUp 0.8s ease-out forwards',
        'fade-in': 'fadeIn 1s ease-out forwards',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};
