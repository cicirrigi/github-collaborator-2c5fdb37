'use client';

import { useState } from 'react';
import type { PaidUpgrade } from './service-config';
import { UPGRADE_NOTES, formatNoticeText } from './upgrade-notes';

// 💎 Premium Upgrade Card Component
export interface UpgradeCardProps {
  upgrade: PaidUpgrade;
  isSelected: boolean;
  onSelect: () => void;
  isFullWidth?: boolean;
}

export function UpgradeCard({
  upgrade,
  isSelected,
  onSelect,
  isFullWidth = false,
}: UpgradeCardProps) {
  const { icon: Icon, title, description, price, currency } = upgrade;
  const [showTooltip, setShowTooltip] = useState(false);

  // Get upgrade note (identic cu IncludedServices)
  const upgradeNote = UPGRADE_NOTES[upgrade.id];

  return (
    <div
      onClick={onSelect}
      className={`relative group cursor-pointer transition-all duration-200 ${isFullWidth ? 'w-full' : ''}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* 🎨 Ultra Compact Card */}
      <div
        className='relative p-2 rounded-2xl transition-all duration-200 group-hover:scale-[1.02]'
        style={{
          backgroundColor: isSelected ? 'rgba(203,178,106,0.1)' : 'rgba(255,255,255,0.03)',
          border: `1px solid ${isSelected ? 'rgba(203,178,106,0.4)' : 'rgba(255,255,255,0.08)'}`,
          backdropFilter: 'blur(12px)',
        }}
      >
        {/* 🎯 Content */}
        <div
          className={`${isFullWidth ? 'flex items-center justify-between' : 'text-center space-y-2'}`}
        >
          {/* Icon & Title */}
          <div className={`${isFullWidth ? 'flex items-center gap-2' : 'space-y-1.5'}`}>
            <div className='w-8 h-8 rounded-lg flex items-center justify-center mx-auto bg-gradient-to-br from-stone-700 to-stone-950'>
              <Icon className='w-5 h-5' style={{ color: '#CBB26A' }} />
            </div>

            <div className={isFullWidth ? 'flex-1' : 'text-center'}>
              <h5 className='text-white font-medium text-xs leading-tight'>{title}</h5>
              <p className='text-amber-200/70 text-xs mt-0.5 line-clamp-2'>{description}</p>
            </div>
          </div>

          {/* Price */}
          <div className={`${isFullWidth ? '' : 'mt-1.5'}`}>
            <div className='flex items-center justify-center gap-1'>
              <span className='text-yellow-400 font-semibold text-sm'>
                {currency}
                {price}
              </span>
              {isSelected && (
                <div className='w-3 h-3 rounded-full bg-yellow-400 flex items-center justify-center'>
                  <div className='w-1 h-1 bg-black rounded-full' />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 🔍 Hover Tooltip - Identic cu IncludedServices */}
      {showTooltip && upgradeNote && (
        <div className='absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 z-50 w-52 pointer-events-none'>
          <div
            className='relative bg-black/95 backdrop-blur-sm rounded-2xl p-3 shadow-2xl border'
            style={{
              borderColor: 'rgba(203,178,106,0.3)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5), 0 0 20px rgba(203,178,106,0.1)',
            }}
          >
            {/* Tooltip Arrow */}
            <div
              className='absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0'
              style={{
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderTop: '6px solid rgba(0,0,0,0.95)',
              }}
            />

            {/* Content - identic cu IncludedServices */}
            <div className='space-y-2.5'>
              {/* Header */}
              <div className='flex items-center gap-2 pb-1 border-b border-white/10'>
                <Icon className='w-4 h-4 text-yellow-400' />
                <h5 className='text-white font-semibold text-sm'>{title}</h5>
              </div>

              {/* Notice Message */}
              <p className='text-yellow-200/90 text-xs leading-relaxed'>
                {formatNoticeText(upgradeNote)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
