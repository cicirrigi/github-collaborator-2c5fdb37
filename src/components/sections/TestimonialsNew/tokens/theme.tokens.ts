/**
 * 🎨 TestimonialsNew - Theme Design Tokens
 * Light/dark mode orchestration cu CSS custom properties
 * Glassmorphism effects pentru look modern și translucid
 */

export const themeTokens = {
  // 🌅 Light theme colors
  light: {
    card: {
      background: 'rgba(255, 255, 255, 0.05)',
      backgroundHover: 'rgba(255, 255, 255, 0.08)',
      border: 'rgba(203, 178, 106, 0.2)',
      borderHover: 'rgba(203, 178, 106, 0.35)',
      shadow: 'rgba(0, 0, 0, 0.08)',
      shadowHover: 'rgba(0, 0, 0, 0.12)',
    },
    text: {
      primary: 'rgba(17, 24, 39, 0.9)', // gray-900 cu opacity
      secondary: 'rgba(75, 85, 99, 0.8)', // gray-600 cu opacity
      tertiary: 'rgba(107, 114, 128, 0.7)', // gray-500 cu opacity
      quote: 'rgba(31, 41, 55, 0.85)', // gray-800 cu opacity
    },
    accent: {
      primary: '#CBB26A', // Golden accent
      secondary: '#E5D485', // Lighter golden
      glow: 'rgba(203, 178, 106, 0.15)',
    },
  },

  // 🌙 Dark theme colors
  dark: {
    card: {
      background: 'rgba(0, 0, 0, 0.2)',
      backgroundHover: 'rgba(0, 0, 0, 0.3)',
      border: 'rgba(203, 178, 106, 0.25)',
      borderHover: 'rgba(203, 178, 106, 0.4)',
      shadow: 'rgba(0, 0, 0, 0.3)',
      shadowHover: 'rgba(0, 0, 0, 0.4)',
    },
    text: {
      primary: 'rgba(249, 250, 251, 0.95)', // gray-50 cu opacity
      secondary: 'rgba(209, 213, 219, 0.85)', // gray-300 cu opacity
      tertiary: 'rgba(156, 163, 175, 0.7)', // gray-400 cu opacity
      quote: 'rgba(229, 231, 235, 0.9)', // gray-200 cu opacity
    },
    accent: {
      primary: '#E5D485', // Brighter golden pentru dark mode
      secondary: '#CBB26A', // Standard golden
      glow: 'rgba(229, 212, 133, 0.2)',
    },
  },

  // 💎 Glassmorphism effects
  glassmorphism: {
    // Pentru carduri principale
    card: {
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      background: 'var(--testimonial-bg)',
      border: '1px solid var(--testimonial-border)',
      boxShadow: `
        0 8px 32px var(--testimonial-shadow),
        0 1px 0 rgba(255, 255, 255, 0.05) inset
      `,
    },
    // Pentru elemente interactive
    interactive: {
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      background: 'rgba(255, 255, 255, 0.03)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    },
    // Pentru overlay-uri
    overlay: {
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      background: 'rgba(0, 0, 0, 0.1)',
    },
  },

  // 🔄 CSS Custom Properties pentru runtime theme switching
  cssVariables: {
    // Variabile pentru light mode (default)
    light: {
      '--testimonial-bg': 'rgba(255, 255, 255, 0.05)',
      '--testimonial-bg-hover': 'rgba(255, 255, 255, 0.08)',
      '--testimonial-border': 'rgba(203, 178, 106, 0.2)',
      '--testimonial-border-hover': 'rgba(203, 178, 106, 0.35)',
      '--testimonial-shadow': 'rgba(0, 0, 0, 0.08)',
      '--testimonial-shadow-hover': 'rgba(0, 0, 0, 0.12)',
      '--testimonial-text': 'rgba(31, 41, 55, 0.85)',
      '--testimonial-text-primary': 'rgba(17, 24, 39, 0.9)',
      '--testimonial-text-secondary': 'rgba(75, 85, 99, 0.8)',
      '--testimonial-accent': '#CBB26A',
      '--testimonial-accent-glow': 'rgba(203, 178, 106, 0.15)',
    },
    // Variabile pentru dark mode
    dark: {
      '--testimonial-bg': 'rgba(0, 0, 0, 0.2)',
      '--testimonial-bg-hover': 'rgba(0, 0, 0, 0.3)',
      '--testimonial-border': 'rgba(203, 178, 106, 0.25)',
      '--testimonial-border-hover': 'rgba(203, 178, 106, 0.4)',
      '--testimonial-shadow': 'rgba(0, 0, 0, 0.3)',
      '--testimonial-shadow-hover': 'rgba(0, 0, 0, 0.4)',
      '--testimonial-text': 'rgba(229, 231, 235, 0.9)',
      '--testimonial-text-primary': 'rgba(249, 250, 251, 0.95)',
      '--testimonial-text-secondary': 'rgba(209, 213, 219, 0.85)',
      '--testimonial-accent': '#E5D485',
      '--testimonial-accent-glow': 'rgba(229, 212, 133, 0.2)',
    },
  },

  // 🌈 Gradient tokens pentru efecte speciale
  gradients: {
    // Gradient pentru background subtil
    cardBackground: {
      light: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02))',
      dark: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(0, 0, 0, 0.1))',
    },
    // Gradient pentru border glow
    borderGlow: {
      light: 'linear-gradient(135deg, rgba(203, 178, 106, 0.3), rgba(229, 212, 133, 0.1))',
      dark: 'linear-gradient(135deg, rgba(229, 212, 133, 0.4), rgba(203, 178, 106, 0.2))',
    },
    // Gradient pentru text accents
    textAccent: {
      both: 'linear-gradient(135deg, #CBB26A, #E5D485)',
    },
  },

  // 🔄 Theme switching utilities
  switching: {
    // Transition pentru smooth theme change
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    // Properties care trebuie să facă transition
    transitionProperties: [
      'background-color',
      'border-color',
      'color',
      'box-shadow',
      'backdrop-filter',
    ].join(', '),
  },

  // 🎯 Contrast threshold pentru AI auto-theme adaptation
  contrastThreshold: 0.5,

  // ⛰️ Elevation layers pentru layering consistent
  elevationLayers: {
    base: 0,
    card: 1,
    overlay: 10,
    modal: 100,
    tooltip: 1000,
  },
} as const;

// 🔧 Utility functions pentru theme management
export const getThemeVariables = (theme: 'light' | 'dark') => {
  return themeTokens.cssVariables[theme];
};

export const getGlassmorphismStyles = (variant: 'card' | 'interactive' | 'overlay' = 'card') => {
  return themeTokens.glassmorphism[variant];
};
