/**
 * 🧩 PremiumButton – Vantage Lane UI v3.0.0
 * Generated on 2025-10-20T00:29:37.491Z
 * Type: base
 */

import { cva } from 'class-variance-authority';

export const PremiumButtonVariants = cva(
  [
    'inline-flex items-center justify-center',
    'rounded-lg font-medium transition-all duration-300',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/50',
    'select-none',
  ].join(' '),
  {
    variants: {
      variant: {
        default: 'bg-white text-neutral-900 dark:bg-neutral-800 dark:text-white',
        primary: 'bg-[var(--brand-primary)] text-black hover:brightness-110 shadow-lg',
        secondary: 'bg-neutral-100 text-neutral-900 dark:bg-neutral-700 dark:text-white',
      },
      size: {
        sm: 'px-3 py-2 text-sm',
        md: 'px-4 py-2.5 text-base',
        lg: 'px-6 py-3 text-lg',
      },
      disabled: {
        true: 'opacity-50 pointer-events-none',
        false: '',
      },
      loading: {
        true: 'opacity-75 cursor-wait',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      disabled: false,
      loading: false,
    },
  }
);
