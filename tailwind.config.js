/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        ink: {
          50: '#f0f4ff',
          100: '#dde5ff',
          200: '#c2cfff',
          300: '#9daeff',
          400: '#7585fd',
          500: '#5B5EF5',
          600: '#4a44e8',
          700: '#3d36cc',
          800: '#322fa4',
          900: '#2c2b82',
          950: '#1a1952',
        },
        coral: {
          400: '#FF6B6B',
          500: '#FF5252',
          600: '#E53935',
        },
        lime: {
          400: '#C6F135',
          500: '#B2E019',
        },
        amber: {
          400: '#FFB347',
          500: '#FF9500',
        },
        canvas: '#0B0C17',
        surface: '#12131F',
        card: '#181928',
        border: '#252640',
        muted: '#3A3C5E',
        faint: '#555778',
        sub: '#8A8CB0',
        text: '#E8E9FF',
      },
      backgroundImage: {
        'grid-pattern': "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23252640' fill-opacity='0.6'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        'dot-pattern': "radial-gradient(circle, #252640 1px, transparent 1px)",
        'hero-glow': 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(91,94,245,0.25), transparent)',
        'card-shine': 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 60%)',
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease forwards',
        'fade-in': 'fadeIn 0.4s ease forwards',
        'slide-in-right': 'slideInRight 0.4s ease forwards',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 1.8s infinite',
        'spin-slow': 'spin 8s linear infinite',
        'border-glow': 'borderGlow 2s ease-in-out infinite',
        'typing': 'typing 1.5s steps(30) infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideInRight: {
          from: { opacity: '0', transform: 'translateX(20px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        borderGlow: {
          '0%, 100%': { borderColor: 'rgba(91,94,245,0.3)' },
          '50%': { borderColor: 'rgba(91,94,245,0.8)' },
        },
      },
      boxShadow: {
        'ink': '0 0 0 1px rgba(91,94,245,0.3), 0 4px 20px rgba(91,94,245,0.15)',
        'ink-lg': '0 0 0 1px rgba(91,94,245,0.4), 0 8px 40px rgba(91,94,245,0.25)',
        'card': '0 1px 0 0 rgba(255,255,255,0.04) inset, 0 4px 24px rgba(0,0,0,0.4)',
        'glow-coral': '0 0 20px rgba(255,107,107,0.3)',
        'glow-lime': '0 0 20px rgba(198,241,53,0.25)',
        'glow-ink': '0 0 30px rgba(91,94,245,0.3)',
      },
    },
  },
  plugins: [],
};
