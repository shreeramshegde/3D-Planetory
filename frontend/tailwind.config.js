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
          950: '#030712',
          900: '#080d1a',
          800: '#0f172a',
          700: '#1e293b',
        },
        cyber: {
          cyan: '#00f5ff',
          neon: '#39ff14',
          violet: '#a855f7',
          amber: '#f59e0b',
          crimson: '#ff3366',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'neon-cyan': '0 0 20px rgba(0, 245, 255, 0.45)',
        'neon-violet': '0 0 20px rgba(168, 85, 247, 0.45)',
        'neon-amber': '0 0 20px rgba(245, 158, 11, 0.45)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 20s linear infinite',
      }
    },
  },
  plugins: [],
}
