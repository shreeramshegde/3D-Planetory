/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    borderRadius: {
      none: '0px',
      sm: '2px',
      DEFAULT: '3px',
      md: '4px',
    },
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0A0B0F',
          panel: '#111319',
          elevated: '#171A23',
          border: 'rgba(232, 227, 214, 0.14)',
          divider: 'rgba(232, 227, 214, 0.08)',
        },
        bone: {
          DEFAULT: '#E8E3D6',
          muted: 'rgba(232, 227, 214, 0.65)',
          faint: 'rgba(232, 227, 214, 0.38)',
          hairline: 'rgba(232, 227, 214, 0.14)',
        },
        vermilion: {
          DEFAULT: '#FF5A36',
          hover: '#FF4119',
          dim: 'rgba(255, 90, 54, 0.18)',
        },
      },
      fontFamily: {
        serif: ['Instrument Serif', 'Georgia', 'serif'],
        sans: ['Hanken Grotesk', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      transitionTimingFunction: {
        'observatory': 'cubic-bezier(0.2, 0.8, 0.2, 1)',
      },
    },
  },
  plugins: [],
}
