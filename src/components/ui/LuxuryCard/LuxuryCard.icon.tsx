
// Note: Inline styles replaced with data attributes for better performance
// Use CSS custom properties in Tailwind for dynamic styling

/**
 * 🎴 LuxuryCard Icon Renderer - Vantage Lane 2.0
 * Pure icon rendering logic extracted from parts
 */

'use client';

import type { ReactNode } from 'react';

import { luxuryCardTokens } from '@/design-system/tokens/luxury-card';

import type { LuxuryCardHover, LuxuryCardIconSize, LuxuryCardIconEnhancement } from './LuxuryCard.types';
import { 
  getIconSizeClasses, 
  getIconEnhancementClasses, 
  getIconGlowBackgroundClasses,
  getIconShimmerClasses,
  getIconShimmerInnerClasses
} from './LuxuryCard.helpers';

interface IconRenderProps {
  icon?: ReactNode;
  glowColor?: string | undefined;
  shimmerColor?: string | undefined;
  iconSize?: LuxuryCardIconSize;
  iconEnhancement?: LuxuryCardIconEnhancement;
  hover: LuxuryCardHover;
  disabled: boolean;
}

/**
 * Renders icon with hover effects and shimmer animation
 *
 * @param props - Icon rendering configuration
 * @returns JSX for icon with all effects applied
 */
export function renderIcon({
  icon,
  glowColor,
  shimmerColor,
  iconSize = 'md',
  iconEnhancement = 'none',
  hover,
  disabled,
}: IconRenderProps): ReactNode {
  if (!icon) return null;

  // Generate dynamic classes based on props
  const iconSizeClasses = getIconSizeClasses(iconSize);
  const iconEnhancementClasses = getIconEnhancementClasses(iconEnhancement, !disabled);
  const iconGlowBackgroundClasses = getIconGlowBackgroundClasses(iconEnhancement);
  const iconShimmerClasses = getIconShimmerClasses(iconEnhancement);
  const iconShimmerInnerClasses = getIconShimmerInnerClasses();

  return (
    <div className="mb-6 group-hover:scale-110 transition-transform duration-300 flex justify-center">
      <div className="relative group-hover:scale-105 transition-all duration-300 overflow-visible">
        {typeof icon === 'string' ? (
          <span className="text-4xl">{icon}</span>
        ) : (
          <div
            className={`${iconSizeClasses} transition-all duration-[var(--luxury-duration-normal)] [&>svg]:h-full [&>svg]:w-full [&>svg]:stroke-[1.2]`}
            data-glow-color={glowColor || luxuryCardTokens.colors.goldGlow}
            onMouseEnter={(e) => {
              const target = e.currentTarget;
              target.style.color = glowColor || luxuryCardTokens.colors.shimmerPrimary;
              target.style.filter = 'drop-shadow(0 0 12px rgba(203,178,106,0.6)) drop-shadow(0 4px 8px rgba(0,0,0,0.3))';
            }}
            onMouseLeave={(e) => {
              const target = e.currentTarget;
              target.style.color = glowColor || luxuryCardTokens.colors.goldGlow;
              target.style.filter = 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))';
            }}
          >
            {icon}
          </div>
        )}

        {/* 🌟 Subtle glow effect - folosind luxury tokens */}
        <div 
          className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-[var(--luxury-glow-duration)] blur-xl"
          data-bg-glow={glowColor || luxuryCardTokens.colors.goldGlow}
        />

        {/* ✨ Icon Shimmer Effect (Vantage Lane Style) */}
        {iconShimmerClasses && (
          <div className={iconShimmerClasses}>
            <div 
              className={iconShimmerInnerClasses}
              style={{
                backgroundImage: `linear-gradient(90deg, transparent, ${shimmerColor || luxuryCardTokens.colors.shimmerPrimary}66, transparent)`
              }}
            />
          </div>
        )}

        {/* 🎯 Icon Shimmer pe TOATE cardurile cu hover shimmer - cu luxury tokens */}
        {hover === 'shimmer' && !disabled && (
          <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-0 transition-opacity duration-[var(--luxury-glow-duration)] group-hover:opacity-100">
            <div 
              className="absolute inset-0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-[var(--luxury-shimmer-duration)] ease-out"
              style={{
                width: luxuryCardTokens.effects.shimmer.width,
                height: '100%',
                backgroundImage: shimmerColor 
                  ? `linear-gradient(90deg, transparent, ${shimmerColor}66, transparent)`
                  : luxuryCardTokens.effects.shimmer.gradient.replace('0.2', '0.4'), // Mai intens pentru iconițe
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export type { IconRenderProps };
