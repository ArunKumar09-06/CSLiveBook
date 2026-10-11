/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          0: '#05060F',
          1: '#0B0D1E',
          2: '#12152B',
        },
        surface: {
          glass: 'rgba(255, 255, 255, 0.06)',
          border: 'rgba(255, 255, 255, 0.12)',
        },
        aurora: {
          violet: '#7C3AED',
          indigo: '#4F46E5',
          cyan: '#06B6D4',
          emerald: '#34D399',
          pink: '#EC4899',
        },
        subject: {
          dbms: { from: '#22D3EE', to: '#3B82F6' },
          oop: { from: '#8B5CF6', to: '#D946EF' },
          os: { from: '#FB923C', to: '#F43F5E' },
          cn: { from: '#34D399', to: '#14B8A6' },
          devops: { from: '#FBBF24', to: '#F97316' },
          ca: { from: '#38BDF8', to: '#64748B' },
          sd: { from: '#6366F1', to: '#A855F7' },
          ai: { from: '#F472B6', to: '#8B5CF6' },
        },
      },
      fontFamily: {
        display: ['Sora', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        shimmer: 'shimmer 2s linear infinite',
        float: 'float 6s ease-in-out infinite',
        pulseGlow: 'pulseGlow 3s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
};
