'use client';

import { cn } from '@/lib/utils/cn';
import { motion } from 'framer-motion';
import React, { useEffect, useRef } from 'react';

import gridStyles from '../styles/grid.module.css';
import { gridTokens, GridVariant, motionTokens } from '../tokens';
import { TestimonialCardNew, type Testimonial } from './TestimonialCardNew';

/**
 * 🏗️ TestimonialsGrid - Grid Container Component
 *
 * Auto-responsive grid cu Framer Motion stagger animations
 * Adaptiv pentru toate device-urile cu CSS Grid auto-fit
 */

interface TestimonialsGridProps {
  /** Array cu testimoniale */
  testimonials: Testimonial[];
  /** Varianta grid-ului */
  variant?: GridVariant;
  /** Numărul maxim de testimoniale afișate */
  maxItems?: number;
  /** CSS class suplimentară */
  className?: string;
  /** Callback pentru click pe testimonial */
  onTestimonialClick?: (testimonial: Testimonial) => void;
}

export function TestimonialsGrid({
  testimonials,
  variant = 'default',
  maxItems,
  className,
  onTestimonialClick,
}: TestimonialsGridProps): React.JSX.Element | null {
  // Ref pentru carousel scroll inițial (hooks trebuie să fie la început)
  const carouselRef = useRef<HTMLDivElement>(null);

  // Pentru carousel, nu mai folosim .gridCarousel - aplicăm stilurile direct
  const isCarousel = variant === 'carousel';

  // Scroll inițial în carousel pentru preview pe ambele părți
  useEffect(() => {
    if (isCarousel && carouselRef.current && testimonials?.length > 1) {
      // Scroll la al doilea card după mount
      setTimeout(() => {
        const cardWidth = 320 + 32; // card width + gap
        carouselRef.current?.scrollTo({
          left: cardWidth * 0.7, // Scroll parțial pentru preview
          behavior: 'smooth',
        });
      }, 100);
    }
  }, [isCarousel, testimonials?.length]);

  // Funcții pentru butoanele de scroll
  const scrollLeft = () => {
    if (carouselRef.current) {
      const cardWidth = 320 + 32; // card width + gap
      carouselRef.current.scrollBy({
        left: -cardWidth,
        behavior: 'smooth',
      });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      const cardWidth = 320 + 32; // card width + gap
      carouselRef.current.scrollBy({
        left: cardWidth,
        behavior: 'smooth',
      });
    }
  };

  // SSR Safety Guard
  if (!testimonials?.length) return null;

  // Limitează numărul de testimoniale dacă este specificat
  const displayTestimonials = maxItems ? testimonials.slice(0, maxItems) : testimonials;

  // Obține configurația pentru varianta selectată
  const variantConfig = gridTokens.variants[variant];

  const gridVariantClass =
    variant !== 'default' && !isCarousel
      ? gridStyles[`grid${variant.charAt(0).toUpperCase() + variant.slice(1)}`]
      : null;

  return (
    <div className={isCarousel ? 'relative' : ''}>
      <motion.div
        ref={carouselRef}
        className={cn(gridStyles.grid, gridVariantClass, gridStyles.gridAnimated, className)}
        style={{
          ...(isCarousel
            ? {
                display: 'flex',
                flexDirection: 'row',
                overflowX: 'auto',
                overflowY: 'visible',
                gap: 'clamp(1.25rem, 2.5vw, 2rem)',
                padding: '2rem 2rem 2rem 1rem' /* Padding normal la dreapta */,
                scrollSnapType: 'x mandatory',
                scrollbarWidth: 'none',
              }
            : variantConfig),
        }}
        variants={motionTokens.grid.container}
        initial='initial'
        animate='animate'
        viewport={motionTokens.scroll.viewport}
      >
        {displayTestimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.id}
            variants={motionTokens.grid.item}
            custom={index}
            style={{
              // Pentru carousel variant, adaugă scroll-snap
              ...(variant === 'carousel' && {
                scrollSnapAlign: index === displayTestimonials.length - 1 ? 'end' : 'center',
                flexShrink: 0,
              }),
            }}
          >
            <TestimonialCardNew
              testimonial={testimonial}
              variant={getCardVariant(variant)}
              onClick={() => onTestimonialClick?.(testimonial)}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* 🎮 Carousel Navigation Buttons - AFARA containerului */}
      {isCarousel && displayTestimonials.length > 1 && (
        <>
          {/* Buton Stânga */}
          <button
            onClick={scrollLeft}
            className='absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 hover:scale-110 transition-all duration-200 shadow-lg hover:shadow-xl'
            aria-label='Scroll left'
          >
            <svg
              width='20'
              height='20'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <path d='m15 18-6-6 6-6' />
            </svg>
          </button>

          {/* Buton Dreapta */}
          <button
            onClick={scrollRight}
            className='absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 hover:scale-110 transition-all duration-200 shadow-lg hover:shadow-xl'
            aria-label='Scroll right'
          >
            <svg
              width='20'
              height='20'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <path d='m9 18 6-6-6-6' />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}

/**
 * 🎯 Helper function pentru maparea variantelor de grid la variantele de card
 */
function getCardVariant(gridVariant: GridVariant): 'default' | 'compact' | 'featured' {
  switch (gridVariant) {
    case 'compact':
      return 'compact';
    case 'featured':
      return 'featured';
    case 'default':
    case 'carousel':
    default:
      return 'default';
  }
}
