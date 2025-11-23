/**
 * 🎯 Slide Indicator - Vantage Lane 2.0
 *
 * Reusable component for slide/swipe indicators with animated arrow
 * Used for "Slide to explore" and "Swipe to see our fleet"
 */

'use client';

import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import type React from 'react';

export interface SlideIndicatorProps {
  readonly text?: string;
  readonly className?: string;
  readonly showText?: boolean;
}

export const SlideIndicator = function SlideIndicator({
  text,
  className = '',
  showText = true,
}: SlideIndicatorProps): React.JSX.Element {
  return (
    <div
      className={`inline-flex items-center text-sm font-medium gap-2 px-3 py-1.5 rounded-lg ${className}`}
      style={{
        color: 'var(--brand-primary)',
        backgroundColor: 'rgba(203, 178, 106, 0.05)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        border: '0.5px solid rgba(203, 178, 106, 0.15)',
        boxShadow: '0 2px 8px rgba(203, 178, 106, 0.08)',
      }}
    >
      {showText && text && <span>{text}</span>}
      <motion.div
        animate={{ x: [0, 4, 0] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <ChevronRight size={18} strokeWidth={2} />
      </motion.div>
    </div>
  );
};
