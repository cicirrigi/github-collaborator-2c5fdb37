'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import { typography } from '@/design-system/tokens/typography';
import { NewsletterCard, UnsubscribeModal } from '@/components/ui';
import { animations } from '@/config/animations.config';
import { newsletterTokens } from './NewsletterSection.tokens';
import type { NewsletterSectionProps } from './NewsletterSection.types';

/**
 * 📧 Newsletter Section - Cinematic Gold Sweep
 * Premium newsletter subscription with luxury animations
 * - Full-width cinematic black background
 * - Gold radial glow backdrop
 * - Animated gold sweep reflection over text
 * - React Aria accessibility integration
 * - Design tokens orchestration
 * - Framer Motion cinematographic easing
 */
export function NewsletterSection({
  className,
  hide = false,
}: NewsletterSectionProps): React.JSX.Element | null {
  const [showUnsubscribeModal, setShowUnsubscribeModal] = useState(false);

  const handleUnsubscribe = async (_email?: string) => {
    // Here you would implement the actual unsubscribe logic
    // Example: await unsubscribeService.unsubscribe(_email);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
  };

  if (hide) return null;

  return (
    <section
      className={cn(
        'relative isolate overflow-hidden',
        newsletterTokens.container.paddingY,
        className
      )}
      suppressHydrationWarning
    >
      {/* Radial gold backdrop glow - overlayed on global background */}
      <div className={cn('absolute inset-0', newsletterTokens.container.bg)} />

      {/* ORCHESTRATED CONTENT - Stagger animation */}
      <motion.div
        className='mx-auto max-w-7xl px-6 lg:px-8 relative z-10 text-center'
        variants={animations.staggerContainer}
        initial='hidden'
        whileInView='visible'
        viewport={animations.viewport}
      >
        {/* Heading */}
        <motion.div variants={animations.fadeInUp} suppressHydrationWarning>
          <h2
            className={`${typography.classes.sectionTitle} text-center`}
            style={{ color: 'var(--text-primary)' }}
          >
            Join The{' '}
            <span
              style={{
                color: 'var(--text-primary)',
              }}
            >
              Vantage
            </span>{' '}
            <span
              style={{
                color: 'var(--brand-primary)',
                textShadow: typography.effects.goldGlow.textShadow,
                filter: typography.effects.goldGlow.filter,
              }}
            >
              Circle
            </span>
          </h2>
        </motion.div>

        {/* Gold separator line */}
        <motion.div
          variants={animations.lineExpand}
          className='h-1 bg-gradient-to-r from-[var(--brand-primary)] to-[#E5D485] mx-auto mb-6'
          style={{ width: '6rem' }}
          suppressHydrationWarning
        />

        {/* 🩶 Subtitle */}
        <motion.p
          variants={animations.fadeIn}
          className={cn('mt-3 mx-auto max-w-2xl', newsletterTokens.text.size)}
          style={{ color: 'var(--text-secondary)' }}
        >
          Exclusive access to refined travel insights and members-only privileges.
        </motion.p>

        {/* Premium Newsletter Card */}
        <motion.div variants={animations.fadeInUp} className='mt-12 max-w-4xl mx-auto'>
          <NewsletterCard
            onSubmit={async _data => {
              // Here you would implement the actual submission logic
              // Example: await newsletterService.subscribe(_data);
            }}
          />
        </motion.div>

        {/* Success/Error Messages */}
        {/* <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn('mt-4 text-sm font-medium', newsletterTokens.messages.success)}
        >
          🎉 Welcome to the Circle! Check your email for exclusive content.
        </motion.div> */}

        {/* <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn('mt-4 text-sm', newsletterTokens.messages.error)}
        >
          Please enter a valid email address
        </motion.div> */}

        {/* Privacy notice */}
        <motion.p
          variants={animations.fadeIn}
          className={cn('mt-4', newsletterTokens.privacy.size)}
          style={{ color: 'var(--text-muted)' }}
        >
          We value your privacy — no spam, only refined updates.{' '}
          <button
            className='underline hover:no-underline transition-all duration-200 hover:text-[var(--brand-primary)]'
            onClick={() => setShowUnsubscribeModal(true)}
          >
            Unsubscribe anytime
          </button>
          .
        </motion.p>
      </motion.div>

      {/* Bottom gold reflection line */}
      <div className='absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--brand-primary)]/25 to-transparent blur-[1px]' />

      {/* Unsubscribe Modal */}
      <UnsubscribeModal
        isOpen={showUnsubscribeModal}
        onClose={() => setShowUnsubscribeModal(false)}
        onConfirm={handleUnsubscribe}
      />
    </section>
  );
}
