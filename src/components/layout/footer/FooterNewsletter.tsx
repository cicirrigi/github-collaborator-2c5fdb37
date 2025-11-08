'use client';

import { motion } from 'framer-motion';
import type React from 'react';
import { memo, useState } from 'react';

import { cn } from '@/lib/utils/cn';

import type { FooterConfig } from './footer.config';

export interface FooterNewsletterProps {
  /** Newsletter data from config */
  readonly newsletter: FooterConfig['newsletter'];
  /** Custom styling */
  readonly className?: string;
}

type SubmissionState = 'idle' | 'loading' | 'success' | 'error';

/**
 * 📧 FooterNewsletter - Luxury newsletter subscription
 * - Design tokens integration
 * - Motion animations with luxury feel
 * - Email validation & submission states
 * - Glass morphism design
 * - Memoized for performance
 */
const FooterNewsletter = memo(function FooterNewsletter({
  newsletter,
  className,
}: FooterNewsletterProps): React.JSX.Element {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<SubmissionState>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setState('error');
      setTimeout(() => setState('idle'), 3000);
      return;
    }

    setState('loading');

    // Simulate API call
    setTimeout(() => {
      setState('success');
      setEmail('');
      setTimeout(() => setState('idle'), 5000);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      viewport={{ once: true }}
      className={cn(
        'relative mx-auto w-full max-w-[420px] p-8 rounded-3xl',
        'backdrop-blur-xl bg-black/40 shadow-[0_0_40px_-10px_rgba(203,178,106,0.25)]',
        'overflow-hidden',
        className
      )}
      style={{
        border: '1px solid rgba(203, 178, 106, 0.2)',
      }}
    >
      {/* Glow subtle aurie */}
      <div className='absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_top,var(--brand-primary)/8,transparent_70%)]' />

      {/* Conținut */}
      <div className='relative space-y-4 z-10'>
        <h3 className='text-xl font-semibold text-white tracking-tight'>{newsletter.title}</h3>
        <p className='text-sm text-neutral-400'>{newsletter.subtitle}</p>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Success Message */}
          {state === 'success' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className='text-center space-y-3 py-4'
            >
              <div className='text-3xl'>🎉</div>
              <p className='text-sm font-medium text-green-400'>
                Welcome to VIP! Check your email.
              </p>
            </motion.div>
          ) : (
            <>
              {/* Input + Button */}
              <motion.div
                className='flex gap-2 mt-4'
                animate={state === 'error' ? { x: [-5, 5, -5, 5, 0] } : {}}
                transition={{ duration: 0.4 }}
              >
                <input
                  type='email'
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder={newsletter.placeholder}
                  disabled={state === 'loading'}
                  className={cn(
                    'flex-1 bg-white/5 border rounded-xl px-4 py-2.5 text-sm text-neutral-200 placeholder:text-neutral-500',
                    'focus:outline-none focus:ring-1 transition-all',
                    state === 'error'
                      ? 'border-red-400/60 focus:ring-red-400/40'
                      : 'border-white/10 focus:ring-[var(--brand-primary)]/40'
                  )}
                />
                <button
                  type='submit'
                  disabled={state === 'loading' || !email}
                  className={cn(
                    'px-5 py-2.5 rounded-xl font-medium text-sm text-black transition-all',
                    'shadow-[0_0_20px_-5px_var(--brand-primary)/30] active:scale-[0.98]',
                    state === 'loading'
                      ? 'bg-[var(--brand-primary)]/60 cursor-not-allowed'
                      : 'bg-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/90'
                  )}
                >
                  {state === 'loading' && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className='inline-block w-3 h-3 border border-black/30 border-t-black rounded-full mr-1.5'
                    />
                  )}
                  {state === 'loading' ? 'Joining...' : 'Join VIP'}
                </button>
              </motion.div>

              {/* Benefits */}
              {state === 'idle' && (
                <div className='space-y-1.5 pt-3 text-sm text-neutral-400'>
                  {newsletter.benefits.map((benefit, index) => (
                    <motion.p
                      key={benefit.text}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                    >
                      {benefit.icon} {benefit.text}
                    </motion.p>
                  ))}
                </div>
              )}

              {/* Error state */}
              {state === 'error' && (
                <p className='text-xs text-red-400 mt-2'>Please enter a valid email address</p>
              )}
            </>
          )}
        </form>

        {/* Privacy Notice */}
        {state !== 'success' && (
          <p className='text-xs text-neutral-600 pt-2'>{newsletter.privacy}</p>
        )}
      </div>

      {/* Bottom reflection (optional cinematic touch) */}
      <div className='absolute bottom-[-1px] left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[var(--brand-primary)]/20 to-transparent blur-[2px]' />
    </motion.div>
  );
});

export { FooterNewsletter };
