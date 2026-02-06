'use client';

import { useBookingState } from '@/hooks/useBookingState';
import { Wine } from 'lucide-react';
import { useState } from 'react';
import { PAID_UPGRADES, type PaidUpgrade } from './service-config';

interface PaidUpgradesCardV2Props {
  className?: string;
}

export function PaidUpgradesCardV2({ className = '' }: PaidUpgradesCardV2Props) {
  const { tripConfiguration } = useBookingState(); // ✅ Activat store integration

  // ✅ Calculate total cost from current upgrades in store
  const { paidUpgrades } = tripConfiguration.servicePackages;
  const totalCost = PAID_UPGRADES.reduce((total, upgrade) => {
    const isSelected = paidUpgrades[upgrade.id as keyof typeof paidUpgrades];
    return total + (isSelected ? upgrade.price : 0);
  }, 0);

  return (
    <div className={`relative ${className}`}>
      {/* 💎 Luxury Black-Glass Card */}
      <div
        className='relative p-5 rounded-3xl transition-all duration-300 h-full'
        style={{
          background: 'linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.04))',
          border: '1px solid rgba(255,255,255,0.06)',
          backdropFilter: 'blur(22px)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), 0 10px 40px rgba(0,0,0,0.55)',
        }}
      >
        {/* Header */}
        <div className='flex items-center justify-between mb-5'>
          <div className='flex items-center gap-3'>
            <div
              className='w-9 h-9 rounded-xl flex items-center justify-center shadow-lg'
              style={{
                background:
                  'conic-gradient(from 210deg at 50% 50%, rgba(203,178,106,0.25), rgba(203,178,106,0.1), rgba(203,178,106,0.25))',
                boxShadow: '0 0 12px rgba(203,178,106,0.15)',
              }}
            >
              <Wine className='w-5 h-5' style={{ color: '#CBB26A' }} />
            </div>

            <div>
              <h3 className='text-white font-semibold text-lg tracking-wide'>Premium Upgrades</h3>
              <p className='text-amber-200/50 text-xs'>Optional add-ons</p>
            </div>
          </div>

          {/* Total Cost */}
          {totalCost > 0 && (
            <div className='px-3 py-1.5 rounded-full bg-yellow-400/20 text-yellow-400 text-sm font-medium'>
              Total: £{totalCost}
            </div>
          )}
        </div>

        {/* Upgrades Vertical List */}
        <div className='space-y-3'>
          {PAID_UPGRADES.map(upgrade => (
            <UpgradeItem key={upgrade.id} upgrade={upgrade} />
          ))}
        </div>

        {/* Footer */}
        <div className='text-center mt-5 pt-4 border-t border-white/10'>
          <p className='text-purple-200/50 text-xs tracking-wide'>
            Enhance your luxury experience with premium add-ons
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────── */
/*                    Upgrade Item Component               */
/* ─────────────────────────────────────────────────────── */
interface UpgradeItemProps {
  upgrade: PaidUpgrade;
}

function UpgradeItem({ upgrade }: UpgradeItemProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const bookingStore = useBookingState();
  const { tripConfiguration } = bookingStore;
  const { icon: Icon, title, description, price, currency } = upgrade;

  // Get current upgrades from store
  const { paidUpgrades } = tripConfiguration.servicePackages;

  // Access store actions
  const store = bookingStore as typeof bookingStore & {
    setFlowersUpgrade: (flowers: 'standard' | 'exclusive' | null) => void;
    setChampagneUpgrade: (champagne: 'moet' | 'dom-perignon' | null) => void;
    toggleSecurityEscort: () => void;
  };

  // Check if selected based on category and id
  const isSelected =
    (upgrade.category === 'flowers' && paidUpgrades.flowers === upgrade.id) ||
    (upgrade.category === 'champagne' && paidUpgrades.champagne === upgrade.id) ||
    (upgrade.category === 'security' && paidUpgrades.securityEscort);

  const handleToggle = () => {
    if (upgrade.category === 'flowers') {
      store.setFlowersUpgrade(
        paidUpgrades.flowers === upgrade.id ? null : (upgrade.id as 'standard' | 'exclusive')
      );
    } else if (upgrade.category === 'champagne') {
      store.setChampagneUpgrade(
        paidUpgrades.champagne === upgrade.id ? null : (upgrade.id as 'moet' | 'dom-perignon')
      );
    } else if (upgrade.category === 'security') {
      store.toggleSecurityEscort();
    }
  };

  return (
    <div
      className='relative group cursor-pointer'
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={handleToggle}
    >
      {/* Upgrade Card */}
      <div
        className='p-3 rounded-xl backdrop-blur-sm transition-all duration-200 group-hover:shadow-lg'
        style={{
          backgroundColor: isSelected ? 'rgba(203,178,106,0.08)' : 'rgba(203,178,106,0.03)',
          border: isSelected
            ? '1px solid rgba(203,178,106,0.15)'
            : '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(16px)',
          boxShadow: isSelected
            ? 'inset 0 1px 0 rgba(255,255,255,0.05), 0 0 15px rgba(203,178,106,0.25)'
            : 'inset 0 1px 0 rgba(255,255,255,0.05), 0 6px 20px rgba(0,0,0,0.25)',
        }}
      >
        {/* Content - Horizontal Layout */}
        <div className='flex items-center gap-3'>
          {/* Icon Container */}
          <div
            className='w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110'
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

          {/* Title & Price */}
          <div className='flex-1 flex items-center justify-between'>
            <div>
              <h4 className='text-white font-medium text-sm leading-tight tracking-wide'>
                {title}
              </h4>
            </div>
            <div>
              <span className='text-yellow-400 font-semibold text-sm'>
                {currency}
                {price}
              </span>
            </div>
          </div>

          {/* Selected Indicator */}
          {isSelected && (
            <div className='w-4 h-4 bg-purple-400 rounded-full flex items-center justify-center'>
              <Wine className='w-2.5 h-2.5 text-black' />
            </div>
          )}
        </div>
      </div>

      {/* Floating Tooltip */}
      {showTooltip && (
        <div className='absolute bottom-full left-1/2 -translate-x-1/2 mb-4 z-50 w-56 pointer-events-none'>
          <div
            className='relative p-4 rounded-2xl shadow-2xl'
            style={{
              background: 'rgba(15,15,15,0.95)',
              border: '1px solid rgba(255,255,255,0.06)',
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

              <div className='flex items-center justify-between pt-1'>
                <div className='flex items-center gap-1.5'>
                  <Wine className='w-3 h-3 text-purple-400' />
                  <span className='text-purple-300 text-xs font-medium'>Premium Upgrade</span>
                </div>
                <span className='text-yellow-400 text-xs font-medium'>
                  {currency}
                  {price}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export type { PaidUpgradesCardV2Props };
export default PaidUpgradesCardV2;
