/**
 * 🎴 LuxuryCard Content Renderer - Vantage Lane 2.0
 * Pure content rendering logic extracted from parts
 */

'use client';

import type { ReactNode } from 'react';

import { luxuryCardTokens } from '@/design-system/tokens/luxury-card';

import { renderIcon } from './LuxuryCard.icon';
import type {
  LuxuryCardHover,
  LuxuryCardIconEnhancement,
  LuxuryCardIconSize,
} from './LuxuryCard.types';

interface ContentRenderProps {
  children?: ReactNode;
  icon?: ReactNode;
  title?: string | undefined;
  description?: string | undefined;
  footer?: ReactNode;
  glowColor?: string | undefined;
  shimmerColor?: string | undefined;
  iconSize?: LuxuryCardIconSize;
  iconEnhancement?: LuxuryCardIconEnhancement;
  titleGolden?: boolean;
  hover: LuxuryCardHover;
  disabled: boolean;
}

/**
 * Renders card content using either simple API (props) or flexible API (children)
 *
 * @param props - Content rendering configuration
 * @returns JSX for card content
 */
export function renderContent({
  children,
  icon,
  title,
  description,
  footer,
  glowColor,
  shimmerColor,
  iconSize,
  iconEnhancement,
  titleGolden: _titleGolden,
  hover,
  disabled,
}: ContentRenderProps): ReactNode {
  // Flexible API: use children if provided
  if (children) {
    return children;
  }

  // Simple API: render from props
  return (
    <>
      {renderIcon({
        icon,
        glowColor,
        shimmerColor,
        iconSize: iconSize || 'md',
        iconEnhancement: iconEnhancement || 'none',
        hover,
        disabled,
      })}
      {title && (
        <h3
          className='duration-[var(--luxury-glow-duration)] relative z-10 mb-3 text-xl font-medium text-white transition-colors'
          style={
            {
              '--hover-color': glowColor || luxuryCardTokens.colors.goldGlow,
            } as React.CSSProperties & { '--hover-color': string }
          }
          onMouseEnter={e => {
            const customStyle = e.currentTarget.style as CSSStyleDeclaration & {
              '--hover-color': string;
            };
            e.currentTarget.style.color = customStyle['--hover-color'];
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = 'white';
          }}
        >
          {title}
        </h3>
      )}
      {description && <p className='text-sm leading-relaxed text-neutral-300'>{description}</p>}
      {footer && (
        <div className='mt-4 border-t border-neutral-200 pt-4 dark:border-white/10'>{footer}</div>
      )}
    </>
  );
}

export type { ContentRenderProps };
