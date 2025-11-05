/**
 * 🃏 Card Component - Vantage Lane 2.0
 *
 * Flexible container component with variants.
 * Perfect for features, services, testimonials, etc.
 */

import type React from 'react';

import { cn } from '@/lib/utils/cn';

type CardVariant = 'default' | 'elevated' | 'outline' | 'ghost';

export interface CardProps {
  readonly variant?: CardVariant;
  readonly className?: string;
  readonly children: React.ReactNode;
  readonly padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  readonly hover?: boolean;
}

/**
 * 📦 Universal card component with theme variants
 */
export function Card({
  variant = 'default',
  className,
  children,
  padding = 'md',
  hover = false,
}: CardProps): React.JSX.Element {
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
  };

  // Card variant styles
  const cardVariants = {
    default:
      'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm',
    elevated: 'bg-white dark:bg-neutral-900 shadow-lg border-0',
    outline: 'bg-transparent border-2 border-neutral-300 dark:border-neutral-600',
    ghost: 'bg-transparent border-0 shadow-none',
  };

  return (
    <div
      className={cn(
        // Base styles
        'rounded-lg transition-colors',
        // Variant styles
        cardVariants[variant],
        // Padding
        paddingClasses[padding],
        // Hover effect
        hover && 'transition-all duration-300 hover:scale-[1.02] hover:shadow-lg',
        // Custom className
        className
      )}
    >
      {children}
    </div>
  );
}

export default Card;
