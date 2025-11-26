'use client';

import { useBookingState } from '@/hooks/useBookingState';
import { Crown } from 'lucide-react';
import { useState } from 'react';
import { PREMIUM_FEATURES, type PremiumFeature } from './service-config';

interface PremiumFeaturesCardV2Props {
  className?: string;
}

export function PremiumFeaturesCardV2({ className = '' }: PremiumFeaturesCardV2Props) {
  const { tripConfiguration } = useBookingState();
  const selectedCategory = tripConfiguration.selectedVehicle?.category;

  // Only show for Luxury, SUV, MPV categories
  const isPremiumEligible =
    selectedCategory && ['luxury', 'suv', 'mpv'].includes(selectedCategory.id);

  if (!isPremiumEligible) {
    return null;
  }

  return (
    <div className={`relative ${className}`}>
      {/* 💎 Luxury Black-Glass Card */}
      <div
        className='relative p-5 rounded-3xl transition-all duration-300 h-full'
        style={{
          background: 'linear-gradient(145deg, rgba(10,10,10,0.65), rgba(15,15,15,0.55))',
          border: '1px solid rgba(203,178,106,0.35)',
          backdropFilter: 'blur(22px)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), 0 10px 40px rgba(0,0,0,0.55)',
        }}
      >
        {/* Header */}
        <div className='flex items-center gap-3 mb-5'>
          <div
            className='w-9 h-9 rounded-xl flex items-center justify-center shadow-lg'
            style={{
              background:
                'conic-gradient(from 210deg at 50% 50%, rgba(203,178,106,0.25), rgba(203,178,106,0.1), rgba(203,178,106,0.25))',
              boxShadow: '0 0 15px rgba(203,178,106,0.25)',
            }}
          >
            <Crown className='w-5 h-5' style={{ color: '#CBB26A' }} />
          </div>

          <div>
            <h3 className='text-white font-semibold text-lg tracking-wide'>Premium Features</h3>
            <p className='text-yellow-200/50 text-xs'>FREE for {selectedCategory.name}</p>
          </div>
        </div>

        {/* Features Grid */}
        <div className='grid grid-cols-2 gap-4'>
          {PREMIUM_FEATURES.map(feature => (
            <PremiumFeatureIcon key={feature.id} feature={feature} />
          ))}
        </div>

        {/* Footer */}
        <div className='text-center mt-5 pt-4 border-t border-white/10'>
          <p className='text-yellow-200/50 text-xs tracking-wide'>
            Click to enable/disable premium features
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────── */
/*                Premium Feature Icon Component           */
/* ─────────────────────────────────────────────────────── */
interface PremiumFeatureIconProps {
  feature: PremiumFeature;
}

function PremiumFeatureIcon({ feature }: PremiumFeatureIconProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const bookingStore = useBookingState();
  const { tripConfiguration } = bookingStore;
  const { icon: Icon, title, description } = feature;

  // Get selected state from Zustand store
  const isSelected = tripConfiguration.servicePackages.premiumFeatures[feature.id];

  return (
    <div
      className='relative group cursor-pointer'
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={() =>
        (
          bookingStore as typeof bookingStore & { togglePremiumFeature: (id: string) => void }
        ).togglePremiumFeature(feature.id)
      }
    >
      {/* Feature Card */}
      <div
        className='p-3 rounded-xl backdrop-blur-sm transition-all duration-200 cursor-pointer group-hover:shadow-lg'
        style={{
          backgroundColor: isSelected ? 'rgba(203,178,106,0.08)' : 'rgba(255,255,255,0.05)',
          border: isSelected
            ? '1px solid rgba(203,178,106,0.15)'
            : '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(16px)',
          boxShadow: isSelected
            ? 'inset 0 1px 0 rgba(255,255,255,0.05), 0 0 15px rgba(203,178,106,0.25)'
            : 'inset 0 1px 0 rgba(255,255,255,0.05), 0 6px 20px rgba(0,0,0,0.25)',
        }}
      >
        {/* Content */}
        <div className='text-center space-y-2'>
          {/* 💎 Gold Crystal Icon */}
          <div
            className='mx-auto w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110'
            style={{
              background: isSelected
                ? 'linear-gradient(145deg, rgba(203,178,106,0.15), rgba(203,178,106,0.25))'
                : 'linear-gradient(145deg, rgba(35,35,35,0.85), rgba(12,12,12,0.95))',
              border: '1px solid rgba(203,178,106,0.25)',
              boxShadow: '0 0 12px rgba(203,178,106,0.15), inset 0 0 6px rgba(0,0,0,0.6)',
            }}
          >
            <Icon className='w-5 h-5' style={{ color: '#CBB26A' }} />
          </div>

          {/* Title */}
          <h4 className='text-white font-medium text-xs leading-tight line-clamp-2 tracking-wide'>
            {title}
          </h4>
        </div>
      </div>

      {/* Floating Tooltip */}
      {showTooltip && (
        <div className='absolute bottom-full left-1/2 -translate-x-1/2 mb-4 z-50 w-56 pointer-events-none'>
          <div
            className='relative p-4 rounded-2xl shadow-2xl'
            style={{
              background: 'rgba(15,15,15,0.95)',
              border: '1px solid rgba(203,178,106,0.35)',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 25px 45px rgba(0,0,0,0.6), 0 0 25px rgba(203,178,106,0.25)',
            }}
          >
            <div
              className='absolute top-full left-1/2 -translate-x-1/2'
              style={{
                width: 0,
                height: 0,
                borderLeft: '7px solid transparent',
                borderRight: '7px solid transparent',
                borderTop: '7px solid rgba(15,15,15,0.95)',
              }}
            />

            <div className='space-y-3'>
              <div className='flex items-center gap-2 pb-2 border-b border-white/10'>
                <Icon className='w-4 h-4' style={{ color: '#E5D485' }} />
                <h5 className='text-white text-sm font-semibold tracking-wide'>{title}</h5>
              </div>

              <p className='text-amber-100/80 text-xs leading-relaxed'>{description}</p>

              <div className='flex items-center gap-1.5 pt-1'>
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

export type { PremiumFeaturesCardV2Props };
export default PremiumFeaturesCardV2;
