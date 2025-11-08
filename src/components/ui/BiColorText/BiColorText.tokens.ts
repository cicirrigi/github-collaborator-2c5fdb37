/**
 * 🎨 BiColorText Design Tokens
 * Orchestrated design tokens for bi-color text component
 */

export const biColorTextTokens = {
  // Size variants
  sizes: {
    sm: {
      fontSize: '0.875rem', // text-sm
      lineHeight: '1.25rem',
    },
    md: {
      fontSize: '1rem', // text-base
      lineHeight: '1.5rem',
    },
    lg: {
      fontSize: '1.125rem', // text-lg
      lineHeight: '1.75rem',
    },
    xl: {
      fontSize: '1.25rem', // text-xl
      lineHeight: '1.75rem',
    },
    '2xl': {
      fontSize: '1.5rem', // text-2xl
      lineHeight: '2rem',
    },
    '3xl': {
      fontSize: '1.875rem', // text-3xl
      lineHeight: '2.25rem',
    },
    '4xl': {
      fontSize: '2.25rem', // text-4xl
      lineHeight: '2.5rem',
    },
    '5xl': {
      fontSize: '3rem', // text-5xl
      lineHeight: '1',
    },
  },

  // Font weights
  weights: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },

  // Text alignment
  alignments: {
    left: 'left',
    center: 'center', 
    right: 'right',
  },

  // Color tokens
  colors: {
    primary: 'var(--text-primary)', // White/black based on theme
    accent: 'var(--brand-primary)', // Gold color
    fallback: {
      primary: '#ffffff',
      accent: '#CBB26A',
    },
  },

  // Spacing
  spacing: {
    gap: '0.25rem', // gap-1 between words
  },

  // Typography enhancements
  typography: {
    letterSpacing: 'tracking-tight',
    fontFeatureSettings: '"kern" 1, "liga" 1',
  },

  // Enhanced effects for accent text
  effects: {
    accentGlow: {
      textShadow: '0 0 20px rgba(203, 178, 106, 0.4)', // Subtle golden glow
      transition: 'all 0.3s ease-in-out',
      hoverGlow: '0 0 30px rgba(203, 178, 106, 0.6)', // Enhanced glow on hover
      animation: 'subtle-pulse 3s ease-in-out infinite',
    },
  },

  // Keyframes for subtle animation
  animations: {
    subtlePulse: {
      keyframes: `
        @keyframes subtle-pulse {
          0%, 100% { text-shadow: 0 0 20px rgba(203, 178, 106, 0.4); }
          50% { text-shadow: 0 0 25px rgba(203, 178, 106, 0.5); }
        }
      `,
    },
  },
} as const;

export type BiColorTextTokens = typeof biColorTextTokens;
