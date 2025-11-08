/**
 * 📝 Fleet Card Content - Vantage Lane 2.0
 *
 * Vehicle details, features, and CTA button.
 * Clean subcomponent with design tokens and accessibility.
 */

'use client';

import type React from 'react';
import { memo } from 'react';

import { designTokens } from '@/config/theme.config';
import { cn } from '@/lib/utils/cn';

import type { Vehicle } from './FleetSection.types';

export interface FleetCardContentProps {
  readonly vehicle: Vehicle;
  readonly onSelect?: (vehicle: Vehicle) => void;
  readonly showPrice?: boolean;
  readonly className?: string;
}

/**
 * 🎨 Vehicle content with features and CTA
 */
export const FleetCardContent = memo(function FleetCardContent({
  vehicle,
  onSelect,
  showPrice = true,
  className,
}: FleetCardContentProps): React.JSX.Element {
  const handleSelect = () => {
    onSelect?.(vehicle);
  };

  return (
    <div
      className={`flex-1 flex flex-col justify-between ${className || ''}`}
      style={{ padding: designTokens.fleet.spacing.cardPadding }}
    >
      {/* Vehicle Name */}
      <h3
        className='mb-2 text-center'
        style={{
          color: 'var(--text-primary)',
          fontSize: designTokens.fleet.typography.cardTitle.fontSize,
          fontWeight: designTokens.fleet.typography.cardTitle.fontWeight,
          lineHeight: designTokens.fleet.typography.cardTitle.lineHeight,
        }}
      >
        {vehicle.name}
      </h3>

      {/* Description */}
      <p
        className='mb-4 leading-relaxed text-center'
        style={{
          color: 'var(--text-secondary)',
          fontSize: designTokens.fleet.typography.cardDescription.fontSize,
          lineHeight: designTokens.fleet.typography.cardDescription.lineHeight,
        }}
      >
        {vehicle.description}
      </p>

      {/* Price */}
      {showPrice && vehicle.priceFrom && (
        <div className='mb-4 text-center'>
          <span
            style={{
              color: 'var(--brand-primary)',
              fontSize: designTokens.fleet.typography.cardPrice.fontSize,
              fontWeight: designTokens.fleet.typography.cardPrice.fontWeight,
            }}
          >
            {vehicle.priceFrom}
          </span>
        </div>
      )}

      {/* Features */}
      <div
        className='space-y-2 mb-6 flex flex-col items-center'
        style={{ gap: designTokens.fleet.spacing.featureGap }}
      >
        {vehicle.features.map((feature, index) => (
          <div key={index} className='flex items-center gap-2'>
            <div
              className='w-1.5 h-1.5 rounded-full'
              style={{ backgroundColor: 'var(--brand-primary)' }}
            />
            <span className='text-sm' style={{ color: 'var(--text-muted)' }}>
              {feature.text}
            </span>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <button
        onClick={handleSelect}
        className={cn(
          'w-full py-2.5 text-sm font-medium rounded-lg',
          'border transition-all duration-300',
          'hover:transform hover:scale-[1.02]',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          'focus:ring-[var(--brand-primary)] focus:ring-offset-[var(--background-elevated)]'
        )}
        style={{
          borderColor: 'var(--brand-primary-30)',
          color: 'var(--brand-primary)',
          backgroundColor: 'transparent',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.backgroundColor = 'var(--brand-primary-10)';
          e.currentTarget.style.borderColor = 'var(--brand-primary)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.borderColor = 'var(--brand-primary-30)';
        }}
      >
        Select Vehicle
      </button>
    </div>
  );
});
