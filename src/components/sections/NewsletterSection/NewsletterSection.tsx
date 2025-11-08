'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import { NewsletterCard, UnsubscribeModal } from '@/components/ui';
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
        newsletterTokens.container.backgroundColor,
        newsletterTokens.container.paddingY,
        className
      )}
      suppressHydrationWarning
    >
      {/* Radial gold backdrop glow */}
      <div className={cn('absolute inset-0', newsletterTokens.container.bg)} />

      <div className='mx-auto max-w-7xl px-6 lg:px-8 relative z-10 text-center'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.7,
            ease: newsletterTokens.animations.goldSweep.ease,
            delay: newsletterTokens.animations.stagger.heading,
          }}
          viewport={{ once: true }}
          suppressHydrationWarning
        >
          <h2
            className='tracking-wide text-4xl md:text-5xl font-light text-center'
            style={{ color: 'var(--text-primary)' }}
          >
            Join The{' '}
            <span
              style={{
                color: 'var(--text-primary)',
                textShadow: '0 0 18px rgba(220, 220, 255, 0.5), 0 0 30px rgba(180, 180, 255, 0.3)',
                filter: 'brightness(1.18)',
              }}
            >
              Vantage
            </span>{' '}
            <span
              style={{
                color: 'var(--brand-primary)',
                textShadow: '0 0 25px rgba(203, 178, 106, 0.7), 0 0 35px rgba(203, 178, 106, 0.4)',
                filter: 'brightness(1.2)',
              }}
            >
              Circle
            </span>
          </h2>
        </motion.div>

        {/* Gold separator line */}
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          whileInView={{ opacity: 1, width: '6rem' }}
          transition={{
            duration: 0.8,
            ease: newsletterTokens.animations.goldSweep.ease,
            delay: newsletterTokens.animations.stagger.heading + 0.3,
          }}
          viewport={{ once: true }}
          className='h-1 bg-gradient-to-r from-[var(--brand-primary)] to-[#E5D485] mx-auto mb-6'
          suppressHydrationWarning
        />

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            ease: newsletterTokens.animations.goldSweep.ease,
            delay: newsletterTokens.animations.stagger.subtitle,
          }}
          viewport={{ once: true }}
          className={cn('mt-3 mx-auto max-w-2xl', newsletterTokens.text.size)}
          style={{ color: 'var(--text-secondary)' }}
          suppressHydrationWarning
        >
          Exclusive access to refined travel insights and members-only privileges.
        </motion.p>

        {/* Premium Newsletter Card */}
        <div className='mt-12 max-w-4xl mx-auto'>
          <NewsletterCard
            onSubmit={async _data => {
              // Here you would implement the actual submission logic
              // Example: await newsletterService.subscribe(_data);
            }}
          />
        </div>

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
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{
            delay: newsletterTokens.animations.stagger.privacy,
            ease: newsletterTokens.animations.goldSweep.ease,
          }}
          viewport={{ once: true }}
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
      </div>

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
