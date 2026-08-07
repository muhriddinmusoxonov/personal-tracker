import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  theme: {
    extend: {
      colors: {
        ledger: {
          50: '#EAF6F0',
          100: '#D1EEE0',
          200: '#A6DDC3',
          300: '#74C7A2',
          400: '#46AC81',
          500: '#0E7A5F',
          600: '#0B5F49',
          700: '#094A39',
          800: '#08392C',
          900: '#062A21',
          950: '#041B15',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        sans: ['"Public Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.35s cubic-bezier(0.16, 1, 0.3, 1) both',
      },
    },
  },
}
