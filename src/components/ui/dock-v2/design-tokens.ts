export const dockTokens = {
  size: {
    baseIcon: 48,
    minScale: 1,
    maxScale: 1.4, // Redus de la 1.8 pentru un efect mai subtil
    containerWidth: 68, // Pentru vertical
  },
  spacing: {
    containerPadding: {
      idle: 24, // Mărit pentru a preveni ieșirea iconurilor din chenar
      hover: 32, // Mărit pentru spațiu extra la magnification
    },
    gap: {
      idle: 16, // Mărit din nou pentru spacing și mai generos între iconuri
      hover: 24, // Mărit din nou pentru spacing foarte larg la hover
    },
  },
  motion: {
    stiffness: 240,
    damping: 18,
    lensStiffness: 280,
    lensDamping: 22,
    duration: {
      fast: 200,
      normal: 300,
      slow: 500,
    },
    easing: {
      smooth: 'ease-out',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
  },
  kernel: {
    distance: 120,
    sigma: 80,
  },
  theme: {
    // Glass morphism backgrounds - ADAPTIVE
    glass: {
      // Light mode - mai puțin transparent, mai mult alb
      light: {
        from: 'rgba(255,255,255,0.7)',
        to: 'rgba(255,255,255,0.4)',
        iconFrom: 'rgba(255,255,255,0.9)',
        iconTo: 'rgba(248,250,252,0.8)',
      },
      // Dark mode - original values
      dark: {
        from: 'rgba(255,255,255,0.18)',
        to: 'rgba(255,255,255,0.06)',
        iconFrom: 'rgba(255,255,255,0.08)',
        iconTo: 'rgba(0,0,0,0.35)',
      },
    },

    // Brand colors - CSS variables compatible
    primary: 'var(--brand-primary)',
    gold: '#CBB26A', // Authentic gold color for dock icons

    // Border colors - ADAPTIVE
    border: {
      light: 'rgba(0,0,0,0.1)',
      dark: 'rgba(255,255,255,0.2)',
      focus: 'var(--brand-primary)',
    },

    // Text colors - ADAPTIVE
    text: {
      light: {
        primary: 'rgba(0,0,0,0.9)',
        secondary: 'rgba(0,0,0,0.6)',
        tooltip: 'rgba(0,0,0,0.95)',
      },
      dark: {
        primary: 'rgba(255,255,255,0.95)',
        secondary: 'rgba(255,255,255,0.7)',
        tooltip: 'rgba(255,255,255,1)',
      },
    },

    // Background colors - ADAPTIVE
    background: {
      light: {
        separator: 'rgba(0,0,0,0.15)',
        tooltip: 'rgba(255,255,255,0.95)',
        iconHover: 'rgba(203,178,106,0.15)',
      },
      dark: {
        separator: 'rgba(255,255,255,0.3)',
        tooltip: 'rgba(0,0,0,0.8)',
        iconHover: 'rgba(203,178,106,0.1)',
      },
    },

    // Shadow definitions - ADAPTIVE
    shadow: {
      light: {
        low: '0 2px 6px rgba(0,0,0,0.1)',
        high: '0 14px 34px rgba(0,0,0,0.15)',
        glow: '0 0 20px rgba(203,178,106,0.2)',
      },
      dark: {
        low: '0 2px 6px rgba(0,0,0,0.3)',
        high: '0 14px 34px rgba(0,0,0,0.5)',
        glow: '0 0 20px rgba(203,178,106,0.4)',
      },
    },

    // Ring și focus states - ADAPTIVE
    ring: {
      width: 2,
      color: 'var(--brand-primary)',
      light: 'rgba(203,178,106,0.3)',
      dark: 'rgba(203,178,106,0.5)',
    },
  },
} as const;
