'use client';

import { useRef } from 'react';
import { motion, useAnimationFrame } from 'framer-motion';
import { useTextField } from 'react-aria';
import { cn } from '@/lib/utils/cn';
import { newsletterTokens } from './NewsletterSection.tokens';
import { useNewsletterForm } from './useNewsletterForm';
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
  const ref = useRef<HTMLInputElement>(null);
  const { labelProps, inputProps } = useTextField(
    {
      label: 'Email address',
      placeholder: 'your@email.com',
      type: 'email',
    },
    ref
  );

  const { email, setEmail, state, handleSubmit } = useNewsletterForm();

  // ✨ Gold sweep animation - Rolls-Royce style reflection
  const gradientRef = useRef<HTMLDivElement>(null);
  useAnimationFrame(t => {
    const x =
      Math.sin(t / newsletterTokens.animations.goldSweep.duration) *
      newsletterTokens.animations.goldSweep.amplitude;
    if (gradientRef.current) {
      gradientRef.current.style.backgroundPosition = `${50 + x}% 0%`;
    }
  });

  if (hide) return null;

  return (
    <section
      className={cn(
        'relative isolate overflow-hidden',
        newsletterTokens.container.backgroundColor,
        newsletterTokens.container.paddingY,
        className
      )}
    >
      {/* Radial gold backdrop glow */}
      <div className={cn('absolute inset-0', newsletterTokens.container.bg)} />

      <div className='mx-auto max-w-7xl px-6 lg:px-8 relative z-10 text-center'>
        <div className='relative inline-block'>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              ease: newsletterTokens.animations.goldSweep.ease,
              delay: newsletterTokens.animations.stagger.heading,
            }}
            viewport={{ once: true }}
            className={cn(newsletterTokens.heading.size, 'font-semibold tracking-tight relative')}
            style={{ color: 'var(--text-primary)' }}
          >
            Join the Vantage Lane Circle
          </motion.h2>

          {/* Cinematic gold sweep reflection */}
          <div
            ref={gradientRef}
            className='absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(203,178,106,0.35)_50%,transparent_100%)]
                       bg-[length:200%_100%] mix-blend-overlay animate-none pointer-events-none'
          />
        </div>

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
        >
          Exclusive access to refined travel insights and curated experiences.
        </motion.p>

        {/* Premium form with accessibility */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            ease: newsletterTokens.animations.goldSweep.ease,
            delay: newsletterTokens.animations.stagger.form,
          }}
          viewport={{ once: true }}
          onSubmit={handleSubmit}
          className='mt-8 flex flex-col sm:flex-row justify-center gap-3 max-w-md mx-auto'
        >
          <div className='flex-1 text-left'>
            <label {...labelProps} className='sr-only' />
            <motion.input
              id={inputProps.id}
              type={inputProps.type}
              placeholder={inputProps.placeholder}
              ref={ref}
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={state === 'loading' || state === 'success'}
              className={cn(
                newsletterTokens.input.base,
                state === 'error' && newsletterTokens.input.error
              )}
              animate={state === 'error' ? { x: [-5, 5, -5, 5, 0] } : {}}
              transition={{ duration: 0.4 }}
            />
          </div>

          <motion.button
            type='submit'
            disabled={state === 'loading' || state === 'success' || !email}
            whileHover={{ scale: state === 'loading' ? 1 : 1.02 }}
            whileTap={{ scale: state === 'loading' ? 1 : 0.98 }}
            className={cn(
              newsletterTokens.button.base,
              state === 'loading' && 'opacity-75 cursor-not-allowed'
            )}
          >
            {state === 'loading' && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className={newsletterTokens.loading.spinner}
              />
            )}
            {state === 'loading' ? 'Joining...' : state === 'success' ? '✓ Subscribed' : 'Join Now'}
          </motion.button>
        </motion.form>

        {/* Success/Error Messages */}
        {state === 'success' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn('mt-4 text-sm font-medium', newsletterTokens.messages.success)}
          >
            🎉 Welcome to the Circle! Check your email for exclusive content.
          </motion.div>
        )}

        {state === 'error' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn('mt-4 text-sm', newsletterTokens.messages.error)}
          >
            Please enter a valid email address
          </motion.div>
        )}

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
          We respect your privacy. Unsubscribe anytime.
        </motion.p>
      </div>

      {/* Bottom gold reflection line */}
      <div className='absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--brand-primary)]/25 to-transparent blur-[1px]' />
    </section>
  );
}
