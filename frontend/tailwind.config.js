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
          950: '#030611',
          900: '#060a17',
          850: '#0a0f24',
          800: '#0e1630',
          700: '#182346',
        },
        celestial: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
        },
        starlight: '#f8fafc',
        platinum: '#cbd5e1',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
        tech: ['Rajdhani', 'sans-serif'],
        mono: ['Space Grotesk', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'glass': '0 20px 50px rgba(0, 0, 0, 0.7), inset 0 1px 1px 0 rgba(255, 255, 255, 0.18)',
        'glass-glow': '0 0 35px rgba(56, 189, 248, 0.25), 0 20px 50px rgba(0, 0, 0, 0.8), inset 0 1px 1px 0 rgba(255, 255, 255, 0.22)',
        'neon-cyan': '0 0 25px rgba(56, 189, 248, 0.5)',
        'neon-purple': '0 0 25px rgba(192, 132, 252, 0.5)',
        'neon-amber': '0 0 25px rgba(251, 191, 36, 0.5)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 24s linear infinite',
      }
    },
  },
  plugins: [],
}
