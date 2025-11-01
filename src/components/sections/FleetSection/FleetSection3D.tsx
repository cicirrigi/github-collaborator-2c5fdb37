/**
 * 🎪 Fleet Section 3D - Vantage Lane 2.0
 *
 * Fleet section with 3D flip cards on hover.
 * Enhanced luxury experience with flip animations.
 */

'use client';

import type React from 'react';
import { memo } from 'react';

import { Container } from '@/components/layout/Container';
import { SectionOrchestrator } from '@/components/layout/SectionOrchestrator';
import { Text } from '@/components/ui';
import { designTokens } from '@/config/theme.config';
import { cn } from '@/lib/utils/cn';

import { FleetCard3D } from './FleetCard3D';
import { fleetConfig } from './FleetSection.config';
import type { FleetSectionProps, Vehicle } from './FleetSection.types';

/**
 * 🎨 Fleet Section 3D Main Component
 * Orchestrates header, 3D vehicle grid, and CTA
 */
const FleetSection3D = memo(function FleetSection3D({
  config = fleetConfig,
  className,
  hideTitle = false,
  maxVehicles,
  categories,
}: FleetSectionProps): React.JSX.Element {
  // Filter vehicles if categories specified
  const filteredVehicles = categories
    ? config.vehicles.filter(vehicle => categories.includes(vehicle.category))
    : config.vehicles;

  // Limit vehicles if maxVehicles specified
  const displayVehicles = maxVehicles ? filteredVehicles.slice(0, maxVehicles) : filteredVehicles;

  const handleVehicleSelect = (_vehicle: Vehicle) => {
    // TODO: Navigate to booking or vehicle details
  };

  const handleCTAClick = () => {
    config.cta?.action();
  };

  return (
    <SectionOrchestrator background='neutral' spacing='lg' {...(className && { className })}>
      <Container size='xl'>
        {/* Header */}
        {!hideTitle && (
          <div className='text-center mb-16'>
            <Text variant='h2' className='mb-4'>
              <span className='text-[var(--text-primary)]'>{config.title.primary}</span>{' '}
              <span className='text-[var(--brand-primary)]'>{config.title.accent}</span>
            </Text>

            {/* Golden divider */}
            <div
              className='w-24 h-1 mx-auto mb-6'
              style={{
                background:
                  'linear-gradient(to right, var(--brand-primary), var(--brand-secondary, #E5D485))',
              }}
            />

            <Text variant='lead' className='max-w-2xl mx-auto text-[var(--text-secondary)]'>
              {config.subtitle}
            </Text>

            {/* Flip instruction */}
            <div className='mt-4'>
              <span className='text-sm opacity-60 italic'>
                ✨ Hover over cards to see detailed information
              </span>
            </div>
          </div>
        )}

        {/* 3D Vehicle Grid */}
        <div
          className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3', config.cta && 'mb-16')}
          style={{ gap: designTokens.fleet.spacing.cardGap }}
        >
          {displayVehicles.map((vehicle, index) => (
            <div
              key={vehicle.id}
              className='transform-gpu'
              style={{
                // Stagger animation delay
                animationDelay: `${index * 0.1}s`,
              }}
            >
              <FleetCard3D vehicle={vehicle} onSelect={handleVehicleSelect} showPrice={true} />
            </div>
          ))}
        </div>

        {/* CTA Section */}
        {config.cta && (
          <div className='text-center'>
            <p className='mb-6' style={{ color: 'var(--text-secondary)' }}>
              {config.cta.description}
            </p>
            <button
              onClick={handleCTAClick}
              className={cn(
                'px-8 py-3 font-medium rounded-lg',
                'transition-all duration-300 hover:transform hover:scale-[1.05]',
                'focus:outline-none focus:ring-2 focus:ring-offset-2',
                'focus:ring-[var(--brand-primary)] focus:ring-offset-[var(--background)]'
              )}
              style={{
                backgroundColor: 'var(--brand-primary)',
                color: 'var(--background-dark)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = 'var(--brand-secondary, #E5D485)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'var(--brand-primary)';
              }}
            >
              {config.cta.text}
            </button>
          </div>
        )}

        {/* Golden separator line */}
        <div className='absolute inset-x-0 bottom-0 h-px pointer-events-none'>
          <div
            className='absolute inset-0'
            style={{
              background:
                'linear-gradient(to right, transparent, var(--brand-primary-40), transparent)',
            }}
          />
          <div
            className='absolute left-1/2 top-0 -translate-x-1/2 w-96 h-px blur-sm'
            style={{
              background:
                'linear-gradient(to right, transparent, var(--brand-secondary, #E5D485), transparent)',
              opacity: 0.6,
            }}
          />
        </div>
      </Container>
    </SectionOrchestrator>
  );
});

export { FleetSection3D };
