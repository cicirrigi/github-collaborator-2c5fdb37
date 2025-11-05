/**
 * 📧 UnsubscribeModal Design Tokens
 * Orchestrated design tokens for unsubscribe modal component
 */

export const unsubscribeModalTokens = {
  // Modal container
  modal: {
    backgroundColor: 'var(--background-elevated)', // Dark modal background
    borderColor: 'var(--border-subtle)', // Subtle border
    borderRadius: '1rem', // rounded-xl
    padding: {
      mobile: '1.5rem', // p-6
      desktop: '2rem', // p-8
    },
    maxWidth: '28rem', // max-w-md
    backdropBlur: 'blur(8px)',
    shadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', // shadow-2xl
  },

  // Backdrop/overlay
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay
    backdropBlur: 'blur(4px)',
  },

  // Typography
  typography: {
    title: {
      fontSize: '1.5rem', // text-2xl
      lineHeight: '2rem',
      fontWeight: '600', // font-semibold
      color: 'var(--text-primary)',
      marginBottom: '1rem', // mb-4
    },
    description: {
      fontSize: '0.875rem', // text-sm
      lineHeight: '1.25rem',
      color: 'var(--text-secondary)',
      marginBottom: '1.5rem', // mb-6
    },
  },

  // Form elements
  form: {
    input: {
      padding: '0.75rem 1rem', // px-4 py-3
      backgroundColor: 'var(--background-subtle)',
      borderColor: 'var(--border-default)',
      borderRadius: '0.5rem', // rounded-lg
      fontSize: '0.875rem', // text-sm
      color: 'var(--text-primary)',
      placeholderColor: 'var(--text-placeholder)',
      focusBorderColor: 'var(--brand-primary)',
      focusRingColor: 'var(--brand-primary-20)',
      marginBottom: '1rem', // mb-4
    },
  },

  // Buttons
  buttons: {
    spacing: '0.75rem', // gap-3
    cancel: {
      padding: '0.5rem 1rem', // px-4 py-2
      backgroundColor: 'transparent',
      borderColor: 'var(--border-default)',
      color: 'var(--text-secondary)',
      hoverBackgroundColor: 'var(--background-subtle)',
      borderRadius: '0.5rem',
    },
    confirm: {
      padding: '0.5rem 1rem', // px-4 py-2
      backgroundColor: 'var(--destructive)',
      color: 'var(--destructive-foreground)',
      hoverBackgroundColor: 'var(--destructive-hover)',
      borderRadius: '0.5rem',
    },
  },

  // States
  states: {
    success: {
      iconColor: 'var(--success)',
      textColor: 'var(--success)',
      backgroundColor: 'var(--success-subtle)',
    },
    error: {
      iconColor: 'var(--destructive)',
      textColor: 'var(--destructive)',
      backgroundColor: 'var(--destructive-subtle)',
    },
  },

  // Animations
  animations: {
    modal: {
      duration: '0.2s',
      ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
    backdrop: {
      duration: '0.15s',
      ease: 'ease-in-out',
    },
  },
} as const;

export type UnsubscribeModalTokens = typeof unsubscribeModalTokens;
