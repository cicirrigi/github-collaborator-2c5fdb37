/**
 * 🏷️ Fleet Card Header - Vantage Lane 2.0
 *
 * Displays vehicle category and popular badges.
 * Clean subcomponent with design tokens integration.
 */

'use client';

import type React from 'react';
import { memo } from 'react';

import { designTokens } from '@/config/theme.config';
import { cn } from '@/lib/utils/cn';

import type { Vehicle } from './FleetSection.types';

export interface FleetCardHeaderProps {
  readonly vehicle: Vehicle;
  readonly className?: string;
}

/**
 * 🎨 Category badge and popular badge component
 */
export const FleetCardHeader = memo(function FleetCardHeader({
  vehicle,
  className,
}: FleetCardHeaderProps): React.JSX.Element {
  const categoryColor = designTokens.fleet.categoryColors[vehicle.category];

  return (
    <div
      className={cn(
        'absolute top-4 left-4 right-4 z-20 flex justify-between items-start',
        className
      )}
    >
      {/* Category Badge */}
      <span
        className='px-3 py-1 text-xs font-medium rounded-full text-white'
        style={{
          backgroundColor: categoryColor,
        }}
      >
        {vehicle.category}
      </span>

      {/* Popular Badge */}
      {vehicle.popular && (
        <span
          className='px-3 py-1 text-xs font-medium rounded-full'
          style={{
            backgroundColor: 'var(--brand-primary)',
            color: 'var(--background-dark)',
          }}
        >
          Popular
        </span>
      )}
    </div>
  );
});
