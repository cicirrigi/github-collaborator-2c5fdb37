/**
 * 📧 NewsletterCard Component - Simplified Version
 * Premium newsletter subscription card with form inputs
 */

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { newsletterCardTokens } from './NewsletterCard.tokens';
import type { NewsletterFormData } from './NewsletterCard.types';

interface SimpleNewsletterCardProps {
  onSubmit?: (data: NewsletterFormData) => void | Promise<void>;
  className?: string;
}

export function NewsletterCard({ onSubmit, className }: SimpleNewsletterCardProps) {
  const tokens = newsletterCardTokens;

  // SSR-safe state initialization
  const [formData, setFormData] = useState<NewsletterFormData>(() => ({
    firstName: '',
    lastName: '',
    email: '',
    consent: false,
  }));

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (onSubmit) {
        await onSubmit(formData);
      }
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        consent: false,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
      className={cn('relative border backdrop-blur-sm rounded-2xl p-6 md:p-8', className)}
      suppressHydrationWarning
      style={{
        backgroundColor: tokens.card.backgroundColor,
        border: '1px solid rgba(203, 178, 106, 0.2)',
      }}
    >
      <div className='mb-6'>
        <p className='text-sm text-neutral-400'>
          Subscribe to receive curated insights and private updates from Vantage Lane.
        </p>
      </div>

      <form onSubmit={handleSubmit} className='space-y-4' suppressHydrationWarning>
        {/* Compact horizontal layout on desktop */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-3'>
          <input
            type='text'
            placeholder='First Name'
            value={formData.firstName}
            onChange={e => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
            className='w-full px-3 h-10 text-base rounded-lg border transition-colors
                     bg-black/20 border-neutral-700/50 text-white placeholder-neutral-500
                     focus:border-[var(--brand-primary)] focus:outline-none focus:ring-0'
            style={{
              boxShadow: 'none',
            }}
            onFocus={e => {
              const target = e.target as HTMLInputElement;
              target.style.borderColor = 'var(--brand-primary)';
              target.style.boxShadow = '0 0 0 0.5px var(--brand-primary)';
            }}
            onBlur={e => {
              const target = e.target as HTMLInputElement;
              target.style.borderColor = 'rgb(64 64 64 / 0.5)';
              target.style.boxShadow = 'none';
            }}
            required
            suppressHydrationWarning
          />

          <input
            type='text'
            placeholder='Last Name'
            value={formData.lastName}
            onChange={e => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
            className='w-full px-3 h-10 text-base rounded-lg border transition-colors
                     bg-black/20 border-neutral-700/50 text-white placeholder-neutral-500
                     focus:border-[var(--brand-primary)] focus:outline-none focus:ring-0'
            style={{
              boxShadow: 'none',
            }}
            onFocus={e => {
              const target = e.target as HTMLInputElement;
              target.style.borderColor = 'var(--brand-primary)';
              target.style.boxShadow = '0 0 0 0.5px var(--brand-primary)';
            }}
            onBlur={e => {
              const target = e.target as HTMLInputElement;
              target.style.borderColor = 'rgb(64 64 64 / 0.5)';
              target.style.boxShadow = 'none';
            }}
            required
            suppressHydrationWarning
          />

          <input
            type='email'
            placeholder='Email Address'
            value={formData.email}
            onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className='w-full px-3 h-10 text-base rounded-lg border transition-colors
                     bg-black/20 border-neutral-700/50 text-white placeholder-neutral-500
                     focus:border-[var(--brand-primary)] focus:outline-none focus:ring-0'
            style={{
              boxShadow: 'none',
            }}
            onFocus={e => {
              const target = e.target as HTMLInputElement;
              target.style.borderColor = 'var(--brand-primary)';
              target.style.boxShadow = '0 0 0 0.5px var(--brand-primary)';
            }}
            onBlur={e => {
              const target = e.target as HTMLInputElement;
              target.style.borderColor = 'rgb(64 64 64 / 0.5)';
              target.style.boxShadow = 'none';
            }}
            required
            suppressHydrationWarning
          />
        </div>

        {/* Compact footer section */}
        <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3'>
          <label className='flex items-start gap-2 cursor-pointer text-left lg:flex-1'>
            <input
              type='checkbox'
              checked={formData.consent}
              onChange={e => setFormData(prev => ({ ...prev, consent: e.target.checked }))}
              className='mt-0.5 w-4 h-4 rounded border-neutral-700/50 bg-black/20'
              suppressHydrationWarning
            />
            <span className='text-xs lg:text-sm text-neutral-400 leading-relaxed'>
              I agree to receive communications and understand I can unsubscribe anytime.{' '}
              <a href='/privacy' className='text-[var(--brand-primary)] hover:underline'>
                Privacy Policy
              </a>
              .
            </span>
          </label>

          <PremiumButton
            variant='primary'
            size='md'
            loading={isLoading}
            disabled={isLoading || !formData.consent}
            className='lg:w-auto lg:px-7 w-full'
          >
            Subscribe to VIP Newsletter
          </PremiumButton>
        </div>

        {error && (
          <div className='p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs'>
            {error}
          </div>
        )}
      </form>
    </motion.div>
  );
}
