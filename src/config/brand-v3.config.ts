/**
 * 🎨 VANTAGE LANE – Brand Configuration v3.1
 * Authoritative definition of brand identity and visual constants.
 * Used by design tokens, UI components and global CSS vars.
 */

export const brandConfig = {
  identity: {
    name: 'Vantage Lane',
    tagline: 'The Art of Refined Motion',
    founded: 2025,
    domain: 'vantagelane.com',
  },

  colors: {
    primary: '#CBB26A', // Gold – prestige & warmth
    secondary: '#1A1A1A', // Deep black – elegance & power
    accent: '#D4AF37', // Champagne gold accent
    text: {
      primary: '#FFFFFF',
      secondary: '#A3A3A3',
      muted: '#737373',
    },
    background: {
      light: '#F9F9F9',
      dark: '#0A0A0A',
      elevated: '#1A1A1A',
    },
    status: {
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
    },
  },

  typography: {
    fontPrimary: `'Inter', sans-serif`,
    fontAccent: `'Playfair Display', serif`,
    baseSize: '16px',
    scaleRatio: 1.25,
  },

  motion: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    easing: {
      smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      luxury: 'cubic-bezier(0.45, 0, 0.25, 1)',
    },
  },

  legal: {
    trademark: '© 2025 Vantage Lane. All rights reserved.',
    company: 'Vantage Lane Ltd',
    location: 'London, United Kingdom',
  },

  contact: {
    email: 'support@vantagelane.com',
    phone: '+44 20 8000 0000',
  },
} as const;

export type BrandConfig = typeof brandConfig;
