/**
 * 🖼️ Fleet Card Image - Vantage Lane 2.0
 *
 * Optimized vehicle image with hover animations using Framer Motion.
 * Clean subcomponent with design tokens and accessibility.
 */

'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import type React from 'react';
import { memo } from 'react';

import { designTokens } from '@/config/theme.config';

import type { Vehicle } from './FleetSection.types';

export interface FleetCardImageProps {
  readonly vehicle: Vehicle;
  readonly className?: string;
}

/**
 * 🎨 Vehicle image with motion animations
 */
export const FleetCardImage = memo(function FleetCardImage({
  vehicle,
  className,
}: FleetCardImageProps): React.JSX.Element {
  return (
    <div
      className={`relative overflow-hidden flex-shrink-0 ${className || ''}`}
      style={{
        height: designTokens.fleet.dimensions.cardImageHeight,
        minHeight: designTokens.fleet.dimensions.cardImageHeight,
      }}
    >
      <motion.div
        initial={false}
        whileHover={{ scale: designTokens.fleet.effects.imageScale }}
        transition={{
          duration: designTokens.fleet.effects.transition.duration,
          ease: designTokens.fleet.effects.transition.ease,
        }}
        className='w-full h-full will-change-transform bg-white rounded-lg'
      >
        <Image
          src={vehicle.image}
          alt={`${vehicle.name} - ${vehicle.category} vehicle`}
          fill
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          priority={true}
          quality={85}
          loading='eager'
          className='object-cover'
          style={{
            opacity: 1,
            transition: 'none',
          }}
        />
      </motion.div>

      {/* Gradient Overlay */}
      <div
        className='absolute inset-0 pointer-events-none'
        style={{
          background: 'linear-gradient(to top, var(--background-elevated) 0%, transparent 50%)',
        }}
      />

      {/* Popular Badge - Premium minimal design positioned above separator */}
      {vehicle.popular && (
        <div className='absolute bottom-3 right-4 z-10'>
          <span
            className='px-3 py-1 text-xs font-medium rounded-full backdrop-blur-sm'
            style={{
              background:
                'linear-gradient(135deg, rgba(203, 178, 106, 0.9), rgba(203, 178, 106, 0.7))',
              color: 'var(--background-dark)',
              border: '1px solid rgba(203, 178, 106, 0.3)',
              boxShadow:
                '0 2px 8px rgba(203, 178, 106, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            }}
          >
            ★ Popular
          </span>
        </div>
      )}

      {/* Golden separator line */}
      <div
        className='absolute bottom-0 left-0 right-0'
        style={{
          height: '1px',
          background: `linear-gradient(to right, transparent, var(--brand-primary), transparent)`,
          opacity: 0.6,
        }}
      />
    </div>
  );
});
