'use client';

import { useBookingState } from '@/hooks/useBookingState';
import { Flower, ShieldCheck, Wine } from 'lucide-react';
import { useState } from 'react';
import { PAID_UPGRADES, type PaidUpgrade } from './service-config';

interface PaidUpgradesV2Props {
  className?: string;
}

export function PaidUpgradesV2({ className = '' }: PaidUpgradesV2Props) {
  const bookingStore = useBookingState();
  const { tripConfiguration } = bookingStore;

  // Get current upgrades from Zustand store
  const { paidUpgrades } = tripConfiguration.servicePackages;

  // Access store actions via typed store reference
  const store = bookingStore as typeof bookingStore & {
    setFlowersUpgrade: (flowers: 'standard' | 'exclusive' | null) => void;
    setChampagneUpgrade: (champagne: 'moet' | 'dom-perignon' | null) => void;
    toggleSecurityEscort: () => void;
    calculateUpgradesCost: () => number;
  };

  // Group upgrades by category
  const flowerUpgrades = PAID_UPGRADES.filter(u => u.category === 'flowers');
  const champagneUpgrades = PAID_UPGRADES.filter(u => u.category === 'champagne');
  const securityUpgrades = PAID_UPGRADES.filter(u => u.category === 'security');

  const totalCost = store.calculateUpgradesCost();

  return (
    <section className={`space-y-6 ${className}`}>
      {/* 🎯 Header with Total Cost */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Wine className='w-4 h-4 text-yellow-400' />
          <h3 className='text-white font-medium text-base'>Premium Upgrades</h3>
        </div>
        {totalCost > 0 && (
          <div className='px-3 py-1.5 rounded-full bg-yellow-400/20 text-yellow-400 text-sm font-medium'>
            Total: £{totalCost}
          </div>
        )}
      </div>

      {/* 🌹 FLOWERS SECTION */}
      <div className='space-y-3'>
        <div className='flex items-center gap-2'>
          <Flower className='w-3.5 h-3.5 text-pink-400/70' />
          <h4 className='text-amber-200/80 text-xs font-medium tracking-wider uppercase'>
            Luxury Flowers
          </h4>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
          {flowerUpgrades.map(upgrade => (
            <UpgradeCard
              key={upgrade.id}
              upgrade={upgrade}
              isSelected={paidUpgrades.flowers === upgrade.id}
              onSelect={() =>
                store.setFlowersUpgrade(
                  paidUpgrades.flowers === upgrade.id
                    ? null
                    : (upgrade.id as 'standard' | 'exclusive')
                )
              }
            />
          ))}
        </div>
      </div>

      {/* 🍾 CHAMPAGNE SECTION */}
      <div className='space-y-3'>
        <div className='flex items-center gap-2'>
          <Wine className='w-3.5 h-3.5 text-amber-400/70' />
          <h4 className='text-amber-200/80 text-xs font-medium tracking-wider uppercase'>
            Premium Champagne
          </h4>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
          {champagneUpgrades.map(upgrade => (
            <UpgradeCard
              key={upgrade.id}
              upgrade={upgrade}
              isSelected={paidUpgrades.champagne === upgrade.id}
              onSelect={() =>
                store.setChampagneUpgrade(
                  paidUpgrades.champagne === upgrade.id
                    ? null
                    : (upgrade.id as 'moet' | 'dom-perignon')
                )
              }
            />
          ))}
        </div>
      </div>

      {/* 🛡️ SECURITY SECTION */}
      <div className='space-y-3'>
        <div className='flex items-center gap-2'>
          <ShieldCheck className='w-3.5 h-3.5 text-blue-400/70' />
          <h4 className='text-amber-200/80 text-xs font-medium tracking-wider uppercase'>
            Security Services
          </h4>
        </div>

        <div className='grid grid-cols-1 gap-3'>
          {securityUpgrades.map(upgrade => (
            <UpgradeCard
              key={upgrade.id}
              upgrade={upgrade}
              isSelected={paidUpgrades.securityEscort}
              onSelect={() => store.toggleSecurityEscort()}
              isFullWidth
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// 💎 Premium Upgrade Card Component
interface UpgradeCardProps {
  upgrade: PaidUpgrade;
  isSelected: boolean;
  onSelect: () => void;
  isFullWidth?: boolean;
}

function UpgradeCard({ upgrade, isSelected, onSelect, isFullWidth = false }: UpgradeCardProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const { icon: Icon, title, description, price, currency } = upgrade;

  return (
    <div
      className='group relative'
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* 🎨 Main Card */}
      <div
        className='relative p-4 rounded-xl backdrop-blur-sm transition-all duration-200 cursor-pointer group-hover:shadow-lg'
        style={{
          backgroundColor: isSelected ? 'rgba(203,178,106,0.2)' : 'rgba(255,255,255,0.05)',
          border: isSelected
            ? '1px solid rgba(203,178,106,0.5)'
            : '1px solid rgba(255,255,255,0.06)',
          backdropFilter: 'blur(16px)',
          boxShadow: isSelected
            ? 'inset 0 1px 0 rgba(255,255,255,0.15), 0 4px 8px rgba(203,178,106,0.2)'
            : 'inset 0 1px 0 rgba(255,255,255,0.05), 0 4px 8px rgba(0,0,0,0.15)',
        }}
        onClick={onSelect}
      >
        {/* 🎯 Content */}
        <div
          className={`${isFullWidth ? 'flex items-center justify-between' : 'text-center space-y-3'}`}
        >
          {/* Icon & Title */}
          <div className={`${isFullWidth ? 'flex items-center gap-3' : 'space-y-2'}`}>
            <div
              className='w-10 h-10 rounded-lg flex items-center justify-center'
              style={{
                backgroundColor: isSelected ? 'rgba(203,178,106,0.4)' : 'rgba(60,60,60,0.8)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)',
              }}
            >
              <Icon className='w-5 h-5' style={{ color: isSelected ? '#CBB26A' : '#CBB26A' }} />
            </div>

            <div className={isFullWidth ? '' : 'text-center'}>
              <h5 className='text-white font-medium text-sm'>{title}</h5>
              <p className='text-amber-200/60 text-xs mt-1'>{description}</p>
            </div>
          </div>

          {/* Price */}
          <div className={`${isFullWidth ? '' : 'mt-3'}`}>
            <div className='flex items-center justify-center gap-2'>
              <span className='text-yellow-400 font-semibold text-lg'>
                {currency}
                {price}
              </span>
              {isSelected && (
                <div className='w-5 h-5 rounded-full bg-yellow-400 flex items-center justify-center'>
                  <div className='w-2 h-2 bg-black rounded-full' />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 💬 Tooltip */}
      {showTooltip && (
        <div
          className='absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 text-xs text-white rounded-lg pointer-events-none z-50 max-w-48 text-center'
          style={{
            backgroundColor: 'rgba(0,0,0,0.9)',
            border: '1px solid rgba(255,255,255,0.2)',
            backdropFilter: 'blur(8px)',
          }}
        >
          Click to {isSelected ? 'remove' : 'add'} {title}
          <div className='absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/90' />
        </div>
      )}
    </div>
  );
}
