/**
 * 📋 FleetHeader Component - Fleet Section
 *
 * Header component for Fleet Section with title, separator, and instructions
 * Extracted from FleetSection3D for better component composition
 */

'use client';

import { motion } from 'framer-motion';
import type React from 'react';
import { memo } from 'react';

import { typography } from '@/design-system/tokens/typography';
import { cn } from '@/lib/utils/cn';

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
    <div className='text-center mb-6'>
      {/* Main Title */}
      <h2
        className='mb-4 tracking-wide text-4xl md:text-5xl font-light text-center'
        style={{ color: 'var(--text-primary)' }}
      >
        <span style={{ color: 'var(--text-primary)' }}>{primaryTitle}</span>{' '}
        <span
          style={{
            color: 'var(--brand-primary)',
            textShadow: typography.effects.goldGlow.textShadow,
            filter: typography.effects.goldGlow.filter,
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

      {/* Flip instruction - glass effect - positioned above first card */}
      {showInstructions && (
        <div className='mt-6 flex justify-start md:justify-center'>
          <span
            className='inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium ml-2 md:ml-0'
            style={{
              backgroundColor: 'rgba(203, 178, 106, 0.05)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: '0.5px solid rgba(203, 178, 106, 0.15)',
              boxShadow: '0 2px 8px rgba(203, 178, 106, 0.08)',
              color: 'var(--brand-primary)',
            }}
          >
            <span className='hidden md:inline'>Hover over cards to see detailed information.</span>
            <span className='md:hidden'>Tap on cards to see detailed information.</span>
          </span>
        </div>
      )}
    </div>
  );
}
