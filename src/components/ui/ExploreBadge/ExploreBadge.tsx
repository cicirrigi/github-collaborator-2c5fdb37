/**
 * 🏷️ ExploreBadge Component - Vantage Lane 2.0
 * Elegant interactive badge pentru explore actions
 */

'use client';

import { ArrowRight, Eye } from 'lucide-react';
import { forwardRef } from 'react';

import { cn } from '@/lib/utils/cn';
import { exploreBadgeTokens } from './ExploreBadge.tokens';
import type { ExploreBadgeComponent, ExploreBadgeProps } from './ExploreBadge.types';

/**
 * Elegant explore badge cu hover animations
 * - Translucent by default, gold on hover
 * - Eye icon animation scale(1.1x)
 * - Mobile "Tap to view" text
 * - Design tokens orchestrated
 */
export const ExploreBadge: ExploreBadgeComponent = forwardRef<HTMLDivElement, ExploreBadgeProps>(
  function ExploreBadge(
    {
      size = 'md',
      variant = 'translucent',
      hover = 'gold',
      children = 'Explore',
      showArrow = true,
      mobileText, // Va folosi default-ul din tokens dacă nu e specificat
      disabled = false,
      className,
      ...rest
    },
    ref
  ) {
    const tokens = exploreBadgeTokens;
    const sizeTokens = tokens.sizes[size];

    return (
      <div className='flex flex-col items-center' ref={ref} {...rest}>
        {/* Main Badge */}
        <div
          className={cn(
            // Base styles cu design tokens
            'inline-flex items-center justify-center',
            'transition-all duration-200 ease-out',
            'cursor-pointer select-none',
            'group-hover:scale-105',
            // Disabled state
            disabled && 'opacity-50 pointer-events-none cursor-not-allowed',
            className
          )}
          style={
            {
              // Dynamic styling cu tokens
              padding: sizeTokens.padding,
              fontSize: sizeTokens.fontSize,
              height: sizeTokens.height,
              gap: sizeTokens.gap,
              borderRadius: tokens.borderRadius,
              fontWeight: tokens.typography.fontWeight,
              letterSpacing: tokens.typography.letterSpacing,

              // Variant styling
              ...(variant === 'translucent' && {
                backgroundColor: tokens.colors.translucent.background,
                backdropFilter: `blur(${tokens.colors.translucent.backdropBlur})`,
                border: `1px solid ${tokens.colors.translucent.border}`,
                color: tokens.colors.translucent.text,
              }),

              // Hover effects cu CSS custom properties
              '--hover-bg': hover === 'gold' ? tokens.colors.hover.gold : 'transparent',
              '--hover-shadow': hover === 'gold' ? tokens.colors.hover.goldShadow : 'none',
            } as React.CSSProperties
          }
          onMouseEnter={e => {
            if (!disabled && hover === 'gold') {
              const target = e.currentTarget;
              target.style.backgroundColor = tokens.colors.solid.background;
              target.style.color = tokens.colors.solid.text;
              target.style.boxShadow = tokens.colors.hover.goldShadow;
            }
          }}
          onMouseLeave={e => {
            if (!disabled && hover === 'gold') {
              const target = e.currentTarget;
              target.style.backgroundColor = tokens.colors.translucent.background;
              target.style.color = tokens.colors.translucent.text;
              target.style.boxShadow = 'none';
            }
          }}
          onFocus={e => {
            // Reset la focus pentru a evita persistarea stării
            const target = e.currentTarget;
            target.style.backgroundColor = tokens.colors.translucent.background;
            target.style.color = tokens.colors.translucent.text;
            target.style.boxShadow = 'none';
          }}
          onBlur={e => {
            // Reset la blur pentru a evita persistarea stării
            const target = e.currentTarget;
            target.style.backgroundColor = tokens.colors.translucent.background;
            target.style.color = tokens.colors.translucent.text;
            target.style.boxShadow = 'none';
          }}
          onTouchEnd={e => {
            // Reset la touch end pe mobil pentru a evita persistarea stării
            const target = e.currentTarget;
            setTimeout(() => {
              target.style.backgroundColor = tokens.colors.translucent.background;
              target.style.color = tokens.colors.translucent.text;
              target.style.boxShadow = 'none';
            }, 100); // Mic delay pentru a permite vizualizarea hover-ului
          }}
          onTouchCancel={e => {
            // Reset la touch cancel pe mobil
            const target = e.currentTarget;
            target.style.backgroundColor = tokens.colors.translucent.background;
            target.style.color = tokens.colors.translucent.text;
            target.style.boxShadow = 'none';
          }}
        >
          {/* Badge Text - ascuns pe mobile */}
          <span className='whitespace-nowrap hidden md:inline'>{children}</span>

          {/* Icons: Eye pe mobil, Arrow pe desktop */}
          {showArrow && (
            <>
              {/* Eye Icon - doar pe mobil */}
              <Eye
                className={cn(
                  'md:hidden transition-transform duration-200 ease-out',
                  'group-hover:scale-110'
                )}
                style={{
                  width: `calc(${sizeTokens.fontSize} * 1.1)`,
                  height: `calc(${sizeTokens.fontSize} * 1.1)`,
                  strokeWidth: 2,
                }}
              />
              {/* Arrow Icon - doar pe desktop cu animație permanentă */}
              <ArrowRight
                className={cn(
                  'hidden md:inline-block transition-colors',
                  'text-[var(--brand-primary)]', // Auriu by default
                  'group-hover:text-[var(--background-dark)]' // Albă pe hover
                )}
                style={{
                  width: `calc(${sizeTokens.fontSize} * 1.1)`,
                  height: `calc(${sizeTokens.fontSize} * 1.1)`,
                  strokeWidth: 2,
                  transitionDuration: tokens.animations.duration,
                  animation: `${tokens.animations.arrow.name} ${tokens.animations.arrow.duration} ${tokens.animations.arrow.easing} ${tokens.animations.arrow.iteration}`,
                }}
              />
            </>
          )}
        </div>

        {/* Mobile "Tap to view" text - centrat sub badge */}
        <div
          className={cn(
            'block md:hidden text-center transition-opacity duration-200',
            'opacity-70' // Vizibil pe mobile, nu pe hover
          )}
          style={{
            fontSize: tokens.mobile.tapText.fontSize,
            marginTop: tokens.mobile.tapText.marginTop,
            color: 'var(--text-secondary)',
          }}
        >
          {mobileText || tokens.mobile.tapText.text}
        </div>
      </div>
    );
  }
);

export type {
  ExploreBadgeHover,
  ExploreBadgeProps,
  ExploreBadgeSize,
  ExploreBadgeVariant,
} from './ExploreBadge.types';
