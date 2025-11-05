/**
 * 🃏 Card Design Tokens
 *
 * Centralized design system for Card component.
 * Eliminates magic numbers and hardcoded values.
 */

export const cardTokens = {
  // Base card styles
  base: {
    borderRadius: '0.5rem', // rounded-lg
    transition: 'colors 0.2s ease-in-out',
  },

  // Padding system - no magic numbers
  padding: {
    none: 'p-0',
    sm: 'p-3', // 12px - keep Tailwind for consistency
    md: 'p-4', // 16px
    lg: 'p-6', // 24px
    xl: 'p-8', // 32px
  },

  // Spacing tokens (for future CSS variables migration)
  spacing: {
    none: '0',
    sm: '0.75rem', // 12px
    md: '1rem', // 16px
    lg: '1.5rem', // 24px
    xl: '2rem', // 32px
  },

  // Card variant styles with theme-aware colors
  variants: {
    default: {
      background: 'bg-white dark:bg-neutral-900',
      border: 'border border-neutral-200 dark:border-neutral-800',
      shadow: 'shadow-sm',
    },
    elevated: {
      background: 'bg-white dark:bg-neutral-900',
      border: 'border-0',
      shadow: 'shadow-lg',
    },
    outline: {
      background: 'bg-transparent',
      border: 'border-2 border-neutral-300 dark:border-neutral-600',
      shadow: 'shadow-none',
    },
    ghost: {
      background: 'bg-transparent',
      border: 'border-0',
      shadow: 'shadow-none',
    },
  },

  // Hover effects - consistent system
  hover: {
    scale: 'hover:scale-[1.02]',
    shadow: 'hover:shadow-lg',
    transition: 'transition-all duration-300',
  },

  // Future CSS variables (for theme system migration)
  cssVariables: {
    background: {
      default: 'var(--card-background)',
      elevated: 'var(--card-background-elevated)',
    },
    border: {
      default: 'var(--card-border)',
      subtle: 'var(--card-border-subtle)',
    },
    shadow: {
      sm: 'var(--card-shadow-sm)',
      lg: 'var(--card-shadow-lg)',
    },
  },
} as const;

export type CardTokens = typeof cardTokens;
export type CardPaddingSize = keyof typeof cardTokens.padding;
export type CardVariant = keyof typeof cardTokens.variants;
