/**
 * 🎨 Footer Icons Test Page
 *
 * Preview all footer icons în acțiune
 */

import { FooterIcon } from '@/components/ui/FooterIcon';
import { footerConfig } from '@/components/layout/footer/footer.config';

export default function FooterIconsTestPage() {
  return (
    <div className='min-h-screen p-16'>
      <div className='max-w-4xl mx-auto'>
        <div className='text-center mb-16'>
          <h1 className='text-4xl font-bold mb-4 text-[var(--text-primary)]'>
            🎨 Footer Icons Preview
          </h1>
          <p className='text-[var(--text-secondary)]'>
            Toate icoanele semantic configurate pentru footer
          </p>
        </div>

        {/* Icons Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {footerConfig.links.map(category => (
            <div key={category.title} className='space-y-4'>
              <h3 className='text-xl font-semibold text-[var(--brand-primary)]'>
                {category.title}
              </h3>

              <div className='space-y-3'>
                {category.items.map(item => (
                  <div
                    key={item.href}
                    className='flex items-center gap-3 p-3 rounded-lg border border-[var(--border-subtle)] hover:border-[var(--brand-primary-30)] transition-colors'
                  >
                    <FooterIcon
                      name={item.icon}
                      size={20}
                      className='flex-shrink-0'
                      style={{ color: 'var(--brand-primary)' }}
                    />
                    <div>
                      <div className='font-medium text-[var(--text-primary)]'>{item.label}</div>
                      <div className='text-xs text-[var(--text-muted)]'>{item.icon}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Social Icons */}
        <div className='mt-16 text-center'>
          <h3 className='text-xl font-semibold text-[var(--brand-primary)] mb-6'>Social Icons</h3>

          <div className='flex justify-center gap-6'>
            {footerConfig.socials.map(social => (
              <div
                key={social.name}
                className='flex flex-col items-center gap-2 p-4 rounded-lg border border-[var(--border-subtle)]'
              >
                <FooterIcon
                  name={social.icon}
                  size={24}
                  style={{ color: 'var(--brand-primary)' }}
                />
                <span className='text-sm text-[var(--text-secondary)]'>{social.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Live Footer Preview */}
        <div className='mt-16'>
          <h3 className='text-xl font-semibold text-[var(--brand-primary)] mb-6 text-center'>
            Live Footer Preview
          </h3>

          <div className='bg-[var(--background-elevated)] p-8 rounded-xl border border-[var(--border-subtle)]'>
            <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
              {footerConfig.links.map(category => (
                <div key={category.title}>
                  <h4 className='font-medium text-[var(--text-primary)] mb-4'>{category.title}</h4>
                  <ul className='space-y-2'>
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
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
