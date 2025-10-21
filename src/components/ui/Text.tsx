/**
 * ✍️ Text Component - Vantage Lane 2.0
 *
 * Typography system with consistent sizing and styling.
 * Connected to theme.config.ts design tokens.
 */

import React from 'react';

import { themeConfig } from '@/config/theme.config';
import { cn } from '@/lib/utils/cn';

type TextVariant = keyof typeof themeConfig.components.text.variants;
type TextElement = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';

export interface TextProps {
  readonly variant?: TextVariant;
  readonly as?: TextElement;
  readonly className?: string;
  readonly children: React.ReactNode;
}

/**
 * 📝 Universal text component with semantic HTML elements
 */
export function Text({ variant = 'body', as, className, children }: TextProps): React.JSX.Element {
  // Auto-determine element based on variant if not specified
  const defaultElement: TextElement =
    variant === 'h1'
      ? 'h1'
      : variant === 'h2'
        ? 'h2'
        : variant === 'h3'
          ? 'h3'
          : variant === 'h4'
            ? 'h4'
            : variant === 'h5'
              ? 'h5'
              : variant === 'h6'
                ? 'h6'
                : variant === 'body' || variant === 'lead'
                  ? 'p'
                  : 'span';

  const Element = as || defaultElement;

  return React.createElement(
    Element,
    {
      className: cn(
        // Variant styles from theme config
        themeConfig.components.text.variants[variant],
        // Custom className
        className
      ),
    },
    children
  );
}

export default Text;
