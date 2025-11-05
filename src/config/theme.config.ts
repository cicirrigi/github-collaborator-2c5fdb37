/**
 * 🎨 Theme Configuration - Vantage Lane 2.0
 * Modular orchestrator importing from design-system/tokens
 */

import { colors } from '../design-system/tokens/colors';
import { animations, motion } from '../design-system/tokens/animations';
import { typography } from '../design-system/tokens/typography';
import { spacing } from '../design-system/tokens/spacing';
import { gradients } from '../design-system/tokens/gradients';
import { buttonVariants } from '../design-system/variants/button.variants';
import { textVariants } from '../design-system/variants/text.variants';
import { newsletterVariants } from '../design-system/variants/newsletter.variants';

// Consolidated design tokens (imported from modular files)
export const designTokens = {
  colors,
  typography,
  spacing,
  gradients,
  animations,
  motion,
  // Footer specific spacing tokens
  footer: {
    spacing: {
      mainGrid: '2rem', // gap-8 equivalent for main grid (32px)
      gridGap: '1.75rem', // gap-7 unified for grid columns and rows (28px)
      categoryGap: '1rem', // space-y-4 for category spacing (16px)
      linkGap: '0.75rem', // space-y-3 for link spacing (12px) - slightly increased
      containerPadding: '4rem', // py-16 for main container (64px)
      bottomPadding: '1.5rem', // py-6 for bottom section (24px)
    },
  },

  // Fleet section specific tokens
  fleet: {
    spacing: {
      sectionPadding: '6rem', // py-24 for section padding (96px)
      cardGap: '2rem', // gap-8 for vehicle cards (32px)
      cardPadding: '1.5rem', // p-6 for card internal padding (24px)
      featureGap: '0.75rem', // gap-3 for feature spacing (12px)
      badgeSpacing: '1rem', // spacing for badges (16px)
    },
    dimensions: {
      cardImageHeight: '14rem', // h-56 (224px) - taller than square
      cardMinHeight: '28rem', // min-h-[28rem] for vertical aspect ratio
      cardAspectRatio: '3/4', // vertical aspect ratio for elegant look
    },
    effects: {
      hoverScale: 1.02, // hover:scale-[1.02] for cards (number for framer)
      imageScale: 1.1, // hover:scale-110 for images (number for framer)
      borderRadius: '0.75rem', // rounded-xl for cards (12px)
      glowOpacity: 0.1, // glow effect opacity (number for framer)
      // 3D Floating Effects
      shadowElevated: '0 20px 40px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.08)',
      shadowFloat: '0 25px 50px rgba(0, 0, 0, 0.15), 0 10px 20px rgba(0, 0, 0, 0.1)',
      goldBorder: '2px solid var(--brand-primary)',
      goldGlow: '0 0 20px rgba(203, 178, 106, 0.3), 0 0 40px rgba(203, 178, 106, 0.1)',
      transition: {
        duration: 0.3, // 300ms transitions
        ease: 'easeOut', // smooth easing
      },
    },
    categoryColors: {
      Executive: '#CBB26A', // gold brand color (unified)
      Luxury: '#CBB26A', // gold brand color
      SUV: '#CBB26A', // gold brand color (unified)
      MPV: '#CBB26A', // gold brand color (unified)
      Sports: '#CBB26A', // gold brand color (unified)
    },
    statusColors: {
      available: {
        bg: '#059669', // emerald-600
        bgOpacity: 'rgba(5, 150, 105, 0.2)', // emerald-600/20
        text: '#34D399', // emerald-400
      },
      limited: {
        bg: '#D97706', // amber-600
        bgOpacity: 'rgba(217, 119, 6, 0.2)', // amber-600/20
        text: '#FCD34D', // amber-300
      },
      unavailable: {
        bg: '#DC2626', // red-600
        bgOpacity: 'rgba(220, 38, 38, 0.2)', // red-600/20
        text: '#F87171', // red-400
      },
    },
    colors: {
      backGradientStart: 'var(--background)',
      backGradientEnd: 'var(--background-muted, var(--background))',
      backText: 'var(--text-primary)',
      backTextMuted: 'var(--text-muted)',
      backOverlay: 'var(--background-elevated)',
    },
    typography: {
      cardTitle: {
        fontSize: '1.25rem', // text-xl
        fontWeight: '500', // font-medium
        lineHeight: '1.75rem', // leading-7
      },
      cardDescription: {
        fontSize: '0.875rem', // text-sm
        lineHeight: '1.5rem', // leading-6
      },
      cardPrice: {
        fontSize: '0.875rem', // text-sm
        fontWeight: '500', // font-medium
      },
    },
  },

  // Border radius tokens
  borderRadius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    full: '9999px',
  },
  // Shadow tokens
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
  },
  // Breakpoints tokens (responsive design)
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
} as const;

export const propTokens = {
  variants: {
    primary: 'primary',
    secondary: 'secondary',
    outline: 'outline',
    ghost: 'ghost',
    destructive: 'destructive',
  },
  sizes: {
    sm: 'sm',
    md: 'md',
    lg: 'lg',
    xl: 'xl',
  },
} as const;

/**
 * 🧩 Component Variants (imported from design-system/variants)
 */
export const componentVariants = {
  button: buttonVariants,
  text: textVariants,
  newsletter: newsletterVariants,
} as const;

/**
 * 🎨 Unified Theme Configuration
 */
export const themeConfig = {
  tokens: designTokens,
  props: propTokens,
  components: componentVariants,
} as const;

export default themeConfig;
