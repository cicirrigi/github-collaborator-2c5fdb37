/**
 * 🎨 Color Tokens - Vantage Lane Design System
 * Extracted from theme.config.ts for better organization
 */

export const colors = {
  // CSS variable tokens for theme consistency
  text: {
    primary: 'var(--text-primary)',
    secondary: 'var(--text-secondary)',
    muted: 'var(--text-muted)',
  },
  background: {
    dark: 'var(--background-dark)',
    elevated: 'var(--background-elevated)',
    surface: 'var(--background-surface)',
  },
  brand: {
    primary: 'var(--brand-primary)', // Gold primary
    secondary: 'var(--brand-secondary)', // Secondary
    accent: 'var(--brand-accent)', // Bright accent
  },
  border: {
    subtle: 'var(--border-subtle)',
    default: 'var(--border-default)',
  },
  // Static colors for fallbacks
  static: {
    brand: {
      primary: '#CBB26A', // Gold primary
      secondary: '#F59E0B', // Amber secondary
      accent: '#FACC15', // Bright accent
    },
  },
  neutral: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0A0A0A',
  },
  semantic: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },
} as const;

export type ColorTokens = typeof colors;
