'use client';

import { INCLUDED_SERVICES, type IncludedService } from './service-config';

interface IncludedServicesProps {
  className?: string;
}

export function IncludedServices({ className = '' }: IncludedServicesProps) {
  return (
    <section className={`space-y-4 ${className}`}>
      {/* 🎯 Header */}
      <div className='flex items-center gap-2'>
        <h3 className='text-white font-medium text-lg'>✅ Included Services</h3>
        <span className='text-amber-200/60 text-sm'>({INCLUDED_SERVICES.length} services)</span>
      </div>

      {/* 🟦 Services Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {INCLUDED_SERVICES.map(service => (
          <IncludedServiceCard key={service.id} service={service} />
        ))}
      </div>
    </section>
  );
}

// 🎁 Individual Service Card Component
interface ServiceCardProps {
  service: IncludedService;
}

function IncludedServiceCard({ service }: ServiceCardProps) {
  const { icon: Icon, title, description } = service;

  return (
    <div className='group relative p-4 rounded-xl border border-green-500/20 bg-green-500/5 hover:bg-green-500/10 hover:border-green-500/30 transition-all duration-200'>
      {/* 🏷️ Included Badge */}
      <div className='absolute top-2 right-2 px-2 py-1 rounded-md text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30'>
        Included
      </div>

      {/* 🎯 Content */}
      <div className='flex items-start gap-3 pr-16'>
        {/* Icon */}
        <div className='flex-shrink-0 w-10 h-10 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center'>
          <Icon className='w-5 h-5 text-green-400' />
        </div>

        {/* Text Content */}
        <div className='flex-1 min-w-0'>
          <h4 className='text-white font-medium text-sm mb-1 leading-tight'>{title}</h4>
          <p className='text-amber-200/70 text-xs leading-relaxed'>{description}</p>
        </div>
      </div>

      {/* 🎨 Hover Effect Overlay */}
      <div className='absolute inset-0 rounded-xl bg-gradient-to-r from-green-500/0 via-green-500/5 to-green-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none' />
    </div>
  );
}

// 🔧 Export for external use
export type { IncludedServicesProps };
