'use client';

import { motion } from 'framer-motion';
import { Facebook, Instagram, Youtube } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type React from 'react';
import { memo } from 'react';

import { brandConfig } from '@/config/brand.config';
import { useThemeTokens } from '@/hooks/useThemeTokens';
import { cn } from '@/lib/utils/cn';

import type { FooterConfig } from './footer.config';

// Custom X (Twitter) Icon Component
const XIcon = ({ className, width = 20, height = 20, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    className={className}
    width={width}
    height={height}
    {...props}
    viewBox='0 0 24 24'
    fill='currentColor'
  >
    <path d='M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z' />
  </svg>
);

// Custom TikTok Icon Component
const TikTokIcon = ({
  className,
  width = 20,
  height = 20,
  ...props
}: React.SVGProps<SVGSVGElement>) => (
  <svg
    className={className}
    width={width}
    height={height}
    {...props}
    viewBox='0 0 24 24'
    fill='currentColor'
  >
    <path d='M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z' />
  </svg>
);

// Icon mapping for type safety
const iconMap = {
  facebook: Facebook,
  instagram: Instagram,
  tiktok: TikTokIcon,
  youtube: Youtube,
  x: XIcon,
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
 * - Brand text from brand.config.ts (consistent with navbar)
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
            {/* Brand Text from config (consistent with navbar) */}
            <div
              className='text-xl font-light tracking-wide uppercase transition-colors'
              style={{ transitionDuration: tokens.motion.duration.fast }}
            >
              <span style={{ color: brandConfig.logo.colors.primary }}>
                {brandConfig.logo.text.primary}
              </span>
              <span style={{ color: brandConfig.logo.colors.secondary }} className='ml-1'>
                {brandConfig.logo.text.secondary}
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
                    className='relative transition-all duration-200 group-hover:text-[var(--brand-primary)]'
                    style={{ color: 'var(--text-secondary)' }}
                    width={20}
                    height={20}
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
