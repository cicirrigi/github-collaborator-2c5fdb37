// import tailwindcssForms from '@tailwindcss/forms'; // Removed - causes focus ring conflicts
import tailwindcssTypography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';
import tailwindcssAnimate from 'tailwindcss-animate';

import { designTokens } from './src/config/theme.config';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}', // ← AUTH MODULE!
    './src/design-system/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      // Colors from theme.config.ts - single source of truth
      colors: {
        'brand-primary': '#CBB26A',
        'brand-secondary': '#E5D485',
        brand: {
          primary: designTokens.colors.brand.primary,
          secondary: designTokens.colors.brand.secondary,
          accent: designTokens.colors.brand.accent,
        },
        neutral: designTokens.colors.neutral,
        semantic: designTokens.colors.semantic,

        // Legacy shadcn colors (for compatibility)
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },

      // Typography from theme.config.ts
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
      fontSize: designTokens.typography.fontSize,
      fontWeight: designTokens.typography.fontWeight,

      // Spacing from theme.config.ts
      spacing: designTokens.spacing,

      // Border radius from theme.config.ts
      borderRadius: designTokens.borderRadius,

      // Shadows from theme.config.ts
      boxShadow: designTokens.shadows,

      // Animation timing from theme.config.ts
      transitionDuration: designTokens.animations.duration,
      transitionTimingFunction: designTokens.animations.easing.css,

      // Custom keyframes
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'luxury-float': {
          '0%, 100%': {
            transform: 'translateY(0px) scale(1)',
            filter: 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.4))',
          },
          '50%': {
            transform: 'translateY(-2px) scale(1.03)',
            filter: 'drop-shadow(0 4px 16px rgba(251, 191, 36, 0.6))',
          },
        },
        'shimmer-sweep': {
          '0%, 95%, 100%': { opacity: '0', transform: 'translateX(-100%)' },
          '45%, 55%': { opacity: '0.25', transform: 'translateX(100%)' },
        },
        'bounce-right': {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(6px)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'luxury-float': 'luxury-float 5s ease-in-out infinite',
        'shimmer-sweep': 'shimmer-sweep 6s infinite',
        'bounce-right': 'bounce-right 4s ease-in-out infinite',
      },
    },
  },
  plugins: [tailwindcssAnimate, tailwindcssTypography], // Removed tailwindcssForms - conflicts with custom focus
};

export default config;
