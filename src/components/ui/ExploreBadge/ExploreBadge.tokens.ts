/**
 * 🎨 ExploreBadge Design Tokens - Vantage Lane 2.0
 * Orchestrated styling fără hardcodări
 */

export const exploreBadgeTokens = {
  // Colors (toate din design tokens)
  colors: {
    translucent: {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropBlur: '8px',
      border: 'rgba(255, 255, 255, 0.2)',
      text: 'var(--text-primary)',
    },
    solid: {
      background: 'var(--brand-primary)', // #CBB26A
      text: 'var(--text-inverse)',
      shadow: '0 2px 8px rgba(203, 178, 106, 0.3)',
    },
    hover: {
      gold: 'var(--brand-primary)', // #CBB26A solid
      goldShadow: '0 4px 12px rgba(203, 178, 106, 0.4)',
    },
  },

  // Sizing tokens
  sizes: {
    sm: {
      padding: '0.375rem 0.75rem', // 6px 12px
      fontSize: '0.75rem', // 12px
      height: '1.75rem', // 28px
      gap: '0.25rem', // 4px
    },
    md: {
      padding: '0.5rem 1rem', // 8px 16px
      fontSize: '0.875rem', // 14px
      height: '2rem', // 32px
      gap: '0.375rem', // 6px
    },
    lg: {
      padding: '0.625rem 1.25rem', // 10px 20px
      fontSize: '1rem', // 16px
      height: '2.5rem', // 40px
      gap: '0.5rem', // 8px
    },
  },

  // Animation tokens
  animations: {
    duration: '200ms',
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    hover: {
      scale: '1.05',
      translateX: '4px',
    },
  },

  // Border radius
  borderRadius: '9999px', // Completely oval

  // Typography
  typography: {
    fontWeight: '500', // medium
    letterSpacing: '0.025em', // tracking-wide
  },

  // Mobile specific
  mobile: {
    tapText: {
      fontSize: '0.625rem', // 10px
      opacity: '0.7',
      marginTop: '0.125rem', // 2px spațiu între badge și text
      text: 'Tap to view', // Design token pentru text
    },
  },
} as const;

export type ExploreBadgeTokens = typeof exploreBadgeTokens;
