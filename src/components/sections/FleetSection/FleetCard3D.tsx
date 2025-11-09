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
import { memo, useState } from 'react';

import { designTokens } from '@/config/theme.config';
import { cn } from '@/lib/utils/cn';

import { FleetCardContent } from './FleetCardContent';
import { FleetCardHeader } from './FleetCardHeader';
import { FleetCardImage } from './FleetCardImage';
import { TapIndicator } from '@/components/ui/TapIndicator';
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
      {/* Diagonal gradient background - matches front */}
      <div
        className={cn(
          'absolute inset-0',
          'bg-gradient-to-br from-white/95 via-neutral-50/90 to-white/95',
          'dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-900'
        )}
        style={{
          backdropFilter: 'blur(10px)',
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
          <div className='relative pt-4'>
            {/* Golden separator line - identical to front card */}
            <div
              className='absolute top-0 left-0 right-0'
              style={{
                height: '1px',
                background: `linear-gradient(to right, transparent, var(--brand-primary), transparent)`,
                opacity: 0.6,
              }}
            />
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
  // State pentru mobile flip (click to flip)
  const [isFlippedMobile, setIsFlippedMobile] = useState(false);

  const handleMobileClick = () => {
    setIsFlippedMobile(prev => !prev);
  };

  return (
    <div
      className={cn('group w-full h-full [perspective:1000px] fleet-card-vertical', className)}
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
          // Desktop: hover to flip
          'md:group-hover:[transform:rotateY(180deg)]',
          // Mobile: click to flip
          isFlippedMobile && 'md:![transform:rotateY(0deg)] [transform:rotateY(180deg)]'
        )}
        style={{
          borderRadius: designTokens.fleet.effects.borderRadius,
        }}
        onClick={handleMobileClick}
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
              'transition-all duration-300',
              // 3D effect like Services cards
              'bg-gradient-to-br from-white/95 via-neutral-50/90 to-white/95',
              'dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-900',
              'border-2',
              'border-t-neutral-700/40 border-l-neutral-700/40',
              'border-b-neutral-800 border-r-neutral-800',
              'dark:border-t-white/5 dark:border-l-white/5',
              'dark:border-b-black dark:border-r-black',
              'backdrop-blur-xl'
            )}
            style={{
              borderRadius: designTokens.fleet.effects.borderRadius,
              boxShadow: designTokens.fleet.effects.shadowElevated,
            }}
            whileHover={{
              boxShadow: `${designTokens.fleet.effects.shadowFloat}, ${designTokens.fleet.effects.goldGlow}`,
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

            {/* Tap Indicator - doar ripple, fără mână - dreapta sus */}
            <TapIndicator className='absolute top-3 right-3' />
          </motion.div>
        </div>

        {/* Back Face */}
        <div
          className={cn(
            'absolute inset-0 [backface-visibility:hidden] rounded-xl overflow-hidden',
            // 3D effect like Services cards
            'bg-gradient-to-br from-white/95 via-neutral-50/90 to-white/95',
            'dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-900',
            'border-2',
            'border-t-neutral-700/40 border-l-neutral-700/40',
            'border-b-neutral-800 border-r-neutral-800',
            'dark:border-t-white/5 dark:border-l-white/5',
            'dark:border-b-black dark:border-r-black',
            'backdrop-blur-xl'
          )}
          style={{
            transform: 'rotateY(180deg)',
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
