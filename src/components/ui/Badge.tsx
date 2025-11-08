/**
 * 🏷️ Badge Component - Vantage Lane 2.0
 *
 * Small status indicators and labels.
 * Perfect for tags, status, categories, etc.
 */

import type React from 'react';

// Badge styles directly defined (no theme config dependency)
import { cn } from '@/lib/utils/cn';

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning';
type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps {
  readonly variant?: BadgeVariant;
  readonly size?: BadgeSize;
  readonly className?: string;
  readonly children: React.ReactNode;
}

// Badge variant styles
const badgeVariants = {
  default: 'bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100',
  secondary: 'bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-200',
  destructive: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  outline:
    'border border-neutral-300 bg-transparent text-neutral-900 dark:border-neutral-600 dark:text-neutral-100',
  success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
};

const badgeSizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
};

/**
 * 🎯 Universal badge component with theme variants
 */
export function Badge({
  variant = 'default',
  size = 'md',
  className,
  children,
}: BadgeProps): React.JSX.Element {
  return (
    <span
      className={cn(
        // Base styles
        'inline-flex items-center rounded-full font-medium transition-colors',
        // Variant styles
        badgeVariants[variant],
        // Size styles
        badgeSizes[size],
        // Custom className
        className
      )}
    >
      {children}
    </span>
  );
}

export default Badge;
