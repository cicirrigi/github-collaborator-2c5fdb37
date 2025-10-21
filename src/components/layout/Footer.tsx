'use client';

import Link from 'next/link';
import type React from 'react';

import { brandConfig } from '@/config/brand.config';
import { footer } from '@/config/site.config';
import { cn } from '@/lib/utils/cn';

import { Container } from './Container';
import { Logo } from './navbar/Logo';

/**
 * 🦶 Premium Footer for Vantage Lane 2.0
 *
 * Features:
 * - Multi-column responsive layout
 * - Gradient luxury background
 * - Gold hover underline animations
 * - Theme-aware (dark/light)
 * - SEO microdata for Organization
 * - Accessible & sub 250 lines
 */

export interface FooterProps {
  readonly className?: string;
}

// Use config instead of hardcoded values
const footerSections = footer.sections;
const socialLinks = footer.social;

export default function Footer({ className }: FooterProps): React.JSX.Element {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      itemScope
      itemType='http://schema.org/Organization'
      className={cn(
        'relative overflow-hidden border-t transition-colors duration-300 ease-in-out',
        // Theme-aware backgrounds
        'bg-white dark:bg-gradient-to-b dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950',
        'before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_at_top,rgba(203,178,106,0.05),transparent_70%)]',
        'border-neutral-200 text-neutral-700 dark:border-neutral-800 dark:text-neutral-300',
        className
      )}
    >
      <Container size='xl' className='border-b border-brand-primary/10 py-16'>
        <div
          className='grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-8 lg:grid-cols-5 lg:gap-12'
          aria-label='Footer navigation'
        >
          {/* Brand column */}
          <div className='lg:col-span-2'>
            <Logo size='lg' className='mb-6' />
            <p className='max-w-md text-sm leading-relaxed text-neutral-400 dark:text-neutral-500'>
              {brandConfig.service.full}. {brandConfig.service.detailed}.
            </p>

            {/* Social icons */}
            <div className='mt-6 flex items-center gap-4'>
              {socialLinks.map(s => (
                <Link
                  key={s.href}
                  href={s.href}
                  target='_blank'
                  rel='noopener noreferrer nofollow'
                  className={cn(
                    'text-neutral-400 transition-colors duration-300 hover:text-brand-primary',
                    'rounded-sm hover:drop-shadow-[0_0_4px_rgba(203,178,106,0.6)] focus:outline-none focus:ring-2 focus:ring-brand-primary/50'
                  )}
                  aria-label={`Follow us on ${s.label}`}
                >
                  {s.icon === 'twitter' && (
                    <svg
                      className='h-5 w-5'
                      fill='currentColor'
                      viewBox='0 0 24 24'
                      aria-hidden='true'
                    >
                      <path d='M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84' />
                    </svg>
                  )}
                  {/* Add other social icons if needed */}
                </Link>
              ))}
            </div>
          </div>

          {/* Footer link sections */}
          {footerSections.map(section => (
            <div key={section.title}>
              <h3 className='mb-3 text-base font-semibold text-white dark:text-brand-primary/80 md:mb-4'>
                {section.title}
              </h3>
              <ul className='space-y-3'>
                {section.links.map(link => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        'group relative text-neutral-400 hover:text-brand-primary',
                        'rounded-sm text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-primary/50'
                      )}
                    >
                      {link.label}
                      {/* underline hover effect */}
                      <span className='absolute bottom-0 left-0 h-[1px] w-0 bg-brand-primary/60 transition-all duration-300 group-hover:w-full' />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className='mt-12 border-t border-neutral-800 pt-8'>
          <div className='flex flex-col items-center justify-between gap-4 md:flex-row'>
            <div className='text-sm text-neutral-400 dark:text-brand-primary/90'>
              &copy; {currentYear} {brandConfig.legal.copyright}
            </div>

            <div className='flex items-center gap-6 text-sm'>
              {['/privacy', '/terms', '/cookies'].map((href, i) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'group relative text-neutral-400 transition-all duration-300 hover:text-brand-primary',
                    'rounded-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/50'
                  )}
                >
                  {
                    [brandConfig.legal.privacy, brandConfig.legal.terms, brandConfig.legal.cookies][
                      i
                    ]
                  }
                  <span className='absolute bottom-0 left-0 h-[1px] w-0 bg-brand-primary/60 transition-all duration-300 group-hover:w-full' />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
