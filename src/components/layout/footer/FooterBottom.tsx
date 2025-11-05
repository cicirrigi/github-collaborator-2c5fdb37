'use client';

import type React from 'react';

import { cn } from '@/lib/utils/cn';

import type { FooterConfig } from './footer.config';

export interface FooterBottomProps {
  /** Legal data from config */
  readonly legal: FooterConfig['legal'];
  /** Custom styling */
  readonly className?: string;
}

/**
 * ⚖️ FooterBottom - Copyright and legal section
 * - Copyright with dynamic year
 * - Company registration info
 * - Responsive layout
 * - Design tokens integration
 * - Zero hardcoded content
 */
export function FooterBottom({ legal, className }: FooterBottomProps): React.JSX.Element {
  return (
    <div className={cn('py-6 relative', className)}>
      {/* Golden separator line - elegant gradient */}
      <div
        className='absolute top-0 left-0 right-0'
        style={{
          height: '1px',
          background: `linear-gradient(to right, transparent, var(--brand-primary), transparent)`,
          opacity: 0.6,
        }}
      />

      <div className='flex flex-col items-center justify-center gap-4'>
        {/* Copyright - centered */}
        <div className='text-center'>
          <p
            className='text-sm transition-colors duration-200'
            style={{ color: 'var(--text-secondary)' }}
          >
            {legal.copyright}
          </p>
          <p
            className='text-xs transition-colors duration-200'
            style={{ color: 'var(--text-muted)' }}
          >
            {legal.company} • {legal.registration}
          </p>
        </div>

        {/* Sitemap link - centered below */}
        <div className='flex gap-6 text-sm'>
          <a
            href='/sitemap'
            className='transition-colors duration-200 hover:text-[var(--brand-primary)]'
            style={{ color: 'var(--text-muted)' }}
          >
            Sitemap
          </a>
        </div>
      </div>
    </div>
  );
}
