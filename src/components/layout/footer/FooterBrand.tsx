'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import type React from 'react';
import { memo } from 'react';

import { cn } from '@/lib/utils/cn';
import { useThemeTokens } from '@/hooks/useThemeTokens';

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
 * - Motion animations & memoized
 */
const FooterBrand = memo(function FooterBrand({
  brand,
  contact,
  className,
}: FooterBrandProps): React.JSX.Element {
  const tokens = useThemeTokens();
  return (
    <motion.div
      className={cn('space-y-6', className)}
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: tokens.motion.easing.ease }}
      viewport={{ once: true }}
    >
      {/* Logo & Brand Name */}
      <div className='space-y-4'>
        <Link
          href='/'
          className='group inline-flex items-center gap-3 transition-transform hover:scale-105'
          style={{ transitionDuration: tokens.motion.duration.normal }}
        >
          <motion.div
            className='relative'
            whileHover={{ rotate: 12 }}
            transition={{ duration: 0.3 }}
          >
            <Image
              src={brand.logo}
              alt={`${brand.name} logo`}
              width={48}
              height={48}
              className='h-12 w-12'
            />
            <motion.div
              className='absolute inset-0 rounded-full'
              style={{
                background: `radial-gradient(circle, ${tokens.colors.brand.primary} 0%, transparent 70%)`,
              }}
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 0.2 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
          <div>
            {/* Brand Text with same styling as Navbar */}
            <div
              className='text-xl font-bold tracking-tight transition-colors'
              style={{ transitionDuration: tokens.motion.duration.fast }}
            >
              <span style={{ color: tokens.colors.text.primary }}>VANTAGE</span>
              <span style={{ color: tokens.colors.brand.primary }} className='ml-1'>
                LANE
              </span>
            </div>
            <p
              className='text-sm transition-colors'
              style={{
                color: tokens.colors.text.secondary,
                transitionDuration: tokens.motion.duration.fast,
              }}
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
    </motion.div>
  );
});

export { FooterBrand };
