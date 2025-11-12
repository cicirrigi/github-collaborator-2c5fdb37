'use client';

import { motion } from 'framer-motion';
import { animations } from '@/config/animations.config';
import type React from 'react';
import { memo } from 'react';

import { Container } from '@/components/layout/Container';
import { designTokens } from '@/config/theme.config';
import { cn } from '@/lib/utils/cn';

import { footerConfig } from './footer.config';
import { FooterBottom } from './FooterBottom';
import { FooterBrand } from './FooterBrand';
import { FooterLinks } from './FooterLinks';

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
      className={cn('relative mt-auto backdrop-blur-lg transition-colors', className)}
      style={{
        backgroundColor: 'var(--background-dark)',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '100%',
        paddingLeft: '0',
        paddingRight: '0',
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

      {/* Main Content with Motion - ORCHESTRATED */}
      <Container size='xl' className='relative py-16 ml-0'>
        <motion.div
          variants={animations.staggerContainer}
          initial='hidden'
          whileInView='visible'
          viewport={animations.viewport}
          className='grid grid-cols-1 lg:grid-cols-12'
          style={{ gap: designTokens.footer.spacing.mainGrid }}
        >
          {/* Brand Section with Social Icons - Order 2 on mobile (appears last) */}
          {!hideBrand && (
            <motion.div className='order-2 lg:order-1 lg:col-span-4' variants={animations.fadeInUp}>
              <FooterBrand
                brand={config.brand}
                {...(!hideSocials && { socials: config.socials })}
              />
            </motion.div>
          )}

          {/* Links Section - Order 1 on mobile (appears first) */}
          <motion.div
            className={cn('order-1 lg:order-2', !hideBrand ? 'lg:col-span-8' : 'lg:col-span-12')}
            variants={animations.fadeInUp}
          >
            <FooterLinks links={config.links} />
          </motion.div>
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
