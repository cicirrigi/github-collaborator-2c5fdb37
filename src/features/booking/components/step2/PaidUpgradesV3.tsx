'use client';

import { useBookingState } from '@/hooks/useBookingState';
import { Wine } from 'lucide-react';
import { useState } from 'react';
import { PAID_UPGRADES, type PaidUpgrade } from './service-config';

interface PaidUpgradesV3Props {
  className?: string;
}

export function PaidUpgradesV3({ className = '' }: PaidUpgradesV3Props) {
  const bookingStore = useBookingState();
  const { tripConfiguration } = bookingStore;

  // Get current upgrades from Zustand store
  const { paidUpgrades } = tripConfiguration.servicePackages;

  // Access store actions
  const store = bookingStore as typeof bookingStore & {
    setFlowersUpgrade: (flowers: 'standard' | 'exclusive' | null) => void;
    setChampagneUpgrade: (champagne: 'moet' | 'dom-perignon' | null) => void;
    toggleSecurityEscort: () => void;
    calculateUpgradesCost: () => number;
  };

  const totalCost = store.calculateUpgradesCost();

  return (
    <section className={`space-y-4 ${className}`}>
      {/* 🎯 Header with Total Cost */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Wine className='w-4 h-4 text-yellow-400' />
          <h3 className='text-white font-medium text-base'>Premium Upgrades</h3>
          <div className='px-2 py-1 rounded text-xs bg-purple-400/20 text-purple-200'>Optional</div>
        </div>
        {totalCost > 0 && (
          <div className='px-3 py-1.5 rounded-full bg-yellow-400/20 text-yellow-400 text-sm font-medium'>
            Total: £{totalCost}
          </div>
        )}
      </div>

      {/* 🎨 5 Cartonașe uniform pe o linie */}
      <div className='flex gap-2'>
        {PAID_UPGRADES.map(upgrade => (
          <UpgradeCartCard
            key={upgrade.id}
            upgrade={upgrade}
            isSelected={
              (upgrade.category === 'flowers' && paidUpgrades.flowers === upgrade.id) ||
              (upgrade.category === 'champagne' && paidUpgrades.champagne === upgrade.id) ||
              (upgrade.category === 'security' && paidUpgrades.securityEscort)
            }
            onSelect={() => {
              if (upgrade.category === 'flowers') {
                store.setFlowersUpgrade(
                  paidUpgrades.flowers === upgrade.id
                    ? null
                    : (upgrade.id as 'standard' | 'exclusive')
                );
              } else if (upgrade.category === 'champagne') {
                store.setChampagneUpgrade(
                  paidUpgrades.champagne === upgrade.id
                    ? null
                    : (upgrade.id as 'moet' | 'dom-perignon')
                );
              } else if (upgrade.category === 'security') {
                store.toggleSecurityEscort();
              }
            }}
          />
        ))}
      </div>
    </section>
  );
}

// 🎴 Upgrade Card ca un cartonaș
interface UpgradeCartCardProps {
  upgrade: PaidUpgrade;
  isSelected: boolean;
  onSelect: () => void;
}

function UpgradeCartCard({ upgrade, isSelected, onSelect }: UpgradeCartCardProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const { icon: Icon, title, price, currency, description } = upgrade;

  return (
    <div
      className='relative group cursor-pointer transition-all duration-300 flex-1'
      onClick={onSelect}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* 🎴 Cartonaș Card */}
      <div
        className={`relative p-2.5 rounded-2xl backdrop-blur-sm transition-all duration-200 group-hover:scale-105 border-2 w-full ${
          isSelected
            ? 'border-yellow-400/50 bg-yellow-400/10'
            : 'border-white/10 bg-white/5 hover:border-yellow-400/30'
        }`}
      >
        {/* Content */}
        <div className='flex flex-col items-center space-y-2 text-center'>
          {/* Icon Container */}
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
              isSelected
                ? 'bg-gradient-to-br from-yellow-400/20 to-yellow-500/30'
                : 'bg-gradient-to-br from-stone-700 to-stone-950'
            }`}
          >
            <Icon className={`w-5 h-5 ${isSelected ? 'text-yellow-400' : 'text-amber-200'}`} />
          </div>

          {/* Title */}
          <div className='space-y-1'>
            <h4 className='text-white font-medium text-sm leading-tight line-clamp-2'>{title}</h4>
            <div className='flex items-center justify-center gap-1'>
              <span className='text-yellow-400 font-semibold text-sm'>
                {currency}
                {price}
              </span>
            </div>
          </div>

          {/* Selected Indicator */}
          {isSelected && (
            <div className='absolute top-1 right-1 w-3 h-3 bg-yellow-400 rounded-full flex items-center justify-center'>
              <div className='w-1.5 h-1.5 bg-black rounded-full' />
            </div>
          )}
        </div>
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div className='absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50 w-48'>
          <div
            className='bg-black/95 backdrop-blur-sm border rounded-lg p-3 shadow-xl'
            style={{ borderColor: 'rgba(203,178,106,0.25)' }}
          >
            <div className='absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-black/95' />

            <div className='space-y-2'>
              <div className='flex items-center gap-2'>
                <Icon className='w-4 h-4 text-yellow-400' />
                <h5 className='text-white font-medium text-sm'>{title}</h5>
              </div>
              <p className='text-yellow-200/80 text-xs leading-relaxed'>{description}</p>
              <div className='text-yellow-400 text-xs font-medium'>
                {currency}
                {price}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export type { PaidUpgradesV3Props };
