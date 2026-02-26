import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: '#090909',
        card: '#141414',
        border: '#262626',
        'text-primary': '#e4e4e7',
        'text-secondary': '#71717a',
        // Section accents
        passion: {
          photo: '#f59e0b',
          comedie: '#a855f7',
          musique: '#3b82f6',
          theatre: '#ef4444',
          assos: '#10b981',
        },
      },
      fontFamily: {
        sans: ['var(--font-noto-serif)', 'var(--font-inter)', 'system-ui', 'serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
