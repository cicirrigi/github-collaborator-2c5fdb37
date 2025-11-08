/**
 * 📧 Newsletter Variants - Vantage Lane Design System
 * Luxury newsletter subscription component styles
 */

export const newsletterVariants = {
  container: {
    base: 'relative space-y-4 p-6 rounded-2xl backdrop-blur-sm',
    variants: {
      default: 'bg-white/5 border border-white/10',
      elevated: 'bg-white/10 border border-white/20 shadow-lg',
    },
  },
  input: {
    base: 'w-full px-4 py-3 rounded-xl transition-all font-medium placeholder:text-neutral-400',
    variants: {
      default: 'bg-white/10 border border-white/20 text-white backdrop-blur-sm',
      focused: 'bg-white/15 border-brand-primary ring-2 ring-brand-primary/20',
      error: 'bg-red-500/10 border-red-400 ring-2 ring-red-400/20',
      success: 'bg-green-500/10 border-green-400 ring-2 ring-green-400/20',
    },
  },
  button: {
    base: 'px-6 py-3 rounded-xl font-semibold transition-all transform-gpu',
    variants: {
      primary:
        'bg-brand-primary hover:bg-brand-primary/90 text-black hover:scale-[1.02] active:scale-[0.98]',
      loading: 'bg-brand-primary/60 text-black cursor-not-allowed',
      success: 'bg-green-500 hover:bg-green-600 text-white',
    },
  },
  benefits: {
    base: 'flex items-center gap-2 text-sm transition-colors',
    variants: {
      default: 'text-neutral-300',
      highlighted: 'text-brand-primary',
    },
  },
} as const;

export type NewsletterVariants = typeof newsletterVariants;
