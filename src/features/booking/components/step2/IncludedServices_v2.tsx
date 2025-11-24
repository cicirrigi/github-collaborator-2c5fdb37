'use client';

import { Check } from 'lucide-react';
import { useState } from 'react';
import { INCLUDED_SERVICES, type IncludedService } from './service-config';

interface IncludedServicesV2Props {
  className?: string;
}

export function IncludedServicesV2({ className = '' }: IncludedServicesV2Props) {
  return (
    <section className={`space-y-3 ${className}`}>
      {/* 🎯 Compact Header */}
      <div className='flex items-center gap-2'>
        <Check className='w-4 h-4 text-yellow-400' />
        <h3 className='text-white font-medium text-base'>Included Services</h3>
        <span className='text-yellow-200/50 text-xs'>({INCLUDED_SERVICES.length})</span>
      </div>

      {/* 🟨 Compact Grid - 8 servicii (4 și 4) */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
        {INCLUDED_SERVICES.map(service => (
          <CompactServiceCard key={service.id} service={service} />
        ))}
      </div>
    </section>
  );
}

// 🎁 Compact Service Card with Tooltip
interface CompactServiceCardProps {
  service: IncludedService;
}

function CompactServiceCard({ service }: CompactServiceCardProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const { icon: Icon, title, description } = service;

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
          backgroundColor: 'rgba(255,255,255,0.05)',
          border: 'none',
          backdropFilter: 'blur(16px)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), 0 6px 20px rgba(0,0,0,0.25)',
        }}
      >
        {/* 🎯 Content */}
        <div className='text-center space-y-2'>
          {/* Icon - Background gri negricios fără border */}
          <div
            className='mx-auto w-8 h-8 rounded-lg flex items-center justify-center'
            style={{
              backgroundColor: 'rgba(60,60,60,0.8)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)',
            }}
          >
            <Icon className='w-5 h-5' style={{ color: '#CBB26A' }} />
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
      </div>

      {/* 🔍 Hover Tooltip - Modern Info */}
      {showTooltip && (
        <div className='absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50 w-48'>
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
                <Check className='w-3 h-3 text-green-400' />
                <span className='text-green-300 text-xs font-medium'>Included</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 🔧 Export
export type { IncludedServicesV2Props };
