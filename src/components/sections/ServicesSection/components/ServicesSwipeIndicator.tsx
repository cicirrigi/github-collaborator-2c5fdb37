/**
 * 👆 ServicesSwipeIndicator Component - Services Section
 *
 * Smart swipe indicator with auto-hide behavior for services carousel
 * Extracted from ServicesSection for better component composition
 */

'use client';

import type React from 'react';

import { SlideIndicator } from '@/components/ui/SlideIndicator';

import type { UseServicesAutoHideReturn } from '../hooks/useServicesAutoHide';

export interface ServicesSwipeIndicatorProps {
  /** Text to display in indicator */
  text?: string;
  /** Auto-hide hook return values */
  autoHide: Pick<UseServicesAutoHideReturn, 'isVisible'>;
  /** Custom className */
  className?: string;
}

/**
 * Services Swipe Indicator Component
 * Displays swipe instruction with smart auto-hide behavior
 * Consistent styling with Fleet swipe indicator
 */
export function ServicesSwipeIndicator({
  text = 'Slide to explore',
  autoHide,
  className,
}: ServicesSwipeIndicatorProps): React.JSX.Element {
  return (
    <div
      className={`md:hidden flex justify-center mt-2 ${className || ''}`}
      style={{
        opacity: autoHide.isVisible ? 1 : 0,
        scale: autoHide.isVisible ? 1 : 0.95,
        marginLeft: '-1.5rem', // Doar o idee la stânga față de centru
        transition:
          'opacity 0.8s cubic-bezier(0.25, 0.8, 0.25, 1), scale 0.8s cubic-bezier(0.25, 0.8, 0.25, 1)',
      }}
    >
      <SlideIndicator text={text} />
    </div>
  );
}
