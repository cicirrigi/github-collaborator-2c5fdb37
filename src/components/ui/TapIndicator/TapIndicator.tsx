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
      {/* Hand suprapus cu punct cu ripple */}
      <div className='relative flex items-center justify-center'>
        {/* Punct static cu ripple */}
        <div className='relative w-3 h-3 flex items-center justify-center translate-y-1 -translate-x-1'>
          {/* Hand Icon suprapus - ajustat poziția */}
          <motion.div
            className='absolute top-1 -left-1 transform -translate-x-1/2 z-20'
            animate={{
              y: [0, -3, 0],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: [0.4, 0, 0.6, 1],
              repeatDelay: 0.4,
            }}
            style={{ willChange: 'transform' }}
          >
            <span className='text-xl'>👆</span>
          </motion.div>
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
