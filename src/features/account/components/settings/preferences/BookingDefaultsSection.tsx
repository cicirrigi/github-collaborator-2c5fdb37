'use client';

import React from 'react';
import { Calendar, Car } from 'lucide-react';

interface BookingType {
  value: 'oneway' | 'return' | 'hourly' | 'daily';
  label: string;
  description: string;
}

interface VehicleCategory {
  value: 'executive' | 'luxury' | 'suv' | 'mpv';
  label: string;
  description: string;
}

const BOOKING_TYPES: BookingType[] = [
  { value: 'oneway', label: 'One-way', description: 'Single destination trip' },
  { value: 'return', label: 'Return', description: 'Round trip with return journey' },
  { value: 'hourly', label: 'Hourly', description: 'Book by the hour for multiple stops' },
  { value: 'daily', label: 'Daily', description: 'Full day service' },
];

const VEHICLE_CATEGORIES: VehicleCategory[] = [
  { value: 'executive', label: 'Executive', description: 'Professional & comfortable' },
  { value: 'luxury', label: 'Luxury', description: 'Premium & exclusive' },
  { value: 'suv', label: 'SUV', description: 'Robust & spacious' },
  { value: 'mpv', label: 'MPV', description: 'Group & events' },
];

export function BookingDefaultsSection() {
  const [defaultBookingType, setDefaultBookingType] =
    React.useState<BookingType['value']>('oneway');
  const [defaultCategory, setDefaultCategory] =
    React.useState<VehicleCategory['value']>('executive');

  return (
    <section className='space-y-6'>
      {/* Section Header */}
      <div className='pb-4 border-b border-neutral-200 dark:border-neutral-700'>
        <h3 className='text-lg font-semibold text-neutral-900 dark:text-white'>Booking Defaults</h3>
        <p className='text-sm text-neutral-600 dark:text-neutral-400 mt-1'>
          Set your preferred defaults for new bookings
        </p>
      </div>

      {/* Default Booking Type */}
      <div className='space-y-3'>
        <label className='flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300'>
          <Calendar className='w-4 h-4' />
          Default Booking Type
        </label>
        <select
          value={defaultBookingType}
          onChange={e => setDefaultBookingType(e.target.value as BookingType['value'])}
          className='
            w-full px-3 py-2 text-sm
            bg-white dark:bg-neutral-800
            border border-neutral-300 dark:border-neutral-600
            rounded-lg shadow-sm
            text-neutral-900 dark:text-white
            focus:ring-2 focus:ring-[var(--brand-primary)]/20
            focus:border-[var(--brand-primary)]
            transition-colors duration-200
          '
        >
          {BOOKING_TYPES.map(type => (
            <option key={type.value} value={type.value}>
              {type.label} - {type.description}
            </option>
          ))}
        </select>
      </div>

      {/* Default Vehicle Category */}
      <div className='space-y-3'>
        <label className='flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300'>
          <Car className='w-4 h-4' />
          Default Vehicle Category
        </label>
        <select
          value={defaultCategory}
          onChange={e => setDefaultCategory(e.target.value as VehicleCategory['value'])}
          className='
            w-full px-3 py-2 text-sm
            bg-white dark:bg-neutral-800
            border border-neutral-300 dark:border-neutral-600
            rounded-lg shadow-sm
            text-neutral-900 dark:text-white
            focus:ring-2 focus:ring-[var(--brand-primary)]/20
            focus:border-[var(--brand-primary)]
            transition-colors duration-200
          '
        >
          {VEHICLE_CATEGORIES.map(category => (
            <option key={category.value} value={category.value}>
              {category.label} - {category.description}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
}
