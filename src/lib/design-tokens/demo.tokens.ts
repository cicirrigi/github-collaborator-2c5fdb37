/**
 * 🎪 Demo Pages Design Tokens
 *
 * Centralized design tokens for demo pages and components.
 * Eliminates hardcoded hex colors and magic values.
 */

export const demoTokens = {
  // Brand colors - consistent with design system
  colors: {
    // Primary brand gradients
    brandPrimary: 'var(--brand-primary)', // Instead of #CBB26A
    brandAccent: 'var(--brand-accent)', // Instead of #D4AF37
    brandGold: 'var(--brand-gold)', // Instead of #FFD479

    // CSS classes for text colors
    text: {
      brand: 'text-[var(--brand-primary)]', // Instead of text-[#CBB26A]
      accent: 'text-[var(--brand-accent)]',
      gold: 'text-[var(--brand-gold)]',
      muted: 'text-[var(--text-muted)]',
    },

    // Background colors with transparency
    background: {
      brandAlpha: 'bg-[var(--brand-primary)]/10', // Instead of bg-[#CBB26A]/10
      accentAlpha: 'bg-[var(--brand-accent)]/10',
      goldAlpha: 'bg-[var(--brand-gold)]/10',
    },
  },

  // Gradient system - theme aware
  gradients: {
    // Primary brand gradients
    primary: 'linear-gradient(to right, var(--brand-primary), var(--brand-accent))',
    gold: 'linear-gradient(to right, var(--brand-gold), var(--brand-accent-light))',
    warm: 'linear-gradient(to right, var(--brand-warm), var(--brand-primary))',
    rich: 'linear-gradient(to right, var(--brand-accent), var(--brand-dark))',

    // Fallback gradients (for legacy support)
    fallback: {
      primary: 'linear-gradient(to right, var(--brand-primary), var(--brand-accent))',
      gold: 'linear-gradient(to right, var(--brand-accent), var(--brand-secondary))',
      warm: 'linear-gradient(to right, var(--brand-secondary), var(--brand-primary))',
      rich: 'linear-gradient(to right, var(--brand-accent), var(--brand-primary))',
    },
  },

  // Typography for demo content
  typography: {
    title: {
      size: 'text-2xl',
      weight: 'font-bold',
      color: 'text-[var(--brand-primary)]',
      margin: 'mb-4',
    },
    subtitle: {
      size: 'text-xl',
      weight: 'font-medium',
      color: 'text-[var(--brand-primary)]',
      transform: 'capitalize',
    },
    description: {
      size: 'text-base',
      weight: 'font-normal',
      color: 'text-[var(--text-secondary)]',
    },
  },

  // Layout components
  layout: {
    section: {
      padding: 'p-8',
      margin: 'mt-16',
      alignment: 'text-center',
      radius: 'rounded-xl',
    },
    card: {
      background: 'bg-[var(--card-background)]',
      border: 'border border-[var(--card-border)]',
      shadow: 'shadow-lg',
      radius: 'rounded-lg',
      padding: 'p-6',
    },
  },

  // Interactive elements
  interactive: {
    button: {
      primary: {
        background: 'bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-accent)]',
        text: 'text-[var(--text-contrast)]',
        padding: 'px-6 py-3',
        radius: 'rounded-lg',
        weight: 'font-medium',
        hover: 'hover:scale-105',
        transition: 'transition-all duration-300',
      },
    },
  },
} as const;

export type DemoTokens = typeof demoTokens;
