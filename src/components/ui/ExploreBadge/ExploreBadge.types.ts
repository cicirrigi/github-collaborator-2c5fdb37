/**
 * 🏷️ ExploreBadge Types - Vantage Lane 2.0
 * Modular badge component pentru interactive elements
 */

import type { ComponentPropsWithRef, ReactNode } from 'react';

/** Badge sizes */
export type ExploreBadgeSize = 'sm' | 'md' | 'lg';

/** Badge variants */
export type ExploreBadgeVariant = 'translucent' | 'solid' | 'outline';

/** Badge hover states */
export type ExploreBadgeHover = 'gold' | 'glow' | 'none';

/** Props pentru ExploreBadge component */
export interface ExploreBadgeProps extends ComponentPropsWithRef<'div'> {
  /** Badge size */
  readonly size?: ExploreBadgeSize;

  /** Badge variant */
  readonly variant?: ExploreBadgeVariant;

  /** Hover effect type */
  readonly hover?: ExploreBadgeHover;

  /** Badge text content */
  readonly children?: ReactNode;

  /** Show arrow icon */
  readonly showArrow?: boolean;

  /** Mobile text (doar pe mobile) */
  readonly mobileText?: string;

  /** Disable all interactions */
  readonly disabled?: boolean;

  /** Custom styling */
  readonly className?: string;
}

export type ExploreBadgeComponent = React.ForwardRefExoticComponent<
  ExploreBadgeProps & React.RefAttributes<HTMLDivElement>
>;
