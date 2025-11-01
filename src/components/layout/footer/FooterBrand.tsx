'use client';

import { motion } from 'framer-motion';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type React from 'react';
import { memo } from 'react';

import { cn } from '@/lib/utils/cn';
import { useThemeTokens } from '@/hooks/useThemeTokens';

import type { FooterConfig } from './footer.config';

// Icon mapping for type safety
const iconMap = {
  instagram: Instagram,
  linkedin: Linkedin,
  twitter: Twitter,
  facebook: Facebook,
} as const;

export interface FooterBrandProps {
  /** Brand data from config */
  readonly brand: FooterConfig['brand'];
  /** Social links from config */
  readonly socials?: FooterConfig['socials'];
  /** Custom styling */
  readonly className?: string;
}

/**
 * 🏛️ FooterBrand - Brand identity section
 * - Logo with luxury animation
 * - Company tagline and description
 * - Design tokens integration
 * - Zero hardcoded content
 * - Motion animations & memoized
 */
const FooterBrand = memo(function FooterBrand({
  brand,
  socials,
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

        {/* Social Icons */}
        {socials && socials.length > 0 && (
          <div className='flex gap-3 justify-center md:justify-start'>
            {socials.map(social => {
              const IconComponent = iconMap[social.icon];

              return (
                <a
                  key={social.name}
                  href={social.href}
                  target='_blank'
                  rel='noopener noreferrer'
                  aria-label={`Follow us on ${social.name}`}
                  className={cn(
                    'group relative rounded-full p-3 transition-all duration-300',
                    'hover:scale-110',
                    'focus-visible:outline-none focus-visible:ring-2',
                    'focus-visible:ring-[var(--brand-primary)]/40 focus-visible:ring-offset-2',
                    'focus-visible:ring-offset-[var(--background-dark)]'
                  )}
                  style={{
                    backgroundColor: 'var(--background-elevated)',
                    borderColor: 'var(--border-subtle)',
                  }}
                >
                  {/* Glow effect on hover */}
                  <div
                    className='absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-20'
                    style={{
                      background: `radial-gradient(circle, var(--brand-primary) 0%, transparent 70%)`,
                    }}
                  />

                  {/* Icon */}
                  <IconComponent
                    className='relative h-5 w-5 transition-all duration-200 group-hover:text-[var(--brand-primary)]'
                    style={{ color: 'var(--text-secondary)' }}
                  />
                </a>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
});

export { FooterBrand };
