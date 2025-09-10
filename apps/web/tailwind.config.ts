import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    // Centered container with sane max width
    container: { center: true, padding: '1rem', screens: { '2xl': '1200px' } },
    extend: {
      colors: {
        // VDMA branding
        primary: {
          DEFAULT: '#003366',           // VDMA Blue
          foreground: '#ffffff',
        },
        accent: {
          DEFAULT: '#FF6600',           // VDMA Orange
          foreground: '#ffffff',
        },

        // Semantic tokens via CSS vars (HSL)
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
      },

      fontFamily: {
        // Clean, neutral UI font stack
        sans: ['Arial', 'system-ui', 'sans-serif'],
      },

      borderRadius: {
        // Keep radius driven by CSS var for theming
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },

      // Subtle shadows for cards and floating UI
      boxShadow: {
        // soft elevation for cards
        card: '0 10px 30px -15px rgba(0,0,0,.35)',
        // tiny ring-like shadow on hover
        ring: '0 0 0 1px hsl(var(--ring))',
      },

      // Smooth hero background (single radial, very subtle)
      backgroundImage: {
        'hero-soft':
          'radial-gradient(800px 300px at 50% -10%, rgba(0,51,102,.18), transparent)',
      },

      // Light motion for entrances
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'fade-up': 'fade-up .35s ease-out both',
        'fade-in': 'fade-in .25s ease-out both',
      },

      // Slightly smoother easing
      transitionTimingFunction: {
        'out-soft': 'cubic-bezier(.22,1,.36,1)',
      },

      // Optional tiny drop glow for icons/badges
      dropShadow: {
        glow: '0 0 24px rgba(0,51,102,.35)',
      },
    },
  },
  plugins: [],
}

export default config
