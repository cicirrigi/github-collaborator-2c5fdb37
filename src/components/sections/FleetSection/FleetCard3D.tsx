/**
 * 🎪 Fleet Card 3D - Vantage Lane 2.0
 *
 * Fleet card with 3D flip effect on hover.
 * Front: Vehicle details and image
 * Back: Additional info, features, and booking
 */

'use client';

import { motion } from 'framer-motion';
import type React from 'react';
import { memo } from 'react';

import { designTokens } from '@/config/theme.config';
import { cn } from '@/lib/utils/cn';

import { FleetCardContent } from './FleetCardContent';
import { FleetCardHeader } from './FleetCardHeader';
import { FleetCardImage } from './FleetCardImage';
import type { FleetCardProps, Vehicle } from './FleetSection.types';

/**
 * 🎨 Fleet Card Back Content
 */
const FleetCardBack = memo(function FleetCardBack({
  vehicle,
  onSelect,
}: {
  vehicle: Vehicle;
  onSelect?: (vehicle: Vehicle) => void;
}): React.JSX.Element {
  return (
    <div className='absolute inset-0 p-6 flex flex-col justify-between rounded-xl overflow-hidden'>
      {/* Theme-adaptive background */}
      <div
        className='absolute inset-0'
        style={{
          backgroundColor: 'var(--background-elevated)',
          backgroundImage: `linear-gradient(135deg, var(--background) 0%, var(--background-muted, var(--background-elevated)) 100%)`,
          backdropFilter: 'blur(10px)',
          border: '1px solid var(--border-subtle)',
        }}
      />

      {/* Content */}
      <div className='relative z-10' style={{ color: designTokens.fleet.colors.backText }}>
        {/* Header */}
        <div className='text-center mb-6'>
          <h3 className='text-2xl font-medium mb-2' style={{ color: 'var(--brand-primary)' }}>
            {vehicle.name}
          </h3>
          <div
            className='w-16 h-0.5 mx-auto mb-3'
            style={{ backgroundColor: 'var(--brand-primary)' }}
          />
          <p className='text-sm opacity-90'>
            {vehicle.category} • {vehicle.passengers} Passengers
          </p>
        </div>

        {/* Detailed Features */}
        <div className='space-y-4 mb-6'>
          <div>
            <h4 className='font-medium mb-2 text-sm opacity-80'>PREMIUM FEATURES</h4>
            <div className='grid grid-cols-2 gap-2 text-xs'>
              {vehicle.features.map((feature, index) => (
                <div key={index} className='flex items-center gap-2'>
                  <div
                    className='w-1 h-1 rounded-full'
                    style={{ backgroundColor: 'var(--brand-primary)' }}
                  />
                  <span className='opacity-90'>{feature.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Price & Availability */}
          <div className='border-t border-[var(--brand-primary-30)] pt-4'>
            <div className='flex justify-between items-center mb-2'>
              <span className='text-sm opacity-80'>PRICING</span>
              <span className='font-medium' style={{ color: 'var(--brand-primary)' }}>
                {vehicle.priceFrom}
              </span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-sm opacity-80'>STATUS</span>
              <span
                className='text-xs px-2 py-1 rounded-full'
                style={{
                  backgroundColor:
                    designTokens.fleet.statusColors[
                      vehicle.availability as keyof typeof designTokens.fleet.statusColors
                    ]?.bgOpacity || designTokens.fleet.statusColors.available.bgOpacity,
                  color:
                    designTokens.fleet.statusColors[
                      vehicle.availability as keyof typeof designTokens.fleet.statusColors
                    ]?.text || designTokens.fleet.statusColors.available.text,
                }}
              >
                {vehicle.availability}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <motion.button
        onClick={() => onSelect?.(vehicle)}
        className='relative z-10 w-full py-3 rounded-lg font-medium text-sm transition-all duration-300'
        style={{
          backgroundColor: 'var(--brand-primary)',
          color: 'var(--background-dark)',
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Book {vehicle.name}
      </motion.button>
    </div>
  );
});

/**
 * 🎪 Fleet Card 3D with Flip Effect
 */
export const FleetCard3D = memo(function FleetCard3D({
  vehicle,
  onSelect,
  className,
  showPrice = true,
}: FleetCardProps): React.JSX.Element {
  return (
    <div
      className={cn('group w-full [perspective:1000px] fleet-card-vertical', className)}
      role='article'
      aria-label={`${vehicle.name} vehicle details`}
      style={{
        minHeight: designTokens.fleet.dimensions.cardMinHeight,
        filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.1))',
      }}
    >
      {/* Flip Container */}
      <div
        className={cn(
          'relative h-full w-full transition-transform duration-700 ease-out',
          'transform-gpu [transform-style:preserve-3d]',
          'group-hover:[transform:rotateY(180deg)]'
        )}
        style={{
          borderRadius: designTokens.fleet.effects.borderRadius,
        }}
      >
        {/* Front Face */}
        <div
          className='absolute inset-0 [backface-visibility:hidden] rounded-xl overflow-hidden'
          style={{
            zIndex: 2,
            transform: 'rotateY(0deg)',
          }}
        >
          <motion.div
            initial={false}
            className={cn(
              'relative h-full w-full cursor-pointer flex flex-col',
              'transition-all duration-300'
            )}
            style={{
              backgroundColor: 'var(--background-elevated)',
              border: designTokens.fleet.effects.goldBorder,
              borderRadius: designTokens.fleet.effects.borderRadius,
              boxShadow: designTokens.fleet.effects.shadowElevated,
            }}
            whileHover={{
              boxShadow: `${designTokens.fleet.effects.shadowFloat}, ${designTokens.fleet.effects.goldGlow}`,
              transform: 'translateY(-8px)',
            }}
          >
            {/* Header with Badges */}
            <FleetCardHeader vehicle={vehicle} />

            {/* Vehicle Image */}
            <FleetCardImage vehicle={vehicle} />

            {/* Content */}
            <FleetCardContent
              vehicle={vehicle}
              {...(onSelect && { onSelect })}
              showPrice={showPrice}
            />
          </motion.div>
        </div>

        {/* Back Face */}
        <div
          className='absolute inset-0 [backface-visibility:hidden] rounded-xl overflow-hidden'
          style={{
            transform: 'rotateY(180deg)',
            backgroundColor: 'var(--background-elevated)',
            backdropFilter: 'blur(10px)',
            border: '1px solid var(--brand-primary-20)',
            boxShadow: '0 0 40px var(--brand-primary-10)',
          }}
        >
          <FleetCardBack vehicle={vehicle} {...(onSelect && { onSelect })} />
        </div>

        {/* Hover Glow Effect */}
        <div
          className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-xl'
          style={{
            background: `radial-gradient(circle at center, var(--brand-primary-05) 0%, transparent 70%)`,
            zIndex: -1,
          }}
        />
      </div>
    </div>
  );
});
