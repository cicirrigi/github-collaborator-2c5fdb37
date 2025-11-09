/**
 * 🏗️ TestimonialGridLayout - Grid Layout Component
 *
 * Handles the actual grid/carousel layout rendering
 * Extracted from TestimonialsGrid for better component composition
 */

'use client';

import { cn } from '@/lib/utils/cn';
import { motion } from 'framer-motion';
import { forwardRef } from 'react';

import { SlideIndicator } from '@/components/ui/SlideIndicator/SlideIndicator';
import gridStyles from '../styles/grid.module.css';
import { motionTokens, type CardVariant, type GridVariant } from '../tokens';
import { TestimonialCardNew, type Testimonial } from './TestimonialCardNew';

export interface TestimonialGridLayoutProps {
  /** Testimonials to display */
  testimonials: Testimonial[];
  /** Grid variant */
  variant: GridVariant;
  /** Whether this is a carousel */
  isCarousel: boolean;
  /** Pause function for carousel */
  onPause?: () => void;
  /** Resume function for carousel */
  onResume?: () => void;
  /** Custom className */
  className?: string | undefined;
}

/**
 * Testimonial Grid Layout Component
 * Renders the actual grid with proper styling and animations
 */
export const TestimonialGridLayout = forwardRef<HTMLDivElement, TestimonialGridLayoutProps>(
  function TestimonialGridLayout(
    { testimonials, variant, isCarousel, onPause, onResume, className },
    ref
  ) {
    if (!testimonials || testimonials.length === 0) {
      return null;
    }

    // Convert GridVariant to CardVariant
    const getCardVariant = (gridVariant: GridVariant): CardVariant => {
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
    };

    // Scroll functions for carousel buttons
    const scrollLeft = () => {
      if (ref && 'current' in ref && ref.current) {
        // Pause auto-scroll temporarily to avoid conflicts
        onPause?.();

        const cardWidth = 320 + 32; // card width + gap
        ref.current.scrollBy({
          left: -cardWidth,
          behavior: 'smooth',
        });

        // Resume auto-scroll after manual scroll completes
        setTimeout(() => {
          onResume?.();
        }, 500); // Wait for smooth scroll to complete
      }
    };

    const scrollRight = () => {
      if (ref && 'current' in ref && ref.current) {
        onPause?.();

        const scrollLeft = ref.current.scrollLeft;
        const scrollWidth = ref.current.scrollWidth;
        const clientWidth = ref.current.clientWidth;

        // Check dacă suntem aproape de capăt
        if (scrollLeft + clientWidth >= scrollWidth - 100) {
          // Suntem la capăt, resetăm la început
          ref.current.scrollTo({
            left: 0,
            behavior: 'smooth',
          });
        } else {
          // Scroll normal la următorul card
          const cardWidth = 320 + 32; // card width + gap
          ref.current.scrollBy({
            left: cardWidth,
            behavior: 'smooth',
          });
        }

        setTimeout(() => {
          onResume?.();
        }, 500);
      }
    };

    return (
      <div className={isCarousel ? 'relative' : ''}>
        <motion.div
          ref={ref}
          className={cn(gridStyles.grid, gridStyles.gridAnimated, className)}
          style={{
            ...(isCarousel
              ? {
                  display: 'flex',
                  flexDirection: 'row',
                  overflowX: 'auto',
                  overflowY: 'visible',
                  gap: '1rem',
                  padding: '2rem 2rem 2rem 1rem',
                  scrollSnapType: 'x mandatory',
                  scrollbarWidth: 'none',
                  // 🎨 Gradient masks pentru fade-out elegant la capete
                  maskImage:
                    'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
                  WebkitMaskImage:
                    'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
                }
              : {}),
          }}
          variants={motionTokens.grid.container}
          initial='initial'
          animate='animate'
          viewport={motionTokens.scroll.viewport}
          onMouseEnter={isCarousel ? onPause : undefined}
          onMouseLeave={isCarousel ? onResume : undefined}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              variants={motionTokens.grid.item}
              custom={index}
              style={{
                // Pentru carousel variant, adaugă scroll-snap
                ...(variant === 'carousel' && {
                  scrollSnapAlign: 'center', // Toate cardurile center-aligned pentru seamless
                  flexShrink: 0,
                }),
              }}
            >
              <TestimonialCardNew testimonial={testimonial} variant={getCardVariant(variant)} />
            </motion.div>
          ))}
        </motion.div>

        {/* 🎮 Carousel Navigation Buttons - AFARA containerului */}
        {isCarousel && testimonials.length > 1 && (
          <>
            {/* Buton Stânga - ascuns pe mobil */}
            <button
              onClick={scrollLeft}
              className='hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-full items-center justify-center text-white hover:bg-white/20 hover:scale-110 active:bg-[#cbb26a]/40 active:border-[#cbb26a]/60 transition-all duration-200 shadow-lg hover:shadow-xl'
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

            {/* Buton Dreapta - ascuns pe mobil */}
            <button
              onClick={scrollRight}
              className='hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-full items-center justify-center text-white hover:bg-white/20 hover:scale-110 active:bg-[#cbb26a]/40 active:border-[#cbb26a]/60 transition-all duration-200 shadow-lg hover:shadow-xl'
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

        {/* 📱 Swipe Indicator - doar pe mobil */}
        {isCarousel && (
          <div className='flex justify-start pl-20 -mt-2 md:hidden'>
            <SlideIndicator text='Swipe for more' showText={true} />
          </div>
        )}
      </div>
    );
  }
);
