'use client';

import { Check } from 'lucide-react';
import { useState } from 'react';
import { INCLUDED_SERVICES, type IncludedService } from './service-config';

interface IncludedServicesCardV2Props {
  className?: string;
}

export function IncludedServicesCardV2({ className = '' }: IncludedServicesCardV2Props) {
  const availableServices = INCLUDED_SERVICES;

  return (
    <div className={className}>
      <div
        className='
          relative
          p-5
          rounded-3xl
          transition-all
          duration-300
          bg-black/40
        '
        style={{
          background: 'linear-gradient(145deg, rgba(10,10,10,0.65), rgba(15,15,15,0.55))',
          border: '1px solid rgba(203,178,106,0.35)',
          backdropFilter: 'blur(22px)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), 0 10px 40px rgba(0,0,0,0.55)',
        }}
      >
        {/* HEADER */}
        <div className='flex items-center gap-3 mb-5'>
          <div
            className='w-9 h-9 rounded-xl flex items-center justify-center shadow-lg'
            style={{
              background:
                'conic-gradient(from 210deg at 50% 50%, rgba(203,178,106,0.25), rgba(203,178,106,0.1), rgba(203,178,106,0.25))',
              boxShadow: '0 0 15px rgba(203,178,106,0.25)',
            }}
          >
            <Check className='w-5 h-5' style={{ color: '#CBB26A' }} />
          </div>

          <div>
            <h3 className='text-white font-semibold text-lg tracking-wide'>Included Services</h3>
            <p className='text-amber-200/50 text-xs'>Included at no extra cost</p>
          </div>
        </div>

        {/* ICON GRID - ORIGINAL DESIGN */}
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
          {availableServices.map(service => (
            <ServiceIcon key={service.id} service={service} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------------------ */
/* ICON COMPONENT — IDENTIC CU ORIGINALUL */
/* ------------------------------------------------------------------------------------ */

interface ServiceIconProps {
  service: IncludedService;
}

function ServiceIcon({ service }: ServiceIconProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const { icon: Icon, title, description } = service;

  return (
    <div
      className='relative group cursor-pointer'
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className='flex flex-col items-center space-y-2'>
        <div
          className='w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110'
          style={{
            background: 'linear-gradient(145deg, rgba(35,35,35,0.85), rgba(12,12,12,0.95))',
            border: '1px solid rgba(203,178,106,0.25)',
            boxShadow: '0 0 12px rgba(203,178,106,0.15), inset 0 0 6px rgba(0,0,0,0.6)',
          }}
        >
          <Icon className='w-5 h-5' style={{ color: '#CBB26A' }} />
        </div>

        <span className='text-white/90 font-medium text-xs leading-tight text-center'>{title}</span>
      </div>

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

export type { IncludedServicesCardV2Props };
export default IncludedServicesCardV2;
