/**
 * 🎪 Fleet Section 3D - Vantage Lane 2.0
 *
 * Fleet section with 3D flip cards on hover.
 * Enhanced luxury experience with flip animations.
 */

'use client';

import { motion } from 'framer-motion';
import type React from 'react';
import { memo, useEffect, useRef, useState } from 'react';

import { Container } from '@/components/layout/Container';
import { SectionOrchestrator } from '@/components/layout/SectionOrchestrator';
import { Text } from '@/components/ui';
import { SlideIndicator } from '@/components/ui/SlideIndicator';
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
  customConfig,
  className,
  hideTitle = false,
  maxVehicles,
  categories,
}: FleetSectionProps): React.JSX.Element {
  const config = customConfig ? { ...fleetConfig, ...customConfig } : fleetConfig;

  // Smart auto-hide/show logic pentru fleet swipe indicator
  const fleetCarouselRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const carousel = fleetCarouselRef.current;
    if (!carousel) return;

    // Smart timer system
    let autoHideTimer: NodeJS.Timeout;
    let reappearTimer: NodeJS.Timeout;

    // Auto-hide după 6 secunde
    const startAutoHide = () => {
      autoHideTimer = setTimeout(() => {
        setIsVisible(false);

        // Dacă nu a făcut scroll, reapare după încă 6 secunde
        if (!hasScrolled) {
          reappearTimer = setTimeout(() => {
            setIsVisible(true);
            // Și se ascunde din nou după 6 secunde
            startAutoHide();
          }, 6000);
        }
      }, 6000);
    };

    startAutoHide();

    // Simple scroll listener - marchează că user-ul a făcut scroll
    const handleScroll = () => {
      // Marchează că user-ul a făcut scroll
      setHasScrolled(true);

      // Clear toate timer-ele - nu mai reapare
      clearTimeout(autoHideTimer);
      clearTimeout(reappearTimer);

      // Ascunde indicatorul permanent
      setIsVisible(false);
    };

    carousel.addEventListener('scroll', handleScroll, { passive: true, once: true });

    return () => {
      clearTimeout(autoHideTimer);
      clearTimeout(reappearTimer);
      carousel.removeEventListener('scroll', handleScroll);
    };
  }, [hasScrolled]);

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
              className='mb-4 tracking-wide text-4xl md:text-5xl font-light text-center'
              style={{ color: 'var(--text-primary)' }}
            >
              <span style={{ color: 'var(--text-primary)' }}>{config.title.primary}</span>{' '}
              <span
                style={{
                  color: 'var(--brand-primary)',
                  textShadow:
                    '0 0 25px rgba(203, 178, 106, 0.7), 0 0 35px rgba(203, 178, 106, 0.4)',
                  filter: 'brightness(1.2)',
                }}
              >
                {config.title.accent}
              </span>
            </h2>

            {/* Gold separator line - identical to Newsletter */}
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

            <Text variant='lead' className='max-w-2xl mx-auto text-[var(--text-secondary)]'>
              {config.subtitle}
            </Text>

            {/* Flip instruction */}
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
          </div>
        )}

        {/* Vehicle Grid/Carousel */}
        <div
          ref={fleetCarouselRef}
          className={cn(
            // Mobile: horizontal carousel cu scroll
            'flex overflow-x-auto gap-4 snap-x snap-mandatory scrollbar-hide',
            // Desktop: grid layout ca înainte
            'md:grid md:overflow-visible md:pb-0 md:snap-none md:grid-cols-2 lg:grid-cols-3',
            config.cta && 'mb-16'
          )}
          style={{
            gap: designTokens.fleet.spacing.cardGap,
          }}
        >
          {displayVehicles.map((vehicle, index) => (
            <div
              key={vehicle.id}
              className={cn(
                'transform-gpu',
                // Mobile: fixed width pentru carousel + snap
                'flex-shrink-0 w-[280px] snap-center',
                // Desktop: auto width pentru grid
                'md:w-auto md:flex-shrink'
              )}
              style={{
                // Stagger animation delay
                animationDelay: `${index * 0.1}s`,
              }}
            >
              <div className='h-full w-full'>
                <FleetCard3D vehicle={vehicle} onSelect={handleVehicleSelect} showPrice={true} />
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Swipe indicator - doar pe mobil sub fleet cu smart auto-hide */}
        <div
          className='md:hidden flex justify-start pl-12 -mt-12 mb-8'
          style={{
            opacity: isVisible ? 1 : 0,
            scale: isVisible ? 1 : 0.95,
            transition:
              'opacity 0.8s cubic-bezier(0.25, 0.8, 0.25, 1), scale 0.8s cubic-bezier(0.25, 0.8, 0.25, 1)',
          }}
        >
          <SlideIndicator text='Swipe to see our fleet' />
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
