/**
 * 🃏 Card Component - Vantage Lane 2.0
 *
 * Flexible container component with variants.
 * Perfect for features, services, testimonials, etc.
 */

import type React from 'react';

import { cn } from '@/lib/utils/cn';
import { cardTokens } from './Card.tokens';

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
  // Use design tokens instead of magic numbers
  const paddingClasses = cardTokens.padding;

  // Use design tokens for variant styles
  const getVariantClasses = (variant: CardVariant) => {
    const variantConfig = cardTokens.variants[variant];
    return `${variantConfig.background} ${variantConfig.border} ${variantConfig.shadow}`;
  };

  return (
    <div
      className={cn(
        // Base styles
        'rounded-lg transition-colors',
        // Variant styles
        getVariantClasses(variant),
        // Padding
        paddingClasses[padding],
        // Hover effect
        hover &&
          `${cardTokens.hover.transition} ${cardTokens.hover.scale} ${cardTokens.hover.shadow}`,
        // Custom className
        className
      )}
    >
      {children}
    </div>
  );
}

export default Card;
