/**
 * 📋 FleetHeader Component - Fleet Section
 *
 * Header component for Fleet Section with title, separator, and instructions
 * Extracted from FleetSection3D for better component composition
 */

'use client';

import { motion } from 'framer-motion';
import type React from 'react';

import { Text } from '@/components/ui';

export interface FleetHeaderProps {
  /** Primary title text */
  primaryTitle: string;
  /** Accent title text */
  accentTitle: string;
  /** Subtitle text */
  subtitle: string;
  /** Whether to show flip instructions */
  showInstructions?: boolean;
}

/**
 * Fleet Header Component
 * Displays title, separator line, subtitle, and optional instructions
 */
export function FleetHeader({
  primaryTitle,
  accentTitle,
  subtitle,
  showInstructions = true,
}: FleetHeaderProps): React.JSX.Element {
  return (
    <div className='text-center mb-16'>
      {/* Main Title */}
      <h2
        className='mb-4 tracking-wide text-4xl md:text-5xl font-light text-center'
        style={{ color: 'var(--text-primary)' }}
      >
        <span style={{ color: 'var(--text-primary)' }}>{primaryTitle}</span>{' '}
        <span
          style={{
            color: 'var(--brand-primary)',
            textShadow: '0 0 25px rgba(203, 178, 106, 0.7), 0 0 35px rgba(203, 178, 106, 0.4)',
            filter: 'brightness(1.2)',
          }}
        >
          {accentTitle}
        </span>
      </h2>

      {/* Gold separator line */}
      <motion.div
        initial={{ opacity: 0, width: 0 }}
        whileInView={{ opacity: 1, width: '6rem' }}
        transition={{
          duration: 0.8,
          ease: [0.4, 0.0, 0.2, 1],
          delay: 0.3,
        }}
        viewport={{ once: true }}
        className='h-1 bg-gradient-to-r from-[var(--brand-primary)] to-[#E5D485] mx-auto mb-6'
      />

      {/* Subtitle */}
      <Text variant='lead' className='max-w-2xl mx-auto text-[var(--text-secondary)]'>
        {subtitle}
      </Text>

      {/* Flip instruction */}
      {showInstructions && (
        <div className='mt-6'>
          <span className='text-sm italic block'>
            <span
              className='inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium'
              style={{
                backgroundColor: 'var(--brand-primary-05)',
                color: 'var(--brand-primary)',
                border: '1px solid var(--brand-primary-20)',
              }}
            >
              <span className='hidden md:inline'>
                Hover over cards to see detailed information.
              </span>
              <span className='md:hidden'>Tap on cards to see detailed information.</span>
            </span>
          </span>
        </div>
      )}
    </div>
  );
}
