'use client';

import { cn } from '@/lib/utils/cn';
import { motion } from 'framer-motion';
import Image from 'next/image';
import type React from 'react';

import cardStyles from '../styles/card.module.css';
import themeStyles from '../styles/theme.module.css';
import { cardTokens, CardVariant, motionTokens } from '../tokens';
import { TestimonialBadge } from './TestimonialBadge';

/**
 * 🎴 TestimonialCardNew - Card Component cu înălțimi egale
 *
 * Soluția pentru text variabil: CSS Grid cu grid-template-rows: auto 1fr auto
 * - Header (badge + quote icon): flex 0 0 auto
 * - Content (stars + quote): flex 1 1 auto - se întinde să umple spațiul
 * - Footer (avatar + info): flex 0 0 auto
 *
 * Toate cardurile vor avea aceeași înălțime datorită aspect-ratio constant
 */

export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  company?: string;
  quote: string;
  service: string;
  rating: number;
  avatarUrl?: string;
  verified?: boolean;
}

interface TestimonialCardNewProps {
  /** Datele testimonialului */
  testimonial: Testimonial;
  /** Varianta cardului */
  variant?: CardVariant;
  /** CSS class suplimentară */
  className?: string;
  /** Click functionality removed - cards are display only */
}

export function TestimonialCardNew({
  testimonial,
  variant = 'default',
  className,
  // onClick removed - cards no longer clickable
}: TestimonialCardNewProps): React.JSX.Element {
  const variantStyles = cardTokens.variants[variant];

  return (
    <motion.article
      className={cn(
        cardStyles.card,
        themeStyles.glass,
        themeStyles.themeTransition,
        themeStyles.hoverGlow,
        cardStyles[variant],
        className
      )}
      style={{
        ...cardTokens.layout,
        ...cardTokens.effects.base,
        ...variantStyles,
      }}
      variants={motionTokens.card}
      initial='initial'
      animate='animate'
      whileHover='hover'
      // whileTap removed - no more click interaction
      viewport={motionTokens.scroll.viewport}
      // onClick removed - cards are not clickable anymore
      role='article'
      tabIndex={-1} // Not focusable - no click functionality
      // onKeyDown removed - no keyboard interaction
    >
      {/* 🎯 HEADER SECTION - flex: 0 0 auto */}
      <motion.div
        className={cardStyles.cardHeader}
        variants={motionTokens.badge}
        initial='initial'
        animate='animate'
      >
        <TestimonialBadge service={testimonial.service} variant='solid' tone='gold' />

        <span className={cardStyles.quoteIcon} aria-hidden='true'>
          &ldquo;
        </span>
      </motion.div>

      {/* 🎯 CONTENT SECTION - flex: 1 1 auto (se întinde) */}
      <motion.div
        className={cardStyles.cardContent}
        variants={motionTokens.quote}
        initial='initial'
        animate='animate'
      >
        {/* Rating Stars */}
        <motion.div
          className={cardStyles.starsContainer}
          variants={motionTokens.stars.container}
          initial='initial'
          animate='animate'
          role='img'
          aria-label={`${testimonial.rating} out of 5 stars`}
        >
          {Array.from({ length: testimonial.rating }, (_, i) => (
            <motion.svg
              key={i}
              className={cardStyles.star}
              fill='currentColor'
              viewBox='0 0 20 20'
              variants={motionTokens.stars.star}
              custom={i}
              whileHover='hover'
            >
              <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
            </motion.svg>
          ))}
        </motion.div>

        {/* Quote Text - centrat vertical în spațiul disponibil */}
        <blockquote className={cardStyles.quote} aria-label={`${testimonial.name}'s testimonial`}>
          &ldquo;{testimonial.quote}&rdquo;
        </blockquote>
      </motion.div>

      {/* 🎯 FOOTER SECTION - flex: 0 0 auto */}
      <motion.div
        className={cardStyles.cardFooter}
        variants={motionTokens.avatar}
        initial='initial'
        animate='animate'
      >
        {/* Avatar */}
        {testimonial.avatarUrl && (
          <motion.div
            className={cardStyles.avatar}
            whileHover={{
              scale: 1.1,
              transition: motionTokens.transitions.spring,
            }}
          >
            <Image
              src={testimonial.avatarUrl}
              alt={`${testimonial.name} avatar`}
              fill
              className={cardStyles.avatarImage}
              sizes='40px'
            />
          </motion.div>
        )}

        {/* Client Info */}
        <div>
          <div className={cardStyles.clientName}>{testimonial.name}</div>

          {testimonial.role && <div className={cardStyles.clientRole}>{testimonial.role}</div>}

          {testimonial.company && (
            <div className={cardStyles.clientCompany}>{testimonial.company}</div>
          )}
        </div>
      </motion.div>
    </motion.article>
  );
}
