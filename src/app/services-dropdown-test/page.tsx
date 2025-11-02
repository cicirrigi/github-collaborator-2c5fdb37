/**
 * 🚗 Services Dropdown Test Page
 *
 * Preview noul dropdown cu 2 coloane pentru servicii
 */

import { mainMenu } from '@/components/ui/navigation/menu.config';

export default function ServicesDropdownTestPage() {
  const servicesMenu = mainMenu.find(item => item.label === 'Services');

  return (
    <div className='min-h-screen p-16'>
      <div className='max-w-4xl mx-auto'>
        <div className='text-center mb-16'>
          <h1 className='text-4xl font-bold mb-4 text-[var(--text-primary)]'>
            🚗 Services Dropdown - 2 Coloane
          </h1>
          <p className='text-[var(--text-secondary)]'>
            Noul dropdown cu serviciile extinse în 2 coloane
          </p>
        </div>

        {/* Services List */}
        <div className='mb-16'>
          <h2 className='text-2xl font-semibold text-[var(--brand-primary)] mb-8 text-center'>
            📋 Lista Serviciilor ({servicesMenu?.children?.length} total)
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {servicesMenu?.children?.map((service, index) => (
              <div
                key={service.href}
                className='flex items-center gap-3 p-3 rounded-lg border border-[var(--border-subtle)] hover:border-[var(--brand-primary-30)] transition-colors'
              >
                {service.icon && (
                  <service.icon size={20} className='text-[var(--brand-primary)] flex-shrink-0' />
                )}
                <div className='flex-1'>
                  <div className='font-medium text-[var(--text-primary)]'>{service.label}</div>
                  <div className='text-xs text-[var(--text-muted)]'>{service.href}</div>
                </div>
                <div className='text-xs text-[var(--text-secondary)]'>#{index + 1}</div>
              </div>
            )) ?? []}
          </div>
        </div>

        {/* Layout Preview */}
        <div className='bg-[var(--background-elevated)] p-8 rounded-xl border border-[var(--border-subtle)]'>
          <h3 className='text-xl font-semibold text-[var(--brand-primary)] mb-6 text-center'>
            📐 Layout Simulation (2 Columns)
          </h3>

          <div className='max-w-md mx-auto p-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--background)]'>
            <div className='grid grid-cols-2 gap-0'>
              {servicesMenu?.children?.map((service, index) => (
                <div
                  key={service.href}
                  className='flex items-center gap-2 px-3 py-2 text-sm hover:bg-[var(--brand-primary)]/10 transition-colors'
                >
                  {service.icon && (
                    <service.icon size={16} className='text-[var(--brand-primary)]' />
                  )}
                  <span className='text-[var(--text-primary)] text-xs'>{service.label}</span>
                </div>
              )) ?? []}
            </div>
          </div>
        </div>

        {/* Implementation Details */}
        <div className='mt-16 text-center'>
          <div className='inline-block p-6 rounded-xl bg-[var(--brand-primary-05)] border border-[var(--brand-primary-20)]'>
            <h3 className='text-lg font-semibold text-[var(--brand-primary)] mb-4'>
              ⚙️ Implementation Details
            </h3>
            <div className='space-y-2 text-sm text-[var(--text-secondary)] text-left'>
              <div>
                <strong>Trigger:</strong> {servicesMenu?.children?.length}+ items → 2 columns
              </div>
              <div>
                <strong>Width:</strong> min-w-96 (large) vs min-w-56 (normal)
              </div>
              <div>
                <strong>Grid:</strong> grid-cols-2 cu gap-0
              </div>
              <div>
                <strong>Theme:</strong> CSS variables pentru light/dark mode
              </div>
              <div>
                <strong>Icons:</strong> Building2, Heart, Users, Camera
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
