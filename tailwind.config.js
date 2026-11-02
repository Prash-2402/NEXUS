/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          bg: "#030308",
          dark: "#090817",
          indigo: "#17102E",
          card: "rgba(15, 12, 35, 0.65)",
          border: "rgba(129, 60, 255, 0.18)",
          "border-blue": "rgba(49, 92, 255, 0.25)",
        },
        electric: {
          blue: "#315CFF",
          cyan: "#38bdf8",
          glow: "rgba(49, 92, 255, 0.4)",
        },
        cosmic: {
          violet: "#813CFF",
          purple: "#a855f7",
          glow: "rgba(129, 60, 255, 0.4)",
        },
        stellar: {
          gold: "#F5C451",
          amber: "#fbbf24",
          glow: "rgba(245, 196, 81, 0.35)",
        },
        text: {
          primary: "#F8FAFC",
          secondary: "#A1A1B5",
          muted: "#64748B",
        }
      },
      fontFamily: {
        space: ['"Space Grotesk"', 'sans-serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'spin-very-slow': 'spin 30s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}

