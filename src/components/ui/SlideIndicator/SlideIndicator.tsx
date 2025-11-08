/**
 * 🎯 Slide Indicator - Vantage Lane 2.0
 *
 * Reusable component for slide/swipe indicators with animated arrow
 * Used for "Slide to explore" and "Swipe to see our fleet"
 */

'use client';

import { motion } from 'framer-motion';
import type React from 'react';

export interface SlideIndicatorProps {
  readonly text: string;
  readonly className?: string;
}

export const SlideIndicator = function SlideIndicator({
  text,
  className = '',
}: SlideIndicatorProps): React.JSX.Element {
  return (
    <div
      className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium gap-2 ${className}`}
      style={{
        backgroundColor: 'var(--brand-primary-05)',
        color: 'var(--brand-primary)',
        border: '1px solid var(--brand-primary-20)',
      }}
    >
      <span>{text}</span>
      <motion.div
        animate={{ x: [0, 4, 0] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        →
      </motion.div>
    </div>
  );
};
