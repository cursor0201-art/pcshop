import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'rgb(18, 18, 18)',
        foreground: 'rgb(255, 255, 255)',
        primary: {
          DEFAULT: 'rgb(229, 57, 53)',
          hover: 'rgb(211, 47, 47)',
          foreground: 'rgb(255, 255, 255)',
        },
        secondary: {
          DEFAULT: 'rgb(47, 49, 54)',
          foreground: 'rgb(255, 255, 255)',
        },
        card: {
          DEFAULT: 'rgb(47, 49, 54)',
          foreground: 'rgb(255, 255, 255)',
        },
        muted: {
          DEFAULT: 'rgb(60, 62, 68)',
          foreground: 'rgb(140, 142, 148)',
        },
        accent: {
          DEFAULT: 'rgb(229, 57, 53)',
          foreground: 'rgb(255, 255, 255)',
        },
        destructive: {
          DEFAULT: 'rgb(239, 68, 68)',
          foreground: 'rgb(255, 255, 255)',
        },
        border: 'rgb(70, 72, 78)',
        input: 'rgb(60, 62, 68)',
        ring: 'rgb(229, 57, 53)',
        success: 'rgb(34, 197, 94)',
        warning: 'rgb(234, 179, 8)',
        error: 'rgb(239, 68, 68)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(40px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.6s ease-out forwards',
        'slide-up': 'slide-up 0.8s ease-out forwards',
        'scale-in': 'scale-in 0.4s ease-out forwards',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
