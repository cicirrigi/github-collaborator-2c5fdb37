'use client';

import { useBookingState } from '@/hooks/useBookingState';
import { Flower, ShieldCheck, Wine } from 'lucide-react';
import { PAID_UPGRADES } from './service-config';
import { UpgradeCard } from './UpgradeCard';

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

      {/* 🎨 Modern Compact Frame */}
      <div
        className='relative p-4 rounded-3xl backdrop-blur-sm space-y-4'
        style={{
          backgroundColor: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(203,178,106,0.15)',
          backdropFilter: 'blur(20px)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), 0 8px 32px rgba(0,0,0,0.15)',
        }}
      >
        {/* 🌹 FLOWERS SECTION */}
        <div className='space-y-3'>
          <div className='flex items-center gap-2'>
            <Flower className='w-3.5 h-3.5 text-pink-400' />
            <h4 className='text-amber-200/80 text-xs font-medium tracking-wider uppercase'>
              Luxury Flowers
            </h4>
          </div>
          <div className='grid grid-cols-2 gap-3'>
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
            <Wine className='w-3.5 h-3.5 text-purple-400' />
            <h4 className='text-amber-200/80 text-xs font-medium tracking-wider uppercase'>
              Premium Champagne
            </h4>
          </div>

          <div className='grid grid-cols-2 gap-3'>
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
      </div>
    </section>
  );
}
