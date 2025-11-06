'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import type React from 'react';

import styles from './TestimonialCard.module.css';
import { testimonialCardTokens } from './TestimonialCard.tokens';
import type { TestimonialCardProps } from './TestimonialsSection.types';

/**
 * 💳 TestimonialCard - Individual testimonial card component
 *
 * Features:
 * - Complete design tokens orchestration (zero hardcoded values)
 * - Consistent card heights for uniform layout
 * - Framer Motion animations with tokens
 * - Next.js Image optimization for avatars
 * - Variant support for different contexts
 * - Full accessibility with proper semantic markup
 */
export function TestimonialCard({
  testimonial,
  className,
  variant = 'default',
}: TestimonialCardProps): React.JSX.Element {
  const variantTokens = testimonialCardTokens.variants[variant];

  return (
    <motion.div
      className={className}
      {...testimonialCardTokens.animations.cardEntrance}
      whileHover={testimonialCardTokens.animations.hoverScale}
      viewport={{ once: true }}
    >
      <div
        className={styles.card}
        style={{
          ...testimonialCardTokens.container,
          ...variantTokens,
          border: testimonialCardTokens.container.borderDefault,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.border = testimonialCardTokens.container.borderHover;
          e.currentTarget.style.boxShadow =
            '0 12px 48px rgba(203, 178, 106, 0.2), 0 0 0 1px rgba(203, 178, 106, 0.2)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.border = testimonialCardTokens.container.borderDefault;
          e.currentTarget.style.boxShadow = testimonialCardTokens.container.boxShadow;
        }}
      >
        {/* Quote Icon */}
        <div style={testimonialCardTokens.text.quoteIcon} aria-hidden='true'>
          &ldquo;
        </div>

        {/* Service Badge */}
        <div style={{ marginBottom: testimonialCardTokens.spacing.elements }}>
          <span className={styles.serviceBadge}>{testimonial.service}</span>
        </div>

        {/* Rating Stars */}
        <div
          style={testimonialCardTokens.stars.container}
          role='img'
          aria-label={`${testimonial.rating} out of 5 stars`}
        >
          {Array.from({ length: testimonial.rating }, (_, i) => (
            <svg
              key={i}
              style={testimonialCardTokens.stars.star}
              fill='currentColor'
              viewBox='0 0 20 20'
              aria-hidden='true'
            >
              <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
            </svg>
          ))}
        </div>

        {/* Testimonial Text */}
        <blockquote style={testimonialCardTokens.text.quote}>
          &ldquo;{testimonial.text}&rdquo;
        </blockquote>

        {/* Fade Separator Line */}
        <div style={testimonialCardTokens.separator.container}>
          <div style={testimonialCardTokens.separator.line} />
          <div style={testimonialCardTokens.separator.glow} />
        </div>

        {/* Client Info */}
        <div style={testimonialCardTokens.clientInfo.container}>
          <div style={testimonialCardTokens.avatar.container}>
            <Image
              src={testimonial.avatar}
              alt={`${testimonial.name} avatar`}
              fill
              style={testimonialCardTokens.avatar.image}
              sizes='48px'
            />
          </div>
          <div>
            <div style={testimonialCardTokens.text.name}>{testimonial.name}</div>
            <div style={testimonialCardTokens.text.role}>{testimonial.role}</div>
          </div>
        </div>

        {/* Hover Glow Effect */}
        <div
          style={{
            ...testimonialCardTokens.hoverGlow,
            opacity: 0,
            transition: testimonialCardTokens.animations.glowTransition.transition,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.opacity = String(testimonialCardTokens.hoverGlow.opacityHover);
          }}
          onMouseLeave={e => {
            e.currentTarget.style.opacity = String(testimonialCardTokens.hoverGlow.opacity);
          }}
        />
      </div>
    </motion.div>
  );
}
