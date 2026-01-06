'use client';

import { PAID_UPGRADES } from '@/features/booking/components/step2/service-config';
import { useBookingState } from '@/hooks/useBookingState';
import { Flower, Gift, ShieldCheck, Wine } from 'lucide-react';

/**
 * 🎁 SERVICES SUMMARY CARD - Step 3 Component
 *
 * Displays Step 2 service selections:
 * - Trip preferences (music, temperature, communication)
 * - Paid upgrades with pricing
 * - Included services (compact display)
 *
 * Uses design tokens and Zustand store
 * Modular architecture, max 200 lines
 */
export function ServicesSummaryCard() {
  const { tripConfiguration, calculateUpgradesCost } = useBookingState();
  const { servicePackages } = tripConfiguration;
  const { tripPreferences, paidUpgrades } = servicePackages;

  const totalUpgradesCost = calculateUpgradesCost();
  const hasUpgrades = totalUpgradesCost > 0;
  const hasPreferences =
    tripPreferences.music !== 'no-preference' ||
    tripPreferences.temperature !== 'comfortable' ||
    tripPreferences.communication !== 'professional';

  // Get upgrade details
  const upgradeDetails = [];
  if (paidUpgrades.flowers) {
    const upgrade = PAID_UPGRADES.find(
      u => u.category === 'flowers' && u.id === paidUpgrades.flowers
    );
    if (upgrade) {
      upgradeDetails.push({
        name: upgrade.title,
        price: upgrade.price,
        icon: Flower,
      });
    }
  }
  if (paidUpgrades.champagne) {
    const upgrade = PAID_UPGRADES.find(
      u => u.category === 'champagne' && u.id === paidUpgrades.champagne
    );
    if (upgrade) {
      upgradeDetails.push({
        name: upgrade.title,
        price: upgrade.price,
        icon: Wine,
      });
    }
  }
  if (paidUpgrades.securityEscort) {
    const upgrade = PAID_UPGRADES.find(u => u.category === 'security');
    if (upgrade) {
      upgradeDetails.push({
        name: upgrade.title,
        price: upgrade.price,
        icon: ShieldCheck,
      });
    }
  }

  if (!hasUpgrades && !hasPreferences) {
    return (
      <div className='vl-card-flex'>
        <div className='text-center py-6'>
          <Gift className='w-8 h-8 text-neutral-500 mx-auto mb-2' />
          <p className='text-neutral-400 text-sm'>No additional services selected</p>
        </div>
      </div>
    );
  }

  return (
    <div className='vl-card-flex'>
      {/* Header */}
      <div className='flex items-center gap-3 mb-5'>
        <div className='flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-600/20 backdrop-blur-sm border border-purple-500/20'>
          <Gift className='w-5 h-5 text-purple-400' />
        </div>
        <div>
          <h3 className='text-lg font-semibold tracking-wide text-white'>Services Summary</h3>
          <p className='text-purple-200/50 text-xs'>Selected services & preferences</p>
        </div>
      </div>

      {/* Content */}
      <div className='vl-card-inner'>
        <div className='space-y-4'>
          {/* Trip Preferences */}
          {hasPreferences && (
            <div className='space-y-3'>
              <h4 className='text-sm font-medium text-neutral-300'>Trip Preferences</h4>
              <div className='space-y-2 text-sm'>
                {tripPreferences.music !== 'no-preference' && (
                  <div className='flex items-center justify-between'>
                    <span className='text-neutral-400'>Music</span>
                    <span className='text-white capitalize'>
                      {tripPreferences.music.replace('-', ' ')}
                    </span>
                  </div>
                )}
                {tripPreferences.temperature !== 'comfortable' && (
                  <div className='flex items-center justify-between'>
                    <span className='text-neutral-400'>Temperature</span>
                    <span className='text-white capitalize'>{tripPreferences.temperature}</span>
                  </div>
                )}
                {tripPreferences.communication !== 'professional' && (
                  <div className='flex items-center justify-between'>
                    <span className='text-neutral-400'>Communication</span>
                    <span className='text-white capitalize'>{tripPreferences.communication}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Paid Upgrades */}
          {hasUpgrades && (
            <div className='space-y-3'>
              {hasPreferences && <div className='border-t border-white/10 pt-4' />}
              <div className='flex items-center justify-between'>
                <h4 className='text-sm font-medium text-neutral-300'>Premium Upgrades</h4>
                <span className='text-amber-400 font-semibold'>+£{totalUpgradesCost}</span>
              </div>
              <div className='space-y-3'>
                {upgradeDetails.map((upgrade, index) => {
                  const IconComponent = upgrade.icon;
                  return (
                    <div key={index} className='flex items-center gap-3'>
                      <div className='flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20'>
                        <IconComponent className='w-4 h-4 text-amber-400' />
                      </div>
                      <div className='flex-1'>
                        <div className='flex items-center justify-between'>
                          <span className='text-white text-sm font-medium'>{upgrade.name}</span>
                          <span className='text-amber-400 text-sm font-medium'>
                            +£{upgrade.price}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Included Services (Compact) */}
          <div className='pt-3 border-t border-white/10'>
            <div className='flex items-center gap-2 mb-2'>
              <div className='w-2 h-2 rounded-full bg-emerald-400'></div>
              <span className='text-emerald-400 text-xs font-medium'>
                INCLUDED AT NO EXTRA COST
              </span>
            </div>
            <p className='text-neutral-400 text-xs leading-relaxed'>
              Complimentary WiFi, bottled water, phone charger, climate control, and professional
              chauffeur service.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
