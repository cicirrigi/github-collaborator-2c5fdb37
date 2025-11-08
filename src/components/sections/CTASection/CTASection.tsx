'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import type React from 'react';

import { Container } from '@/components/layout/Container';
import { Background } from '@/components/ui/Background';
import { cn } from '@/lib/utils/cn';
import { homeContent } from '@/config/content.config';
import { designTokens } from '@/config/theme.config';
import { layoutTokens } from '@/design-system/tokens/layout';

export interface CTASectionProps {
  /** Custom styling */
  readonly className?: string;
}

/**
 * 📢 CTASection - Final call-to-action with gradient background
 * - Config-driven content
 * - Luxury gradient background
 * - Smooth animations
 * - Design tokens integration
 */
export function CTASection({ className }: CTASectionProps): React.JSX.Element {
  return (
    <section
      className={cn('relative py-[var(--section-spacing-lg)] overflow-hidden', className)}
      style={
        {
          '--section-spacing-lg': layoutTokens.sectionSpacing.lg,
        } as React.CSSProperties
      }
    >
      {/* Background using new system */}
      <Background preset='cta' />

      <Container size='xl' className='relative z-10'>
        <motion.div
          className='text-center'
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            ease: designTokens.animations.easing.framer.ease,
          }}
          viewport={{ once: true }}
        >
          <h2
            className='mb-4 text-3xl font-bold tracking-tight text-white md:text-4xl'
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {homeContent.cta.title}
          </h2>

          <p className='mx-auto mb-8 max-w-2xl text-lg text-neutral-200'>
            {homeContent.cta.subtitle}
          </p>

          <Link
            href='/booking'
            className={cn(
              'inline-flex items-center justify-center rounded-md font-semibold transition-all',
              'px-8 py-4 text-lg',
              'bg-[var(--brand-primary)] text-black hover:opacity-90 hover:scale-105',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]/50'
            )}
          >
            {homeContent.cta.button}
          </Link>
        </motion.div>
      </Container>
    </section>
  );
}
