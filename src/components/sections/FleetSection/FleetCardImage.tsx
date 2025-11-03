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
      style={{ height: designTokens.fleet.dimensions.cardImageHeight }}
    >
      <motion.div
        whileHover={{ scale: designTokens.fleet.effects.imageScale }}
        transition={{
          duration: designTokens.fleet.effects.transition.duration,
          ease: designTokens.fleet.effects.transition.ease,
        }}
        className='w-full h-full'
      >
        <Image
          src={vehicle.image}
          alt={`${vehicle.name} - ${vehicle.category} vehicle`}
          fill
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          priority={false}
          quality={85}
          className='object-cover'
          placeholder='blur'
          blurDataURL='data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJceliyjqTzSlT54b6bk+h0R//2Q=='
        />
      </motion.div>

      {/* Gradient Overlay */}
      <div
        className='absolute inset-0 pointer-events-none'
        style={{
          background: 'linear-gradient(to top, var(--background-elevated) 0%, transparent 50%)',
        }}
      />
    </div>
  );
});
