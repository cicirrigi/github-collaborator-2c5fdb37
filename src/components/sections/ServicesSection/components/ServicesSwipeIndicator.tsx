/**
 * 👆 ServicesSwipeIndicator Component - Services Section
 *
 * Smart swipe indicator with auto-hide behavior for services carousel
 * Extracted from ServicesSection for better component composition
 */

'use client';

import { motion } from 'framer-motion';
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
 * Displays swipe instruction with smart auto-hide behavior and first card offset
 */
export function ServicesSwipeIndicator({
  text = 'Slide to explore',
  autoHide,
  className,
}: ServicesSwipeIndicatorProps): React.JSX.Element {
  return (
    <div
      className={`flex items-center justify-center mt-4 md:hidden ${className || ''}`}
      style={{
        opacity: autoHide.isVisible ? 1 : 0,
        scale: autoHide.isVisible ? 1 : 0.95,
        marginLeft: '-3rem', // Aproape centrul perfect
        transition:
          'opacity 0.8s cubic-bezier(0.25, 0.8, 0.25, 1), scale 0.8s cubic-bezier(0.25, 0.8, 0.25, 1)',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        viewport={{ once: true }}
      >
        <SlideIndicator text={text} />
      </motion.div>
    </div>
  );
}
