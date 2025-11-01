'use client';

import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import type React from 'react';

import { cn } from '@/lib/utils/cn';

import type { FooterConfig } from './footer.config';

// Icon mapping for type safety
const iconMap = {
  instagram: Instagram,
  linkedin: Linkedin,
  twitter: Twitter,
  facebook: Facebook,
} as const;

export interface FooterSocialsProps {
  /** Social links from config */
  readonly socials: FooterConfig['socials'];
  /** Custom styling */
  readonly className?: string;
}

/**
 * 📱 FooterSocials - Social media links section
 * - Icon mapping from lucide-react
 * - Luxury hover effects with glow
 * - Accessible with proper ARIA labels
 * - Design tokens integration
 * - Zero hardcoded content
 */
export function FooterSocials({ socials, className }: FooterSocialsProps): React.JSX.Element {
  return (
    <div className={cn('space-y-4', className)}>
      {/* Section Title */}
      <h4
        className='font-semibold text-sm transition-colors duration-200'
        style={{ color: 'var(--text-primary)' }}
      >
        Follow Us
      </h4>

      {/* Social Icons */}
      <div className='flex gap-3'>
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
    </div>
  );
}
