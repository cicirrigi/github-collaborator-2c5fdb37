/**
 * 👆 TapIndicator Component - Elegant Tap Animation
 *
 * Subtle tap indicator for interactive cards.
 * Perfect for 3D flip cards on mobile to show they're clickable.
 */

'use client';

import { motion } from 'framer-motion';
import type React from 'react';

export interface TapIndicatorProps {
  /** Position className override */
  className?: string;
  /** Show only on mobile (default: true) */
  mobileOnly?: boolean;
}

export function TapIndicator({
  className = 'absolute bottom-6 right-3',
  mobileOnly = true,
}: TapIndicatorProps): React.JSX.Element {
  return (
    <motion.div
      className={`
        ${className}
        ${mobileOnly ? 'md:hidden' : ''}
        pointer-events-none select-none z-10 -translate-y-1
      `}
      style={{
        color: 'var(--brand-primary)',
        opacity: 0.8,
        willChange: 'transform',
      }}
      // Fără animație pe container - doar ripple-ul să fie animat
    >
      {/* Punct cu ripple și text "Tap" */}
      <div className='relative flex flex-col items-center justify-center gap-1'>
        {/* Text "Tap" mic deasupra */}
        <span
          className='text-xs font-medium tracking-wide'
          style={{ color: 'var(--brand-primary)' }}
        >
          Tap
        </span>

        {/* Punct static cu ripple */}
        <div className='relative w-3 h-3 flex items-center justify-center'>
          {/* Punct plin central - static */}
          <div
            className='w-3 h-3 bg-current rounded-full relative z-10'
            style={{ backgroundColor: 'var(--brand-primary)' }}
          />

          {/* Ripple adevărat - se extinde și dispare */}
          <motion.div
            className='absolute w-3 h-3 border rounded-full'
            style={{ borderColor: 'var(--brand-primary)', borderWidth: '1.5px' }}
            animate={{
              scale: [1, 2.5],
              opacity: [0.6, 0],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: 'easeOut',
              repeatDelay: 0.2,
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}
