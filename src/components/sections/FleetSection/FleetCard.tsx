/**
 * 🚗 Fleet Card Component - Vantage Lane 2.0
 *
 * Reusable vehicle card with luxury design and smooth interactions.
 * Uses design tokens for consistent styling and accessibility.
 */

'use client';

import Image from 'next/image';
import type React from 'react';
import { memo } from 'react';

import { designTokens } from '@/config/theme.config';
import { cn } from '@/lib/utils/cn';

import type { FleetCardProps } from './FleetSection.types';

/**
 * 🎨 Individual vehicle card component
 * Features luxury design with hover effects and accessibility
 */
const FleetCard = memo(function FleetCard({
  vehicle,
  onSelect,
  className,
  showPrice = true,
}: FleetCardProps): React.JSX.Element {
  const handleSelect = () => {
    onSelect?.(vehicle);
  };

  const categoryColors = {
    Executive: 'bg-blue-500/90',
    Luxury: 'bg-amber-500/90', // Using amber for luxury
    SUV: 'bg-green-500/90',
    Van: 'bg-purple-500/90',
    Sports: 'bg-red-500/90',
  } as const;

  return (
    <div
      className={cn('group relative', className)}
      role='article'
      aria-label={`${vehicle.name} vehicle details`}
    >
      {/* Card Container */}
      <div
        className={cn(
          'relative overflow-hidden border transition-all duration-500',
          'hover:transform cursor-pointer',
          'focus-within:ring-2 focus-within:ring-offset-2',
          'focus-within:ring-[var(--brand-primary)] focus-within:ring-offset-[var(--background-dark)]'
        )}
        style={{
          backgroundColor: 'var(--background-elevated)',
          borderColor: 'var(--border-subtle)',
          borderRadius: designTokens.fleet.effects.borderRadius,
          transform: `scale(1)`,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = `scale(${designTokens.fleet.effects.hoverScale})`;
          e.currentTarget.style.borderColor = 'var(--brand-primary-30)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.borderColor = 'var(--border-subtle)';
        }}
      >
        {/* Popular Badge */}
        {vehicle.popular && (
          <div className='absolute top-4 right-4 z-20'>
            <span
              className='px-3 py-1 text-xs font-medium rounded-full'
              style={{
                backgroundColor: 'var(--brand-primary)',
                color: 'var(--background-dark)',
              }}
            >
              Popular
            </span>
          </div>
        )}

        {/* Category Badge */}
        <div className='absolute top-4 left-4 z-20'>
          <span
            className={cn(
              'px-3 py-1 text-xs font-medium rounded-full text-white',
              categoryColors[vehicle.category]
            )}
          >
            {vehicle.category}
          </span>
        </div>

        {/* Vehicle Image */}
        <div className='relative h-48 overflow-hidden'>
          <Image
            src={vehicle.image}
            alt={`${vehicle.name} - ${vehicle.category} vehicle`}
            fill
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            priority={false}
            quality={85}
            className='object-cover transition-transform duration-700'
            style={{
              transform: 'scale(1)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = `scale(${designTokens.fleet.effects.imagScale})`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
            placeholder='blur'
            blurDataURL='data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJceliyjqTzSlT54b6bk+h0R//2Q=='
          />

          {/* Gradient Overlay */}
          <div
            className='absolute inset-0'
            style={{
              background: 'linear-gradient(to top, var(--background-elevated) 0%, transparent 50%)',
            }}
          />
        </div>

        {/* Content */}
        <div style={{ padding: designTokens.fleet.spacing.cardPadding }}>
          {/* Vehicle Name */}
          <h3 className='text-xl font-medium mb-2' style={{ color: 'var(--text-primary)' }}>
            {vehicle.name}
          </h3>

          {/* Description */}
          <p className='text-sm mb-4 leading-relaxed' style={{ color: 'var(--text-secondary)' }}>
            {vehicle.description}
          </p>

          {/* Price */}
          {showPrice && vehicle.priceFrom && (
            <div className='mb-4'>
              <span className='text-sm font-medium' style={{ color: 'var(--brand-primary)' }}>
                {vehicle.priceFrom}
              </span>
            </div>
          )}

          {/* Features */}
          <div className='space-y-2 mb-6' style={{ gap: designTokens.fleet.spacing.featureGap }}>
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

        {/* Hover Glow Effect */}
        <div
          className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none'
          style={{
            background: `linear-gradient(to top, var(--brand-primary-05) 0%, transparent 50%)`,
            borderRadius: designTokens.fleet.effects.borderRadius,
          }}
        />
      </div>
    </div>
  );
});

export { FleetCard };
