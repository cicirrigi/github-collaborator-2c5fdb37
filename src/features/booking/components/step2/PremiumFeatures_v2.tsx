'use client';

import { useBookingState } from '@/hooks/useBookingState';
import { Crown } from 'lucide-react';
import { useState } from 'react';
import { PREMIUM_FEATURES, type PremiumFeature } from './service-config';

interface PremiumFeaturesV2Props {
  className?: string;
}

export function PremiumFeaturesV2({ className = '' }: PremiumFeaturesV2Props) {
  const { tripConfiguration } = useBookingState();
  const selectedCategory = tripConfiguration.selectedVehicle?.category;

  // Only show for Luxury, SUV, MPV categories
  const isPremiumEligible =
    selectedCategory && ['luxury', 'suv', 'mpv'].includes(selectedCategory.id);

  if (!isPremiumEligible) {
    return null;
  }

  return (
    <section className={`space-y-3 ${className}`}>
      {/* 🎯 Compact Header */}
      <div className='flex items-center gap-2'>
        <Crown className='w-4 h-4 text-yellow-400' />
        <h3 className='text-white font-medium text-base'>Premium Features</h3>
        <div className='px-2 py-1 rounded text-xs bg-yellow-400/20 text-yellow-200'>
          FREE for {selectedCategory.name}
        </div>
      </div>

      {/* 🟨 Compact Grid - 4 features (2x2 or 4x1) */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
        {PREMIUM_FEATURES.map(feature => (
          <CompactFeatureCard key={feature.id} feature={feature} />
        ))}
      </div>
    </section>
  );
}

// 🎁 Compact Feature Card with Tooltip
interface CompactFeatureCardProps {
  feature: PremiumFeature;
}

function CompactFeatureCard({ feature }: CompactFeatureCardProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const bookingStore = useBookingState();
  const { tripConfiguration } = bookingStore;
  const { icon: Icon, title, description } = feature;

  // Get selected state from Zustand store
  const isSelected = tripConfiguration.servicePackages.premiumFeatures[feature.id];

  return (
    <div
      className='relative group'
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* 🎨 Main Card - Design simplu și elegant */}
      <div
        className='relative p-3 rounded-xl backdrop-blur-sm transition-all duration-200 cursor-pointer group-hover:shadow-lg'
        style={{
          backgroundColor: isSelected ? 'rgba(203,178,106,0.15)' : 'rgba(255,255,255,0.05)',
          border: isSelected ? '1px solid rgba(203,178,106,0.4)' : 'none',
          backdropFilter: 'blur(16px)',
          boxShadow: isSelected
            ? 'inset 0 1px 0 rgba(255,255,255,0.15), 0 6px 20px rgba(203,178,106,0.25)'
            : 'inset 0 1px 0 rgba(255,255,255,0.05), 0 6px 20px rgba(0,0,0,0.25)',
        }}
        onClick={() =>
          (
            bookingStore as typeof bookingStore & { togglePremiumFeature: (id: string) => void }
          ).togglePremiumFeature(feature.id)
        }
      >
        {/* 🎯 Content */}
        <div className='text-center space-y-2'>
          {/* Icon - Background gri negricios fără border */}
          <div
            className='mx-auto w-8 h-8 rounded-lg flex items-center justify-center'
            style={{
              backgroundColor: isSelected ? 'rgba(203,178,106,0.3)' : 'rgba(60,60,60,0.8)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)',
            }}
          >
            <Icon className='w-5 h-5' style={{ color: isSelected ? '#CBB26A' : '#CBB26A' }} />
          </div>

          {/* Title - Compact */}
          <h4 className='text-white font-medium text-xs leading-tight line-clamp-2'>{title}</h4>
        </div>

        {/* 🌟 Hover Enhancement - Auriu subtil ca înainte */}
        <div
          className='absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200'
          style={{
            backgroundColor: 'rgba(203,178,106,0.08)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25), 0 0 20px rgba(203,178,106,0.15)',
          }}
        />

        {/* ✅ Selected Indicator */}
        {isSelected && (
          <div className='absolute -top-1 -right-1 w-4 h-4 rounded-full bg-yellow-400 flex items-center justify-center'>
            <Crown className='w-2 h-2 text-black' />
          </div>
        )}
      </div>

      {/* 🔍 Hover Tooltip - Modern Info */}
      {showTooltip && (
        <div className='absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50 w-52'>
          <div
            className='bg-black/90 backdrop-blur-sm border rounded-lg p-3 shadow-xl'
            style={{ borderColor: 'rgba(203,178,106,0.25)' }}
          >
            {/* Arrow */}
            <div className='absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-black/90' />

            {/* Tooltip Content */}
            <div className='space-y-2'>
              <div className='flex items-center gap-2'>
                <Icon className='w-4 h-4 text-yellow-400' />
                <h5 className='text-white font-medium text-sm'>{title}</h5>
              </div>
              <p className='text-yellow-200/80 text-xs leading-relaxed'>{description}</p>
              <div className='flex items-center gap-1 pt-1'>
                <Crown className='w-3 h-3 text-yellow-400' />
                <span className='text-yellow-300 text-xs font-medium'>Premium Feature</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 🔧 Export
export type { PremiumFeaturesV2Props };
