/**
 * 🏷️ Badge Component - Vantage Lane 2.0
 *
 * Small status indicators and labels.
 * Perfect for tags, status, categories, etc.
 */

import type React from 'react';

import { themeConfig } from '@/config/theme.config';
import { cn } from '@/lib/utils/cn';

type BadgeVariant = keyof typeof themeConfig.components.badge.variants;
type BadgeSize = keyof typeof themeConfig.components.badge.sizes;

export interface BadgeProps {
  readonly variant?: BadgeVariant;
  readonly size?: BadgeSize;
  readonly className?: string;
  readonly children: React.ReactNode;
}

/**
 * 🎯 Universal badge component with theme variants
 */
export function Badge({
  variant = 'default',
  size = 'md',
  className,
  children,
}: BadgeProps): React.JSX.Element {
  return (
    <span
      className={cn(
        // Base styles from theme config
        themeConfig.components.badge.base,
        // Variant styles from theme config
        themeConfig.components.badge.variants[variant],
        // Size styles from theme config
        themeConfig.components.badge.sizes[size],
        // Custom className
        className
      )}
    >
      {children}
    </span>
  );
}

export default Badge;
