/**
 * 🔘 Button Variants - Vantage Lane Design System
 * Pre-configured button styles and sizes
 */

export const buttonVariants = {
  variants: {
    primary: 'bg-brand-primary hover:bg-brand-primary/90 text-black',
    secondary:
      'bg-neutral-200 hover:bg-neutral-300 text-neutral-900 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-100',
    outline:
      'border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-black',
    ghost: 'text-brand-primary hover:bg-brand-primary/10',
    destructive: 'bg-red-500 hover:bg-red-600 text-white',
  },
  sizes: {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl',
  },
  base: `inline-flex items-center justify-center font-semibold rounded-lg transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary/50`,
} as const;

export type ButtonVariants = typeof buttonVariants;
