/**
 * 🚗 Preferred Vehicle Widget - Compact
 */

'use client';

import Image from 'next/image';
import { DashboardWidget } from './DashboardWidget';

interface PreferredVehicleWidgetProps {
  readonly vehicleModel?: string;
  readonly preferredChauffeur?: string;
}

const VEHICLE_MODELS = {
  'S-Class': {
    name: 'Mercedes S-Class',
    image: '/images/vehicles-webp/S class Left side angle.webp',
  },
  'E-Class': {
    name: 'Mercedes E-Class',
    image: '/images/vehicles-webp/E class Left side angle.webp',
  },
  '5-Series': {
    name: 'BMW 5 Series',
    image: '/images/vehicles-webp/5 Series Left side angle.webp',
  },
  'V-Class': {
    name: 'Mercedes V-Class',
    image: '/images/vehicles-webp/V class Left side angle.webp',
  },
  'Range Rover': {
    name: 'Range Rover',
    image: '/images/vehicles-webp/Range Rover Left side angle.webp',
  },
} as const;

export function PreferredVehicleWidget({ vehicleModel = 'S-Class' }: PreferredVehicleWidgetProps) {
  const vehicle =
    VEHICLE_MODELS[vehicleModel as keyof typeof VEHICLE_MODELS] || VEHICLE_MODELS['S-Class'];

  return (
    <DashboardWidget className='h-[120px] p-4 overflow-hidden'>
      <div className='flex items-center justify-between h-full gap-3'>
        {/* Left - Text */}
        <div className='flex-1 min-w-0'>
          <h3 className='text-xs font-semibold uppercase tracking-wider text-white/70 mb-1'>
            Preferred Vehicle
          </h3>
          <h2 className='text-sm font-bold text-white truncate'>{vehicle.name}</h2>
        </div>

        {/* Right - Car Image */}
        <div className='relative w-[130px] h-full flex-shrink-0 -mr-1'>
          <Image
            src={vehicle.image}
            alt={vehicle.name}
            fill
            className='object-contain object-center scale-[2.0]'
            priority
          />
        </div>
      </div>
    </DashboardWidget>
  );
}
