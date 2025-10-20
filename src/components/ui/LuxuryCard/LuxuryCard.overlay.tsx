/**
 * 🎴 LuxuryCard Overlay Renderer - Vantage Lane 2.0
 * Pure overlay rendering logic extracted from parts
 */

'use client';

import type { ReactNode } from 'react';

import { luxuryCardTokens } from '@/design-system/tokens/luxury-card';

import type { LuxuryCardHover } from './LuxuryCard.types';

interface OverlayRenderProps {
  hover: LuxuryCardHover;
  disabled: boolean;
  cardEnhancement?: 'none' | 'golden-glow' | 'full-shimmer' | 'vantage-premium';
  glowColor?: string | undefined;
  shimmerColor?: string | undefined;
}

/**
 * Renders hover overlay effects (glow + shimmer sweep)
 *
 * @param props - Overlay rendering configuration
 * @returns JSX for overlay effects or null if disabled
 */
export function renderShimmerOverlay({ 
  hover, 
  disabled, 
  cardEnhancement = 'none',
  glowColor,
  shimmerColor 
}: OverlayRenderProps): ReactNode {
  if (hover === 'none' || disabled) return null;

  return (
    <>
      {/* 🌟 Golden glow on hover - folosind luxury tokens */}
      <div 
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-[var(--luxury-glow-duration)]"
        style={{
          background: glowColor 
            ? `linear-gradient(135deg, ${glowColor}0D, transparent)`
            : luxuryCardTokens.effects.glow.gradient,
        }}
      />
      
      {/* ⚡ Card shimmer sweep effect - folosind luxury tokens */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-[var(--luxury-glow-duration)]">
        <div 
          className="absolute inset-0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform ease-out"
          style={{
            width: luxuryCardTokens.effects.shimmer.width,
            height: '100%',
            transitionDuration: luxuryCardTokens.effects.shimmer.duration,
            backgroundImage: shimmerColor 
              ? `linear-gradient(90deg, transparent, ${shimmerColor}33, transparent)`
              : luxuryCardTokens.effects.shimmer.gradient,
          }}
        />
      </div>
    </>
  );
}

export type { OverlayRenderProps };
