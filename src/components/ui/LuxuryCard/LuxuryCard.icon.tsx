// Note: Inline styles replaced with data attributes for better performance
// Use CSS custom properties in Tailwind for dynamic styling

/**
 * 🎴 LuxuryCard Icon Renderer - Vantage Lane 2.0
 * Pure icon rendering logic extracted from parts
 */

'use client';

import type { ReactNode } from 'react';

import { luxuryCardTokens } from '@/design-system/tokens/luxury-card';

import {
  // getIconEnhancementClasses,
  // getIconGlowBackgroundClasses,
  getIconShimmerClasses,
  getIconShimmerInnerClasses,
  getIconSizeClasses,
} from './LuxuryCard.helpers';
import type {
  LuxuryCardHover,
  LuxuryCardIconEnhancement,
  LuxuryCardIconSize,
} from './LuxuryCard.types';

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
  // const iconEnhancementClasses = getIconEnhancementClasses(iconEnhancement, !disabled);
  // const iconGlowBackgroundClasses = getIconGlowBackgroundClasses(iconEnhancement);
  const iconShimmerClasses = getIconShimmerClasses(iconEnhancement);
  const iconShimmerInnerClasses = getIconShimmerInnerClasses();

  return (
    <div className='mb-6 flex justify-center transition-transform duration-300 group-hover:scale-110'>
      <div className='relative overflow-visible transition-all duration-300 group-hover:scale-105'>
        {typeof icon === 'string' ? (
          <span className='text-4xl'>{icon}</span>
        ) : (
          <div
            className={`${iconSizeClasses} duration-[var(--luxury-duration-normal)] transition-all [&>svg]:h-full [&>svg]:w-full [&>svg]:stroke-[1.2]`}
            data-glow-color={glowColor || luxuryCardTokens.colors.goldGlow}
            onMouseEnter={e => {
              const target = e.currentTarget;
              target.style.color = glowColor || luxuryCardTokens.colors.shimmerPrimary;
              target.style.filter =
                'drop-shadow(0 0 12px rgba(203,178,106,0.6)) drop-shadow(0 4px 8px rgba(0,0,0,0.3))';
            }}
            onMouseLeave={e => {
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
          className='duration-[var(--luxury-glow-duration)] absolute inset-0 rounded-full opacity-0 blur-xl transition-opacity group-hover:opacity-100'
          data-bg-glow={glowColor || luxuryCardTokens.colors.goldGlow}
        />

        {/* ✨ Icon Shimmer Effect (Vantage Lane Style) */}
        {iconShimmerClasses && (
          <div className={iconShimmerClasses}>
            <div
              className={iconShimmerInnerClasses}
              style={{
                backgroundImage: `linear-gradient(90deg, transparent, ${shimmerColor || luxuryCardTokens.colors.shimmerPrimary}66, transparent)`,
              }}
            />
          </div>
        )}

        {/* 🎯 Icon Shimmer pe TOATE cardurile cu hover shimmer - ORCHESTRATED */}
        {hover === 'shimmer' && !disabled && (
          <div className='pointer-events-none absolute inset-0 overflow-hidden opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
            <div
              className='absolute inset-0 -translate-x-full -skew-x-12 transform transition-transform ease-out group-hover:translate-x-full'
              style={{
                width: '200%',
                height: '100%',
                transitionDuration: '1200ms',
                backgroundImage: shimmerColor
                  ? `linear-gradient(90deg, transparent, ${shimmerColor}66, transparent)`
                  : 'linear-gradient(90deg, transparent, rgba(229, 212, 133, 0.4), transparent)',
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export type { IconRenderProps };
