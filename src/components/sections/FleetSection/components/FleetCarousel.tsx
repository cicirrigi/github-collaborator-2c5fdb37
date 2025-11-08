/**
 * 🎠 FleetCarousel Component - Fleet Section
 *
 * Responsive vehicle carousel/grid component
 * Extracted from FleetSection3D for better separation of concerns
 */

'use client';

import type React from 'react';
import { forwardRef } from 'react';

import { cn } from '@/lib/utils/cn';

import { FleetCard3D } from '../FleetCard3D';
import type { Vehicle } from '../FleetSection.types';

export interface FleetCarouselProps {
  /** Vehicles to display */
  vehicles: readonly Vehicle[];
  /** Callback when vehicle is selected */
  onVehicleSelect?: (vehicle: Vehicle) => void;
  /** Whether to show CTA spacing */
  showCTASpacing?: boolean;
  /** Custom className */
  className?: string;
}

/**
 * Fleet Carousel Component
 * Responsive grid/carousel for vehicle display
 */
export const FleetCarousel = forwardRef<HTMLDivElement, FleetCarouselProps>(function FleetCarousel(
  { vehicles, onVehicleSelect, showCTASpacing, className },
  ref
) {
  const handleVehicleSelect = (vehicle: Vehicle) => {
    onVehicleSelect?.(vehicle);
  };

  return (
    <div
      ref={ref}
      className={cn(
        // Mobile: horizontal carousel cu scroll
        'flex overflow-x-auto gap-4 snap-x snap-mandatory scrollbar-hide',
        // Desktop: grid layout
        'md:grid md:overflow-visible md:pb-0 md:snap-none md:grid-cols-2 lg:grid-cols-3',
        showCTASpacing && 'mb-16',
        className
      )}
    >
      {vehicles.map((vehicle: Vehicle, index: number) => (
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
  );
});
