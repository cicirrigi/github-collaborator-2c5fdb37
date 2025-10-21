/**
 * 🃏 Card Component - Vantage Lane 2.0
 *
 * Flexible container component with variants.
 * Perfect for features, services, testimonials, etc.
 */

import type React from 'react';

import { themeConfig } from '@/config/theme.config';
import { cn } from '@/lib/utils/cn';

type CardVariant = keyof typeof themeConfig.components.card.variants;

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

  return (
    <div
      className={cn(
        // Base styles from theme config
        themeConfig.components.card.base,
        // Variant styles from theme config
        themeConfig.components.card.variants[variant],
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
