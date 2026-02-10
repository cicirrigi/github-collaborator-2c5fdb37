'use client';

import { Car, Crown, Truck, Users } from 'lucide-react';
import React from 'react';

interface VehicleModel {
  value: string;
  label: string;
}

interface CategoryConfig {
  category: 'executive' | 'luxury' | 'suv' | 'mpv';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  models: VehicleModel[];
}

const CATEGORY_CONFIGS: CategoryConfig[] = [
  {
    category: 'executive',
    label: 'Executive',
    icon: Car,
    models: [
      { value: 'mercedes-e-class', label: 'Mercedes E-Class' },
      { value: 'bmw-5-series', label: 'BMW 5 Series' },
    ],
  },
  {
    category: 'luxury',
    label: 'Luxury',
    icon: Crown,
    models: [
      { value: 'mercedes-s-class', label: 'Mercedes S-Class' },
      { value: 'bmw-7-series', label: 'BMW 7 Series' },
    ],
  },
  {
    category: 'suv',
    label: 'SUV',
    icon: Truck,
    models: [{ value: 'range-rover', label: 'Range Rover' }],
  },
  {
    category: 'mpv',
    label: 'MPV',
    icon: Users,
    models: [{ value: 'mercedes-v-class', label: 'Mercedes V-Class' }],
  },
];

export function VehiclePreferencesSection() {
  const [favoriteVehicles, setFavoriteVehicles] = React.useState<Record<string, string>>({
    executive: 'mercedes-e-class',
    luxury: 'mercedes-s-class',
    suv: 'range-rover',
    mpv: 'mercedes-v-class',
  });

  const handleVehicleChange = (category: string, vehicleValue: string) => {
    setFavoriteVehicles(prev => ({
      ...prev,
      [category]: vehicleValue,
    }));
  };

  return (
    <section className='space-y-6'>
      {/* Section Header */}
      <div className='pb-4 border-b border-neutral-200 dark:border-neutral-700'>
        <h3 className='text-lg font-semibold text-neutral-900 dark:text-white'>
          Vehicle Preferences
        </h3>
        <p className='text-sm text-neutral-600 dark:text-neutral-400 mt-1'>
          Choose your favorite vehicle for each category
        </p>
      </div>

      {/* Vehicle Preferences Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        {CATEGORY_CONFIGS.map(config => {
          const IconComponent = config.icon;
          return (
            <div key={config.category} className='space-y-3'>
              <label className='flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300'>
                <IconComponent className='w-4 h-4' />
                {config.label}
              </label>

              {/* All categories show as selectable dropdowns */}
              <select
                value={favoriteVehicles[config.category] || config.models[0]?.value || ''}
                onChange={e => handleVehicleChange(config.category, e.target.value)}
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
                {config.models.map(model => (
                  <option key={model.value} value={model.value}>
                    {model.label}
                  </option>
                ))}
              </select>
            </div>
          );
        })}
      </div>
    </section>
  );
}
