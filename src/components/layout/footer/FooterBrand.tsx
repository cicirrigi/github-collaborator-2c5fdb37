'use client';

import Image from 'next/image';
import Link from 'next/link';
import type React from 'react';

import { cn } from '@/lib/utils/cn';

import type { FooterConfig } from './footer.config';

export interface FooterBrandProps {
  /** Brand data from config */
  readonly brand: FooterConfig['brand'];
  /** Contact data from config */
  readonly contact: FooterConfig['contact'];
  /** Custom styling */
  readonly className?: string;
}

/**
 * 🏛️ FooterBrand - Brand identity section
 * - Logo with luxury animation
 * - Company tagline and description
 * - Contact information
 * - Design tokens integration
 * - Zero hardcoded content
 */
export function FooterBrand({ brand, contact, className }: FooterBrandProps): React.JSX.Element {
  return (
    <div className={cn('space-y-6', className)}>
      {/* Logo & Brand Name */}
      <div className='space-y-4'>
        <Link
          href='/'
          className='group inline-flex items-center gap-3 transition-transform duration-300 hover:scale-105'
        >
          <div className='relative'>
            <Image
              src={brand.logo}
              alt={`${brand.name} logo`}
              width={40}
              height={40}
              className='h-10 w-10 transition-transform duration-300 group-hover:rotate-12'
            />
            <div
              className='absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-20'
              style={{
                background: `radial-gradient(circle, var(--brand-primary) 0%, transparent 70%)`,
              }}
            />
          </div>
          <div>
            <h3
              className='text-xl font-bold transition-colors duration-200'
              style={{ color: 'var(--text-primary)' }}
            >
              {brand.name}
            </h3>
            <p
              className='text-sm transition-colors duration-200'
              style={{ color: 'var(--text-secondary)' }}
            >
              {brand.tagline}
            </p>
          </div>
        </Link>

        {/* Description */}
        <p
          className='max-w-md text-sm leading-relaxed transition-colors duration-200'
          style={{ color: 'var(--text-secondary)' }}
        >
          {brand.description}
        </p>
      </div>

      {/* Contact Information */}
      <div className='space-y-2'>
        <h4
          className='font-medium text-sm transition-colors duration-200'
          style={{ color: 'var(--text-primary)' }}
        >
          Contact
        </h4>
        <div className='space-y-1 text-sm'>
          <a
            href={`tel:${contact.phone}`}
            className='block transition-colors duration-200 hover:text-[var(--brand-primary)]'
            style={{ color: 'var(--text-secondary)' }}
          >
            {contact.phone}
          </a>
          <a
            href={`mailto:${contact.email}`}
            className='block transition-colors duration-200 hover:text-[var(--brand-primary)]'
            style={{ color: 'var(--text-secondary)' }}
          >
            {contact.email}
          </a>
          <p className='transition-colors duration-200' style={{ color: 'var(--text-secondary)' }}>
            {contact.address}
          </p>
        </div>
      </div>
    </div>
  );
}
