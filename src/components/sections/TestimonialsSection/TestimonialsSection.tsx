'use client';

import { motion } from 'framer-motion';
import type React from 'react';

import { SectionOrchestrator } from '@/components/layout/SectionOrchestrator';
import { cn } from '@/lib/utils/cn';

import { TestimonialCard } from './TestimonialCard';
import { TestimonialsHorizontal } from './TestimonialsHorizontal';
import { testimonialsConfig } from './TestimonialsSection.config';
import type { TestimonialsSectionProps, TrustIndicator } from './TestimonialsSection.types';

/**
 * 🎭 TestimonialsSection - Client testimonials with trust indicators
 *
 * Features:
 * - Config-driven content (zero hardcoded text)
 * - Framer Motion animations
 * - Orchestrated layout with SectionOrchestrator
 * - Design tokens integration
 * - Trust indicators section
 * - Responsive grid layout
 * - Type-safe props with overrides
 */
export function TestimonialsSection({
  testimonials,
  title,
  subtitle,
  showTrustIndicators = true,
  className,
  variant = 'default',
  maxItems,
}: TestimonialsSectionProps): React.JSX.Element {
  // Use provided testimonials or fall back to config
  const testimonialsData = testimonials || testimonialsConfig.testimonials;
  const displayTestimonials = maxItems ? testimonialsData.slice(0, maxItems) : testimonialsData;

  // Use provided title/subtitle or fall back to config
  const sectionTitle = title || testimonialsConfig.title;
  const sectionSubtitle = subtitle || testimonialsConfig.subtitle;

  return (
    <SectionOrchestrator spacing={variant === 'compact' ? 'md' : 'xl'} className={className || ''}>
      {/* Header */}
      <div className='text-center mb-16'>
        <motion.h2
          className='text-4xl md:text-5xl font-light tracking-wide mb-4'
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <span className='text-white'>
            {typeof sectionTitle === 'string' ? sectionTitle : sectionTitle.main}
          </span>
          {typeof sectionTitle !== 'string' && (
            <>
              {' '}
              <span style={{ color: 'var(--color-brand-primary)' }}>{sectionTitle.accent}</span>
            </>
          )}
        </motion.h2>

        {/* Golden underline */}
        <motion.div
          className='w-24 h-1 mx-auto mb-6'
          style={{
            background:
              'linear-gradient(to right, var(--color-brand-primary), var(--color-brand-secondary))',
          }}
          initial={{ width: 0 }}
          whileInView={{ width: 96 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />

        <motion.p
          className='text-lg text-neutral-300 max-w-2xl mx-auto'
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {sectionSubtitle}
        </motion.p>
      </div>

      {/* Testimonials Display - Grid or Horizontal */}
      {variant === 'horizontal' ? (
        <TestimonialsHorizontal testimonials={displayTestimonials} />
      ) : (
        <div
          className={cn(
            'grid gap-8',
            variant === 'compact' ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3',
            variant === 'carousel' && 'md:grid-cols-1 lg:grid-cols-2'
          )}
        >
          {displayTestimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: 'easeOut',
              }}
            >
              <TestimonialCard testimonial={testimonial} />
            </motion.div>
          ))}
        </div>
      )}

      {/* Trust Indicators */}
      {showTrustIndicators && (
        <motion.div
          className='mt-16 text-center'
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className='grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto'>
            {testimonialsConfig.trustIndicators.map((indicator: TrustIndicator, index) => (
              <div key={indicator.label} className='text-center'>
                <motion.div
                  className='text-2xl md:text-3xl font-light mb-2'
                  style={{ color: 'var(--color-brand-primary)' }}
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: 0.6 + index * 0.1,
                    ease: 'backOut',
                  }}
                >
                  {indicator.value}
                </motion.div>
                <div className='text-sm text-neutral-400'>{indicator.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Golden line separator */}
      <motion.div
        className='absolute inset-x-0 bottom-0 h-px pointer-events-none'
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.8 }}
      >
        <div
          className='absolute inset-0'
          style={{
            background:
              'linear-gradient(to right, transparent, var(--color-brand-primary-alpha-40), transparent)',
          }}
        />
        <div
          className='absolute left-1/2 top-0 -translate-x-1/2 w-96 h-px blur-sm'
          style={{
            background:
              'linear-gradient(to right, transparent, var(--color-brand-secondary-alpha-60), transparent)',
          }}
        />
      </motion.div>
    </SectionOrchestrator>
  );
}
