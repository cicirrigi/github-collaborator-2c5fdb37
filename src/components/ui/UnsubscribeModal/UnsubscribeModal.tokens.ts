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
    padding: '1.5rem', // p-6 (simplified for CSS)
    maxWidth: '28rem', // max-w-md
    backdropBlur: 'blur(8px)',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', // shadow-2xl
  },

  // Backdrop/overlay
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay
    backdropBlur: 'blur(4px)',
  },

  // Individual elements
  icon: {
    color: 'var(--brand-primary)',
  },
  title: {
    color: 'var(--text-primary)',
    fontSize: '1.125rem',
    fontWeight: '600',
  },
  description: {
    color: 'var(--text-secondary)',
    fontSize: '0.875rem',
  },
  closeButton: {
    color: 'var(--text-muted)',
  },

  // Form elements
  form: {
    label: {
      color: 'var(--text-primary)',
      fontSize: '0.875rem',
      fontWeight: '500',
      marginBottom: '0.5rem',
    },
    input: {
      padding: '0.75rem 1rem', // px-4 py-3
      backgroundColor: 'var(--background-subtle)',
      borderColor: 'var(--border-default)',
      borderRadius: '0.5rem', // rounded-lg
      fontSize: '0.875rem', // text-sm
      color: 'var(--text-primary)',
      border: '2px solid var(--border-default)', // Chenar mai vizibil
      focusBorderColor: 'var(--brand-primary)',
      focusBoxShadow: '0 0 0 2px var(--brand-primary-20)',
      placeholderColor: 'var(--text-muted)',
      transition: 'all 0.2s ease-in-out',
    },
  },

  // Buttons
  buttons: {
    cancel: {
      padding: '0.5rem 1rem',
      backgroundColor: 'transparent',
      borderColor: 'var(--border-default)',
      color: 'var(--text-secondary)',
      border: '1px solid var(--border-default)',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease-in-out',
      hoverBackgroundColor: 'var(--brand-primary)',
      hoverBorderColor: 'var(--brand-primary)',
      hoverTextColor: 'var(--brand-secondary)',
    },
    confirm: {
      padding: '0.5rem 1rem',
      backgroundColor: 'var(--destructive)',
      borderColor: 'var(--destructive)',
      color: 'var(--destructive-foreground)',
      border: '1px solid var(--destructive)',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease-in-out',
      hoverBackgroundColor: 'var(--destructive-hover)',
      hoverBorderColor: 'var(--destructive-hover)',
    },
    spacing: '0.75rem', // gap between buttons
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
      enter: 'ease-out duration-200',
      leave: 'ease-in duration-200',
    },
    backdrop: {
      enter: 'ease-out duration-150',
      leave: 'ease-in duration-150',
    },
  },
} as const;

export type UnsubscribeModalTokens = typeof unsubscribeModalTokens;
