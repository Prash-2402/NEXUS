/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#04050b',
          900: '#080a14',
          800: '#0d1020',
          700: '#151a2e',
        },
        fg: {
          DEFAULT: '#eef1f8',
          muted: '#a3abbf',
          faint: '#6b7389',
        },
        ice: '#8fb8ff',
        tech: '#6ea8ff',
        strat: '#a78bfa',
        gold: '#f5c451',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      letterSpacing: {
        label: '0.22em',
      },
      maxWidth: {
        site: '76rem',
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};
