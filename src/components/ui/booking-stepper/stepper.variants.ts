/**
 * 🎨 BookingStepper Variants
 * Type-safe variants cu design tokens (zero hardcoding)
 */

import { cva, type VariantProps } from 'class-variance-authority';

// Step state variants
export const stepVariants = cva(
  // Base classes (using design tokens)
  'relative flex items-center justify-center rounded-full font-semibold transition-all cursor-pointer',
  {
    variants: {
      state: {
        pending: [
          'bg-neutral-200 dark:bg-neutral-700',
          'text-neutral-500 dark:text-neutral-400',
          'border-2 border-neutral-300 dark:border-neutral-600',
          'hover:bg-neutral-300 dark:hover:bg-neutral-600',
        ],
        current: [
          'bg-brand-primary text-black',
          'border-2 border-brand-primary',
          'shadow-lg shadow-brand-primary/25',
        ],
        completed: [
          'bg-brand-primary text-black',
          'border-2 border-brand-primary',
          'hover:bg-brand-primary/90',
        ],
        disabled: [
          'bg-neutral-100 dark:bg-neutral-800',
          'text-neutral-400 dark:text-neutral-600',
          'border-2 border-neutral-200 dark:border-neutral-700',
          'cursor-not-allowed opacity-50',
        ],
      },
      size: {
        sm: 'w-8 h-8 text-xs',
        md: 'w-12 h-12 text-sm',
        lg: 'w-16 h-16 text-base',
      },
      interactive: {
        true: 'hover:scale-105 active:scale-95',
        false: '',
      },
    },
    defaultVariants: {
      state: 'pending',
      size: 'md',
      interactive: true,
    },
  }
);

// Connector line variants
export const connectorVariants = cva(
  'relative h-0.5 transition-all duration-500 ease-in-out overflow-hidden rounded-full',
  {
    variants: {
      state: {
        pending: 'bg-neutral-300 dark:bg-neutral-600',
        active: 'bg-neutral-300 dark:bg-neutral-600',
        completed: 'bg-brand-primary',
      },
      filling: {
        none: '',
        active:
          'before:absolute before:inset-0 before:bg-brand-primary before:origin-left before:scale-x-0 before:animate-[fillProgress_1s_ease-out_forwards]',
        completed: 'bg-brand-primary',
      },
    },
    defaultVariants: {
      state: 'pending',
      filling: 'none',
    },
  }
);

// Container variants
export const stepperContainerVariants = cva('flex items-center w-full', {
  variants: {
    orientation: {
      horizontal: 'flex-row justify-between items-center w-full',
      vertical: 'flex-col space-y-8 items-center',
    },
    spacing: {
      compact: '',
      normal: '',
      spacious: '',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
    spacing: 'normal',
  },
});

// Label variants
export const stepLabelVariants = cva(
  'absolute top-full mt-2 text-center text-xs font-medium min-w-max px-2',
  {
    variants: {
      state: {
        pending: 'text-neutral-500 dark:text-neutral-400',
        current: 'text-brand-primary font-semibold',
        completed: 'text-brand-primary',
        disabled: 'text-neutral-400 dark:text-neutral-600',
      },
      position: {
        bottom: 'top-full mt-2',
        top: 'bottom-full mb-2',
      },
    },
    defaultVariants: {
      state: 'pending',
      position: 'bottom',
    },
  }
);

// Export types
export type StepVariants = VariantProps<typeof stepVariants>;
export type ConnectorVariants = VariantProps<typeof connectorVariants>;
export type StepperContainerVariants = VariantProps<typeof stepperContainerVariants>;
export type StepLabelVariants = VariantProps<typeof stepLabelVariants>;
