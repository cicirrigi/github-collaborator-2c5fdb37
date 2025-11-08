/**
 * 👆 FleetSwipeIndicator Component - Fleet Section
 *
 * Smart swipe indicator with auto-hide behavior
 * Extracted from FleetSection3D for better component composition
 */

'use client';

import type React from 'react';

import { SlideIndicator } from '@/components/ui/SlideIndicator';

import type { UseFleetAutoHideReturn } from '../hooks/useFleetAutoHide';

export interface FleetSwipeIndicatorProps {
  /** Text to display in indicator */
  text?: string;
  /** Auto-hide hook return values */
  autoHide: Pick<UseFleetAutoHideReturn, 'isVisible'>;
  /** Custom className */
  className?: string;
}

/**
 * Fleet Swipe Indicator Component
 * Displays swipe instruction with smart auto-hide behavior
 */
export function FleetSwipeIndicator({
  text = 'Swipe to see our fleet',
  autoHide,
  className,
}: FleetSwipeIndicatorProps): React.JSX.Element {
  return (
    <div
      className={`md:hidden flex justify-start pl-12 -mt-12 mb-8 ${className || ''}`}
      style={{
        opacity: autoHide.isVisible ? 1 : 0,
        scale: autoHide.isVisible ? 1 : 0.95,
        transition:
          'opacity 0.8s cubic-bezier(0.25, 0.8, 0.25, 1), scale 0.8s cubic-bezier(0.25, 0.8, 0.25, 1)',
      }}
    >
      <SlideIndicator text={text} />
    </div>
  );
}
