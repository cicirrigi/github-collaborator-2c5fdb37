'use client';

import { useBookingState } from '@/hooks/useBookingState';
import { vehicleCategories } from '@/hooks/useBookingState/vehicle.data';
import { Car, Crown, Users } from 'lucide-react';
import Image from 'next/image';

/**
 * 🚗 VEHICLE SUMMARY CARD - Step 3 Component
 *
 * Displays selected vehicle from Step 2:
 * - Category and model selection
 * - Vehicle image and key features
 * - Passenger capacity and category info
 *
 * Uses design tokens and Zustand store
 * Max 200 lines, modular architecture
 */

const VEHICLE_IMAGES: Record<string, string> = {
  'mercedes-s-class': '/images/vehicles/mercedes-s-class.jpg',
  'bmw-7-series': '/images/vehicles/bmw-7-series.jpg',
  'audi-a8': '/images/vehicles/audi-a8.jpg',
  'mercedes-e-class': '/images/vehicles/mercedes-e-class.jpg',
  'bmw-5-series': '/images/vehicles/bmw-5-series.jpg',
  'audi-a6': '/images/vehicles/audi-a6.jpg',
  'rolls-royce-phantom': '/images/vehicles/rolls-royce-phantom.jpg',
  'bentley-mulsanne': '/images/vehicles/bentley-mulsanne.jpg',
  'mercedes-maybach': '/images/vehicles/mercedes-maybach.jpg',
  'range-rover-vogue': '/images/vehicles/range-rover-vogue.jpg',
  'bmw-x7': '/images/vehicles/bmw-x7.jpg',
  'mercedes-v-class': '/images/vehicles/mercedes-v-class.jpg',
  'range-rover-sport': '/images/vehicles/range-rover-sport.jpg',
};

const CATEGORY_ICONS = {
  executive: Car,
  luxury: Crown,
  suv: Car,
  mpv: Users,
} as const;

export function VehicleSummaryCard() {
  const { tripConfiguration } = useBookingState();
  const { selectedVehicle } = tripConfiguration;

  if (!selectedVehicle?.category) {
    return (
      <div className='vl-card-flex'>
        <div className='text-center py-6'>
          <Car className='w-8 h-8 text-neutral-500 mx-auto mb-2' />
          <p className='text-neutral-400 text-sm'>No vehicle selected</p>
        </div>
      </div>
    );
  }

  const categoryData = vehicleCategories.find(cat => cat.id === selectedVehicle.category?.id);
  const categoryKey = selectedVehicle.category?.id as keyof typeof CATEGORY_ICONS;
  const IconComponent = CATEGORY_ICONS[categoryKey] || Car;
  const vehicleImage = selectedVehicle.model ? VEHICLE_IMAGES[selectedVehicle.model.id] : null;

  return (
    <div className='vl-card-flex'>
      {/* Header */}
      <div className='flex items-center gap-3 mb-5'>
        <div className='flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-600/20 backdrop-blur-sm border border-blue-500/20'>
          <IconComponent className='w-5 h-5 text-blue-400' />
        </div>
        <div>
          <h3 className='text-lg font-semibold tracking-wide text-white'>Selected Vehicle</h3>
          <p className='text-blue-200/50 text-xs'>Your chosen transportation</p>
        </div>
      </div>

      {/* Content */}
      <div className='vl-card-inner'>
        <div className='space-y-4'>
          {/* Vehicle Image */}
          {vehicleImage && selectedVehicle.model && (
            <div className='relative w-full h-32 rounded-xl overflow-hidden bg-gradient-to-br from-neutral-800/50 to-neutral-900/50'>
              <Image
                src={vehicleImage}
                alt={selectedVehicle.model.name}
                fill
                className='object-cover'
                sizes='(max-width: 768px) 100vw, 50vw'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent' />
            </div>
          )}

          {/* Vehicle Details */}
          <div className='space-y-3'>
            {/* Category */}
            <div className='flex items-center justify-between'>
              <span className='text-neutral-300 text-sm'>Category</span>
              <span className='text-white font-medium capitalize'>
                {categoryData?.name || String(selectedVehicle.category)}
              </span>
            </div>

            {/* Model */}
            {selectedVehicle.model && (
              <div className='flex items-center justify-between'>
                <span className='text-neutral-300 text-sm'>Model</span>
                <span className='text-white font-medium'>{selectedVehicle.model.name}</span>
              </div>
            )}

            {/* Capacity */}
            {selectedVehicle.model?.capacity && (
              <div className='flex items-center justify-between'>
                <span className='text-neutral-300 text-sm'>Capacity</span>
                <span className='text-white font-medium'>
                  {selectedVehicle.model.capacity.passengers} passengers
                </span>
              </div>
            )}

            {/* Key Features */}
            {selectedVehicle.model?.features && (
              <div className='space-y-2'>
                <span className='text-neutral-300 text-sm'>Key Features</span>
                <div className='flex flex-wrap gap-2'>
                  {selectedVehicle.model.features.slice(0, 3).map(feature => (
                    <span
                      key={feature}
                      className='px-2 py-1 rounded-md bg-blue-500/10 text-blue-300 text-xs border border-blue-500/20'
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Category Description */}
            {categoryData && (
              <div className='pt-2 border-t border-white/10'>
                <p className='text-neutral-300 text-sm leading-relaxed'>
                  {categoryData.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
