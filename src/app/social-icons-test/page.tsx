/**
 * 🎨 Social Icons Test Page
 *
 * Preview noile icoane sociale: X, YouTube, TikTok
 */

import { footerConfig } from '@/components/layout/footer/footer.config';
import { FooterBrand } from '@/components/layout/footer/FooterBrand';

export default function SocialIconsTestPage() {
  return (
    <div className='min-h-screen p-16'>
      <div className='max-w-4xl mx-auto'>
        <div className='text-center mb-16'>
          <h1 className='text-4xl font-bold mb-4 text-[var(--text-primary)]'>
            🎨 Social Icons Updated
          </h1>
          <p className='text-[var(--text-secondary)]'>
            Noile icoane sociale: Twitter → X, plus YouTube și TikTok
          </p>
        </div>

        {/* Icons List */}
        <div className='mb-16'>
          <h2 className='text-2xl font-semibold text-[var(--brand-primary)] mb-8 text-center'>
            📋 Lista Iconițelor Sociale
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {footerConfig.socials.map((social, index) => (
              <div
                key={social.name}
                className='flex items-center gap-4 p-4 rounded-lg border border-[var(--border-subtle)] hover:border-[var(--brand-primary-30)] transition-colors'
              >
                <div className='w-8 h-8 flex items-center justify-center'>
                  {/* Icon preview placeholder */}
                  <div
                    className='w-6 h-6 rounded bg-[var(--brand-primary)]'
                    style={{
                      opacity: 0.8,
                    }}
                  />
                </div>
                <div>
                  <div className='font-medium text-[var(--text-primary)]'>{social.name}</div>
                  <div className='text-xs text-[var(--text-muted)]'>{social.icon}</div>
                </div>
                <div className='ml-auto'>
                  <a
                    href={social.href}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-xs text-[var(--brand-primary)] hover:underline'
                  >
                    Visit →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Preview */}
        <div className='bg-[var(--background-elevated)] p-8 rounded-xl border border-[var(--border-subtle)]'>
          <h3 className='text-xl font-semibold text-[var(--brand-primary)] mb-6 text-center'>
            🎯 Live Footer Preview
          </h3>

          <div className='max-w-sm mx-auto'>
            <FooterBrand brand={footerConfig.brand} socials={footerConfig.socials} />
          </div>
        </div>

        {/* Changes Summary */}
        <div className='mt-16 text-center'>
          <div className='inline-block p-6 rounded-xl bg-[var(--brand-primary-05)] border border-[var(--brand-primary-20)]'>
            <h3 className='text-lg font-semibold text-[var(--brand-primary)] mb-4'>
              ✅ Modificări Implementate
            </h3>
            <div className='space-y-2 text-sm text-[var(--text-secondary)]'>
              <div>
                <strong>❌ Twitter</strong> →{' '}
                <strong className='text-[var(--brand-primary)]'>✅ X</strong> (icoană custom)
              </div>
              <div>
                <strong className='text-green-600'>+ YouTube</strong> (Lucide React)
              </div>
              <div>
                <strong className='text-green-600'>+ TikTok</strong> (icoană custom)
              </div>
              <div>
                Total icoane:{' '}
                <strong className='text-[var(--brand-primary)]'>
                  {footerConfig.socials.length}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
