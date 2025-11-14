/**
 * 🔗 Footer Updated Test Page
 *
 * Preview footer cu linkurile reale din navbar-ul vechi
 */

import { FooterIcon } from '@/components/ui/FooterIcon';
import { footerConfig } from '@/components/layout/footer/footer.config';

export default function FooterUpdatedTestPage() {
  return (
    <div className='min-h-screen p-16'>
      <div className='max-w-6xl mx-auto'>
        <div className='text-center mb-16'>
          <h1 className='text-4xl font-bold mb-4 text-[var(--text-primary)]'>
            🔗 Footer Updated - Real Links
          </h1>
          <p className='text-[var(--text-secondary)]'>
            Footer cu linkurile reale din navbar vechiu + icoane semantic
          </p>
        </div>

        {/* Comparison */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16'>
          {/* Old Structure */}
          <div className='p-6 rounded-xl border border-[var(--border-subtle)]'>
            <h3 className='text-xl font-semibold text-[var(--brand-primary)] mb-4'>
              🏛️ Navbar Vechi (Sursă)
            </h3>
            <div className='space-y-3 text-sm text-[var(--text-secondary)]'>
              <div>
                📍 <strong>Home:</strong> /
              </div>
              <div>
                🛠️ <strong>Our Services:</strong> /services (dropdown)
              </div>
              <div>
                👥 <strong>Members:</strong> /members
              </div>
              <div>
                🏢 <strong>Corporate:</strong> /corporate
              </div>
              <div>
                🎉 <strong>Events:</strong> /events
              </div>
              <div>
                🤝 <strong>Partners:</strong> /partners
              </div>
            </div>

            <h4 className='text-lg font-medium text-[var(--text-primary)] mt-6 mb-3'>
              Services Dropdown:
            </h4>
            <div className='space-y-2 text-sm text-[var(--text-muted)]'>
              <div>✈️ Airport transfers</div>
              <div>🗺️ City-to-City rides</div>
              <div>⏰ Hourly hire</div>
              <div>👑 Limousine service</div>
            </div>
          </div>

          {/* New Footer Structure */}
          <div className='p-6 rounded-xl border border-[var(--border-subtle)]'>
            <h3 className='text-xl font-semibold text-[var(--brand-primary)] mb-4'>
              💎 Footer Nou (Rezultat)
            </h3>
            <div className='grid grid-cols-2 gap-4'>
              {footerConfig.links.map(category => (
                <div key={category.title}>
                  <h4 className='font-medium text-[var(--text-primary)] mb-2 text-sm'>
                    {category.title}
                  </h4>
                  <div className='space-y-1'>
                    {category.items.slice(0, 3).map(item => (
                      <div
                        key={item.href}
                        className='flex items-center gap-2 text-xs text-[var(--text-muted)]'
                      >
                        <FooterIcon name={item.icon} size={14} />
                        {item.label}
                      </div>
                    ))}
                    {category.items.length > 3 && (
                      <div className='text-xs text-[var(--text-muted)] opacity-60'>
                        +{category.items.length - 3} mai multe...
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Full Footer Preview */}
        <div className='bg-[var(--background-elevated)] p-8 rounded-xl border border-[var(--border-subtle)]'>
          <h3 className='text-xl font-semibold text-[var(--brand-primary)] mb-8 text-center'>
            🎯 Live Footer Preview
          </h3>

          <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
            {footerConfig.links.map(category => (
              <div key={category.title}>
                <h4 className='font-medium text-[var(--text-primary)] mb-4'>{category.title}</h4>
                <ul className='space-y-3'>
                  {category.items.map(item => (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        className='group flex items-center gap-3 text-sm transition-all duration-200 hover:text-[var(--brand-primary)]'
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        <FooterIcon
                          name={item.icon}
                          size={18}
                          className='flex-shrink-0 transition-colors duration-200'
                          style={{ color: 'var(--brand-primary)' }}
                        />
                        <span className='transition-transform duration-200 group-hover:translate-x-1'>
                          {item.label}
                        </span>
                        <svg
                          className='h-3 w-3 opacity-0 transition-all duration-200 translate-x-[-4px] group-hover:opacity-100 group-hover:translate-x-0 ml-auto'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                          style={{ color: 'var(--brand-primary)' }}
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M9 5l7 7-7 7'
                          />
                        </svg>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* URLs List */}
        <div className='mt-16'>
          <h3 className='text-xl font-semibold text-[var(--brand-primary)] mb-6 text-center'>
            📋 Toate URL-urile Implementate
          </h3>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {footerConfig.links.map(category =>
              category.items.map(item => (
                <div
                  key={item.href}
                  className='flex items-center justify-between p-3 rounded-lg border border-[var(--border-subtle)] hover:border-[var(--brand-primary-30)] transition-colors'
                >
                  <div className='flex items-center gap-3'>
                    <FooterIcon
                      name={item.icon}
                      size={16}
                      style={{ color: 'var(--brand-primary)' }}
                    />
                    <span className='font-medium text-[var(--text-primary)]'>{item.label}</span>
                  </div>
                  <code className='text-xs text-[var(--text-muted)] bg-[var(--background)] px-2 py-1 rounded'>
                    {item.href}
                  </code>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
