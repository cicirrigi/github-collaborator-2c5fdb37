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

import { FleetCarousel } from './components/FleetCarousel';
import { FleetHeader } from './components/FleetHeader';
import { FleetSwipeIndicator } from './components/FleetSwipeIndicator';
import { fleetConfig } from './FleetSection.config';
import type { FleetSectionProps, Vehicle } from './FleetSection.types';
import { useFleetAutoHide } from './hooks/useFleetAutoHide';

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

  // Use extracted auto-hide hook
  const autoHide = useFleetAutoHide();

  // Filter vehicles if categories specified
  const filteredVehicles = categories
    ? config.vehicles.filter((vehicle: Vehicle) => categories.includes(vehicle.category))
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
          <FleetHeader
            primaryTitle={config.title.primary}
            accentTitle={config.title.accent}
            subtitle={config.subtitle}
            showInstructions={true}
          />
        )}

        {/* Vehicle Carousel */}
        <FleetCarousel
          ref={autoHide.carouselRef}
          vehicles={displayVehicles}
          onVehicleSelect={handleVehicleSelect}
          showCTASpacing={!!config.cta}
        />

        {/* Mobile Swipe Indicator */}
        <FleetSwipeIndicator autoHide={autoHide} />

        {/* CTA Section */}
        {config.cta && (
          <div className='text-center'>
            <p className='mb-6' style={{ color: 'var(--text-secondary)' }}>
              {config.cta.description}
            </p>
            <button
              onClick={handleCTAClick}
              className='px-8 py-3 rounded-lg font-medium transition-all duration-200 bg-[var(--brand-primary)] text-[var(--brand-primary-contrast)] hover:bg-[var(--brand-primary-dark)] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:ring-offset-2'
            >
              {config.cta.text}
            </button>
          </div>
        )}
      </Container>
    </SectionOrchestrator>
  );
});

export { FleetSection3D };
