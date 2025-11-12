/**
 * 🎴 LuxuryCard Overlay Renderer - Vantage Lane 2.0
 * Pure overlay rendering logic extracted from parts
 */

'use client';

import type { ReactNode } from 'react';

// import { luxuryCardTokens } from '@/design-system/tokens/luxury-card';

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
  cardEnhancement: _cardEnhancement = 'none',
  glowColor,
  shimmerColor,
}: OverlayRenderProps): ReactNode {
  if (hover === 'none' || disabled) return null;

  return (
    <>
      {/* 🌟 Golden glow on hover - ORCHESTRATED */}
      <div
        className='absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100'
        style={{
          background: glowColor
            ? `linear-gradient(135deg, ${glowColor}1A, transparent)`
            : 'linear-gradient(135deg, rgba(203, 178, 106, 0.1), transparent)',
        }}
      />

      {/* ⚡ Card shimmer sweep effect - ORCHESTRATED */}
      <div className='pointer-events-none absolute inset-0 overflow-hidden opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
        <div
          className='absolute inset-0 -translate-x-full -skew-x-12 transform transition-transform ease-out group-hover:translate-x-full'
          style={{
            width: '200%',
            height: '100%',
            transitionDuration: '1000ms',
            backgroundImage: shimmerColor
              ? `linear-gradient(90deg, transparent, ${shimmerColor}4D, transparent)`
              : 'linear-gradient(90deg, transparent, rgba(203, 178, 106, 0.3), transparent)',
          }}
        />
      </div>
    </>
  );
}

export type { OverlayRenderProps };
