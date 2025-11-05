/**
 * 🎨 BiColorText Component
 * Reusable bi-color text component with design tokens
 */

'use client';

import { createElement } from 'react';
import { cn } from '@/lib/utils/cn';
import { biColorTextTokens } from './BiColorText.tokens';
import type { BiColorTextProps } from './BiColorText.types';

/**
 * BiColorText - Displays text with two different colors
 * Perfect for titles like "Join The Vantage Circle" where first part is primary color and second is accent
 * 
 * @example
 * <BiColorText 
 *   firstText="Join The Vantage" 
 *   secondText="Circle"
 *   size="4xl"
 *   weight="semibold"
 *   as="h2"
 * />
 */
export function BiColorText({
  firstText,
  secondText,
  size = 'lg',
  weight = 'medium',
  align = 'left',
  className,
  primaryColor,
  accentColor,
  as = 'span',
}: BiColorTextProps) {
  const tokens = biColorTextTokens;
  const sizeTokens = tokens.sizes[size];
  const weightValue = tokens.weights[weight];
  const alignValue = tokens.alignments[align];

  return createElement(
    as,
    {
      className: cn(
        // Base styling
        'inline-block',
        tokens.typography.letterSpacing,
        className
      ),
      style: {
        fontSize: sizeTokens.fontSize,
        lineHeight: sizeTokens.lineHeight,
        fontWeight: weightValue,
        textAlign: alignValue,
        fontFeatureSettings: tokens.typography.fontFeatureSettings,
      },
    },
    <>
      {/* First text - primary color with enhanced silver glow */}
      <span
        style={{
          color: primaryColor || tokens.colors.primary,
          textShadow: '0 0 18px rgba(220, 220, 255, 0.5), 0 0 30px rgba(180, 180, 255, 0.3)',
          filter: 'brightness(1.18)',
        }}
      >
        {firstText}
      </span>
      
      {/* Spacing between words */}
      <span style={{ marginLeft: tokens.spacing.gap }}> </span>
      
      {/* Second text - accent color with enhanced gold glow */}
      <span
        style={{
          color: accentColor || tokens.colors.accent,
          textShadow: '0 0 22px rgba(203, 178, 106, 0.6), 0 0 32px rgba(203, 178, 106, 0.35)',
          filter: 'brightness(1.18)',
        }}
      >
        {secondText}
      </span>
    </>
  );
}

export type { BiColorTextProps, BiColorTextSize, BiColorTextWeight, BiColorTextAlign } from './BiColorText.types';
