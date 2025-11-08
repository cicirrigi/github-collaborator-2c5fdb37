/**
 * ✍️ Text Variants - Vantage Lane Design System
 * Typography styles for headings, body text, and labels
 */

export const textVariants = {
  variants: {
    h1: 'text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100',
    h2: 'text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100',
    h3: 'text-2xl md:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100',
    h4: 'text-xl md:text-2xl font-semibold text-neutral-900 dark:text-neutral-100',
    h5: 'text-lg md:text-xl font-semibold text-neutral-900 dark:text-neutral-100',
    h6: 'text-base md:text-lg font-semibold text-neutral-900 dark:text-neutral-100',
    body: 'text-base leading-relaxed text-neutral-700 dark:text-neutral-300',
    lead: 'text-lg md:text-xl leading-relaxed text-neutral-700 dark:text-neutral-300',
    small: 'text-sm text-neutral-600 dark:text-neutral-400',
    muted: 'text-neutral-500 dark:text-neutral-500',
  },
} as const;

export type TextVariants = typeof textVariants;
