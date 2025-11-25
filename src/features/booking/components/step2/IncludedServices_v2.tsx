'use client';

import { Check } from 'lucide-react';
import { useState } from 'react';
import { INCLUDED_SERVICES, type IncludedService } from './service-config';
// 🔮 Future Zustand Integration Imports
// import { useBookingState } from '@/hooks/useBookingState';

interface IncludedServicesV2Props {
  className?: string;
}

export function IncludedServicesV2({ className = '' }: IncludedServicesV2Props) {
  // 🔮 ZUSTAND INTEGRATION READY - Architecture matches PremiumFeaturesCardV2
  // Uncomment when integrating:
  // const bookingStore = useBookingState();
  // const { tripConfiguration } = bookingStore;

  // Dynamic services - ready for Zustand filtering/selection (no hardcoding)
  const availableServices = INCLUDED_SERVICES;

  // 🔮 Future: Filter services based on booking configuration or vehicle category
  // const filteredServices = availableServices.filter(service =>
  //   isServiceAvailable(service, tripConfiguration)
  // );

  return (
    <section className={`space-y-3 ${className}`}>
      {/* 🎯 Compact Header */}
      <div className='flex items-center gap-2'>
        <Check className='w-4 h-4 text-yellow-400' />
        <h3 className='text-white font-medium text-base'>Included Services</h3>
      </div>

      {/* 🎨 Modern Compact Frame - Dynamic services layout */}
      <div
        className='relative p-2.5 rounded-3xl backdrop-blur-sm'
        style={{
          backgroundColor: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(203,178,106,0.15)',
          backdropFilter: 'blur(20px)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), 0 8px 32px rgba(0,0,0,0.15)',
        }}
      >
        <ServicesLayout services={availableServices} />
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────── */
/*                    Modular Layout Component             */
/* ─────────────────────────────────────────────────────── */
interface ServicesLayoutProps {
  services: IncludedService[];
}

function ServicesLayout({ services }: ServicesLayoutProps) {
  return (
    <div className='block'>
      {/* Mobile: Compact badges */}
      <div className='flex flex-wrap gap-1.5 md:hidden'>
        {services.map(service => (
          <MobileBadge key={service.id} service={service} />
        ))}
      </div>

      {/* Desktop: Card layout - dynamic grid based on services count */}
      <div className='hidden md:flex flex-wrap justify-between items-start gap-2'>
        {services.map(service => (
          <CompactServiceCard key={service.id} service={service} />
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────── */
/*                    Mobile Badge Component               */
/* ─────────────────────────────────────────────────────── */
interface MobileBadgeProps {
  service: IncludedService;
}

function MobileBadge({ service }: MobileBadgeProps) {
  const { icon: Icon, title } = service;

  return (
    <div className='flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/5 border border-white/10'>
      <Icon className='w-3 h-3 text-yellow-400/80' />
      <span className='text-white/70 text-xs font-medium'>{title}</span>
    </div>
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
      className='relative group flex-1 min-w-0'
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* 🎨 Single Row Card - Original Size */}
      <div className='relative p-2.5 transition-all duration-300 cursor-pointer group-hover:scale-105'>
        {/* 🎯 Vertical Layout - Icon + Text */}
        <div className='flex flex-col items-center space-y-1.5'>
          {/* Icon Container - Same gradient as vehicles */}
          <div className='mx-auto w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 group-hover:shadow-lg bg-gradient-to-br from-stone-700 to-stone-950'>
            <Icon className='w-5 h-5' style={{ color: '#CBB26A' }} />
          </div>

          {/* Title - Full text visible */}
          <span className='text-white/90 font-medium text-xs leading-tight text-center line-clamp-2 max-w-full'>
            {title}
          </span>
        </div>

        {/* 🌟 Subtle Hover Glow - Fără chenar */}
        <div
          className='absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300'
          style={{
            background: 'radial-gradient(circle, rgba(203,178,106,0.08) 0%, transparent 70%)',
            filter: 'blur(8px)',
          }}
        />
      </div>

      {/* 🔍 Hover Tooltip - Informație completă */}
      {showTooltip && (
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

            {/* Content */}
            <div className='space-y-2.5'>
              {/* Header */}
              <div className='flex items-center gap-2 pb-1 border-b border-white/10'>
                <Icon className='w-4 h-4 text-yellow-400' />
                <h5 className='text-white font-semibold text-sm'>{title}</h5>
              </div>

              {/* Description */}
              <p className='text-yellow-200/90 text-xs leading-relaxed'>{description}</p>

              {/* Included Badge */}
              <div className='flex items-center gap-1.5 pt-1'>
                <Check className='w-3 h-3 text-green-400' />
                <span className='text-green-300 text-xs font-medium'>Always Included</span>
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
