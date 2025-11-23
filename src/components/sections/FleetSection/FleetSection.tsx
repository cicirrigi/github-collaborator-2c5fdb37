/**
 * 🚗 Fleet Section - Vantage Lane 2.0
 *
 * Main orchestrator component for fleet showcase.
 * Uses SectionOrchestrator pattern with design tokens.
 */

'use client';

import { motion } from 'framer-motion';
import type React from 'react';
import { memo } from 'react';

import { typography } from '@/design-system/tokens/typography';
import { animations } from '@/config/animations.config';
import { Container } from '@/components/layout/Container';
import { SectionOrchestrator } from '@/components/layout/SectionOrchestrator';
import { Text } from '@/components/ui';
import { designTokens } from '@/config/theme.config';
import { cn } from '@/lib/utils/cn';

import { FleetCardRefactored as FleetCard } from './FleetCard.refactored';
import { fleetConfig } from './FleetSection.config';
import type { FleetSectionProps, Vehicle } from './FleetSection.types';

/**
 * 🎨 Fleet Section Main Component
 * Orchestrates header, vehicle grid, and CTA
 */
const FleetSection = memo(function FleetSection({
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
            <h2
              className={`${typography.classes.sectionTitle} text-center mb-4`}
              style={{ color: 'var(--text-primary)' }}
            >
              <span
                style={{
                  color: 'var(--text-primary)',
                  textShadow:
                    '0 0 18px rgba(220, 220, 255, 0.5), 0 0 30px rgba(180, 180, 255, 0.3)',
                  filter: 'brightness(1.18)',
                }}
              >
                {config.title.primary}
              </span>{' '}
              <span
                style={{
                  color: 'var(--brand-primary)',
                  textShadow: typography.effects.goldGlow.textShadow,
                  filter: typography.effects.goldGlow.filter,
                }}
              >
                {config.title.accent}
              </span>
            </h2>

            {/* Golden divider */}
            <div
              className='w-24 h-1 mx-auto mb-6'
              style={{
                background: 'linear-gradient(to right, var(--brand-primary), var(--brand-accent))',
              }}
            />

            <Text variant='lead' className='max-w-2xl mx-auto text-[var(--text-secondary)]'>
              {config.subtitle}
            </Text>
          </div>
        )}

        {/* Vehicle Grid - ORCHESTRATED (stânga → dreapta) */}
        <motion.div
          className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3', config.cta && 'mb-16')}
          style={{ gap: designTokens.fleet.spacing.cardGap }}
          variants={animations.staggerContainer}
          initial='hidden'
          whileInView='visible'
          viewport={animations.viewport}
        >
          {displayVehicles.map(vehicle => (
            <FleetCard
              key={vehicle.id}
              vehicle={vehicle}
              onSelect={handleVehicleSelect}
              showPrice={true}
            />
          ))}
        </motion.div>

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
                e.currentTarget.style.backgroundColor = 'var(--brand-accent)';
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
                'linear-gradient(to right, transparent, var(--brand-accent), transparent)',
              opacity: 0.6,
            }}
          />
        </div>
      </Container>
    </SectionOrchestrator>
  );
});

export { FleetSection };
