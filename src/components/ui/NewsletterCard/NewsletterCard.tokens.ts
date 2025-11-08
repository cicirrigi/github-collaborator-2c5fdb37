/**
 * 📧 NewsletterCard Design Tokens
 * Orchestrated design tokens for newsletter card component
 */

export const newsletterCardTokens = {
  // Card styling - Compact horizontal layout
  card: {
    backgroundColor: 'var(--background-elevated)', // Dark card background
    borderColor: 'var(--brand-primary)', // Golden border
    borderWidth: '1px', // Thin border
    borderRadius: '1rem', // rounded-2xl
    padding: {
      mobile: '1.5rem', // p-6 - more compact
      desktop: '2rem', // p-8 - more compact
    },
    backdropBlur: 'blur(8px)',
    shadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  },

  // Typography
  typography: {
    title: {
      fontSize: '1.5rem', // text-2xl
      lineHeight: '2rem',
      fontWeight: '500', // font-medium
      color: 'var(--text-primary)',
      marginBottom: '1rem', // mb-4
    },
    subtitle: {
      fontSize: '1rem', // text-base
      lineHeight: '1.5rem',
      color: 'var(--text-secondary)',
      marginBottom: '2rem', // mb-8
    },
    brandHighlight: {
      color: 'var(--brand-primary)', // Gold color
      fontWeight: '500', // Slightly heavier
      textShadow: '0 0 8px rgba(203, 178, 106, 0.3)', // Subtle glow
      transition: 'all 0.3s ease-in-out',
      hoverGlow: '0 0 12px rgba(203, 178, 106, 0.5)', // Enhanced glow on hover
    },
  },

  // Form elements - Compact horizontal layout
  form: {
    spacing: {
      fieldGap: '1rem', // space-y-4 - compact
      gridGap: '0.75rem', // gap-3 - tighter grid spacing
      buttonMarginTop: '1rem', // mt-4 - reduced margin
    },
    input: {
      padding: '0.625rem 0.75rem', // px-3 py-2.5 - more compact
      height: '2.625rem', // h-[42px] - consistent height
      backgroundColor: 'var(--background-subtle)', // Input background
      borderColor: 'var(--border-default)', // Border color
      borderRadius: '0.5rem', // rounded-lg
      fontSize: '1rem', // text-base
      color: 'var(--text-primary)',
      placeholderColor: 'var(--text-placeholder)',
      focusBorderColor: 'var(--brand-primary)', // Golden focus border
      focusRingColor: 'var(--brand-primary)', // Golden focus ring
      focusRingOpacity: '0.3', // 30% opacity for ring
      transition: 'all 0.2s ease-in-out',
    },
    button: {
      padding: '1rem 2rem', // px-8 py-4
      height: '2.625rem', // h-[42px] - matches input height
      backgroundColor: 'var(--brand-primary)',
      color: 'var(--brand-primary-foreground)',
      borderRadius: '0.5rem', // rounded-lg
      fontSize: '1rem', // text-base
      fontWeight: '500', // font-medium
      hoverBackgroundColor: 'var(--brand-primary-hover)',
      transition: 'all 0.3s ease-in-out',
      width: '100%',
    },
    checkbox: {
      size: '1rem', // w-4 h-4
      color: 'var(--brand-primary)',
      backgroundColor: 'var(--background-subtle)',
      borderColor: 'var(--border-default)',
      borderRadius: '0.25rem', // rounded
      focusRingColor: 'var(--brand-primary-20)',
    },
  },

  // Grid layout
  grid: {
    mobile: '1fr', // Single column
    desktop: '1fr 1fr', // Two columns for First Name / Last Name
    gap: '1rem', // gap-4
  },

  // States
  states: {
    loading: {
      opacity: '0.7',
      cursor: 'not-allowed',
    },
    error: {
      borderColor: 'var(--destructive)',
      backgroundColor: 'var(--destructive-subtle)',
    },
    success: {
      borderColor: 'var(--success)',
      backgroundColor: 'var(--success-subtle)',
    },
  },

  // Animations
  animations: {
    fadeIn: {
      duration: '0.3s',
      ease: 'ease-in-out',
    },
    slideUp: {
      duration: '0.4s',
      ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
} as const;

export type NewsletterCardTokens = typeof newsletterCardTokens;
