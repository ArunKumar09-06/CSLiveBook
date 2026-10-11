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
    },
  },
  plugins: [],
};
