/**
 * 🎴 LuxuryCard Component - Vantage Lane 2.0
 * Enterprise-grade reusable luxury card with shimmer effects
 *
 * @enterprise Modular architecture following enterprise patterns:
 * - Separation of concerns (helpers, parts, main component)
 * - SSR compatible with browser checks
 * - Comprehensive JSDoc documentation
 * - Scalable naming pattern (LuxuryX components)
 */

'use client';

import { forwardRef } from 'react';

import { cn } from '@/lib/utils';

import { generateCustomProperties } from './LuxuryCard.helpers';
import { renderContent, renderShimmerOverlay } from './LuxuryCard.parts';
import type {
  LuxuryCardComponent,
  LuxuryCardHover,
  LuxuryCardProps,
  LuxuryCardSize,
  LuxuryCardVariant,
} from './LuxuryCard.types';
import { luxuryCardStyles } from './LuxuryCard.variants';

/**
 * Enterprise LuxuryCard component with shimmer sweep effects
 *
 * @description Polymorphic card component supporting both simple props API
 * and flexible children API. Includes comprehensive hover effects, shimmer
 * animations, and enterprise-grade architecture.
 *
 * @example
 * ```tsx
 * // Simple Props API
 * <LuxuryCard
 *   variant="shimmer"
 *   icon={<CarFront />}
 *   title="Premium Fleet"
 *   description="Luxury vehicles available 24/7"
 *   href="/fleet"
 * />
 *
 * // Flexible Children API
 * <LuxuryCard variant="shimmer" as={Link} href="/fleet">
 *   <div className="custom-layout">
 *     <CarFront className="w-20 h-20" />
 *     <h3>Custom Title</h3>
 *   </div>
 * </LuxuryCard>
 * ```
 *
 * @param props - LuxuryCard configuration props
 * @returns Polymorphic card component with shimmer effects
 */
const LuxuryCard = forwardRef<HTMLElement, LuxuryCardProps>(
  (
    {
      // Component behavior
      as: Component = 'div',
      variant = 'shimmer',
      size = 'md',
      hover = 'shimmer',
      disabled = false,

      // Customization
      glowColor,
      shimmerColor,
      iconSize = 'md',
      iconEnhancement = 'none',
      cardEnhancement = 'none',
      titleGolden = false,
      className,

      // Content (simple API)
      icon,
      title,
      description,
      footer,
      bottomBadge,

      // Flexible API
      children,

      // Rest props (for polymorphic behavior)
      ...rest
    },
    ref
  ) => {
    /**
     * Generate CSS custom properties for dynamic theming
     * Enterprise pattern: Centralized property generation
     */
    const customProps = generateCustomProperties(glowColor, shimmerColor);

    /**
     * Build component classes using enterprise design system
     * Pattern: Composition over inheritance with disabled state handling
     */
    const cardClasses = cn(
      'group', // ✅ Enterprise: .group on main container for optimal hover performance
      luxuryCardStyles.base,
      luxuryCardStyles.variants[variant],
      luxuryCardStyles.sizes[size],
      hover !== 'none' && luxuryCardStyles.hover[hover].container,
      disabled && 'pointer-events-none cursor-not-allowed opacity-50',
      className
    );

    /**
     * Enterprise Component Render
     * Clean separation: overlays → content → structure
     */
    return (
      <Component ref={ref as never} className={cardClasses} style={customProps} {...rest}>
        {/* Hover Effects Layer */}
        {renderShimmerOverlay({
          hover,
          disabled,
          cardEnhancement,
          glowColor,
          shimmerColor,
        })}

        {/* Content Layer */}
        <div className='relative z-10'>
          {renderContent({
            children,
            icon,
            title,
            description,
            footer,
            bottomBadge,
            glowColor,
            shimmerColor,
            iconSize,
            iconEnhancement,
            titleGolden,
            hover,
            disabled,
          })}
        </div>
      </Component>
    );
  }
) as LuxuryCardComponent;

LuxuryCard.displayName = 'LuxuryCard';

export { LuxuryCard };
export type { LuxuryCardHover, LuxuryCardProps, LuxuryCardSize, LuxuryCardVariant };
