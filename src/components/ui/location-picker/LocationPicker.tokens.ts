/**
 * 📍 LocationPicker Design Tokens
 *
 * Centralized design system for LocationPicker component.
 * Eliminates hardcoded colors and magic values.
 */

export const locationPickerTokens = {
  // Icon colors - theme aware
  icon: {
    default: 'text-gray-600 dark:text-gray-400',
    hover: 'group-hover:text-yellow-600 dark:group-hover:text-yellow-400',
    focus: 'text-gray-800 dark:text-gray-200',
    // CSS variables for future migration
    cssVars: {
      default: 'text-[var(--icon-muted)]',
      hover: 'group-hover:text-[var(--brand-primary)]',
      focus: 'text-[var(--icon-active)]',
    },
  },

  // Input field styling - theme compatible
  input: {
    background: {
      default: 'bg-white/20 dark:bg-black/20',
      hover: 'hover:bg-yellow-50/30 dark:hover:bg-yellow-900/20',
      error: 'bg-red-50/20 dark:bg-red-900/20',
      disabled: 'bg-gray-100/20 dark:bg-gray-800/20',
    },
    text: {
      default: 'text-gray-600 dark:text-gray-400',
      disabled: 'text-gray-400',
    },
    border: {
      default: 'border border-gray-300 dark:border-gray-700',
      hover: 'hover:border-yellow-300/50',
      focus: 'focus:border-yellow-500',
      error: 'border-red-500 dark:border-red-400',
    },
    focus: {
      ring: 'focus:ring-2 focus:ring-yellow-500/50',
      border: 'focus:border-yellow-500',
    },
  },

  // Base styling
  base: {
    borderRadius: 'rounded-md',
    transition: 'transition-colors duration-200',
  },

  // Loading indicator
  loading: {
    border: 'border-2 border-blue-500 border-t-transparent',
    animation: 'animate-spin',
    size: 'w-4 h-4',
  },

  // Error styling
  error: {
    text: 'text-red-600 dark:text-red-400',
    size: 'text-sm',
    margin: 'mt-1',
  },

  // CSS Variables system (for future theme integration)
  cssVariables: {
    input: {
      background: 'var(--input-background)',
      backgroundHover: 'var(--input-background-hover)',
      text: 'var(--input-text)',
      border: 'var(--input-border)',
      borderHover: 'var(--input-border-hover)',
      borderFocus: 'var(--input-border-focus)',
    },
    icon: {
      default: 'var(--icon-muted)',
      hover: 'var(--icon-hover)',
      focus: 'var(--icon-active)',
    },
    focus: {
      ring: 'var(--focus-ring)',
      ringColor: 'var(--focus-ring-color)',
    },
  },

  // Brand colors for consistency
  brand: {
    primary: 'var(--brand-primary)',
    primaryHover: 'var(--brand-primary-hover)',
    primaryAlpha: 'var(--brand-primary-alpha)',
  },
} as const;

export type LocationPickerTokens = typeof locationPickerTokens;
