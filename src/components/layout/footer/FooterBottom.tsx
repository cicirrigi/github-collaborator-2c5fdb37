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
    <div
      className={cn('border-t py-6', className)}
      style={{ borderTopColor: 'var(--border-subtle)' }}
    >
      <div className='flex flex-col items-center justify-between gap-4 md:flex-row'>
        {/* Location */}
        <div className='text-center md:text-left'>
          <p
            className='text-sm font-medium transition-colors duration-200'
            style={{ color: 'var(--text-primary)' }}
          >
            {legal.location}
          </p>
        </div>

        {/* Copyright */}
        <div className='text-center md:text-right'>
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
      </div>
    </div>
  );
}
