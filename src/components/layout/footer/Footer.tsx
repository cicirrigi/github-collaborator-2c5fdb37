'use client';

import { motion } from 'framer-motion';
import type React from 'react';
import { memo } from 'react';

import { Container } from '@/components/layout/Container';
import { designTokens } from '@/config/theme.config';
import { cn } from '@/lib/utils/cn';

import { footerConfig } from './footer.config';
import { FooterBottom } from './FooterBottom';
import { FooterBrand } from './FooterBrand';
import { FooterLinks } from './FooterLinks';
import { FooterSocials } from './FooterSocials';

export interface FooterProps {
  /** Custom styling */
  readonly className?: string;
  /** Hide brand section */
  readonly hideBrand?: boolean;
  /** Hide social links */
  readonly hideSocials?: boolean;
  /** Custom config override */
  readonly customConfig?: typeof footerConfig;
}

/**
 * 🦶 Footer - Main footer orchestrator
 * - Modular architecture with separated concerns
 * - Config-driven content (zero hardcoding)
 * - Luxury gradient background
 * - Design tokens integration
 * - Responsive grid layout
 * - Under 100 lines (orchestrator only)
 */
const Footer = memo(function Footer({
  className,
  hideBrand = false,
  hideSocials = false,
  customConfig,
}: FooterProps): React.JSX.Element {
  // Use custom config or default
  const config = customConfig || footerConfig;

  return (
    <footer
      role='contentinfo'
      className={cn('relative mt-auto border-t backdrop-blur-lg transition-colors', className)}
      style={{
        backgroundColor: designTokens.colors.background?.dark || 'var(--background-dark)',
        borderTopColor: designTokens.colors.border?.subtle || 'var(--border-subtle)',
      }}
    >
      {/* Luxury gradient overlay - Using design token */}
      <div
        className='absolute inset-0 opacity-5'
        style={{
          background: designTokens.gradients.footerLuxury,
          backgroundAttachment: 'local',
          backgroundSize: '100% 100%',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Main Content with Motion */}
      <Container size='xl' className='relative py-16'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          viewport={{ once: true, margin: '-50px' }}
          className='grid grid-cols-1 gap-8 lg:grid-cols-12'
        >
          {/* Brand Section - Takes more space */}
          {!hideBrand && (
            <div className='lg:col-span-4'>
              <FooterBrand brand={config.brand} contact={config.contact} />
            </div>
          )}

          {/* Links Section - Responsive columns */}
          <div className={cn(!hideBrand ? 'lg:col-span-6' : 'lg:col-span-10')}>
            <FooterLinks links={config.links} />
          </div>

          {/* Socials Section */}
          {!hideSocials && (
            <div className='lg:col-span-2'>
              <FooterSocials socials={config.socials} />
            </div>
          )}
        </motion.div>
      </Container>

      {/* Bottom Section */}
      <Container size='xl' className='relative'>
        <FooterBottom legal={config.legal} />
      </Container>
    </footer>
  );
});

export default Footer;
