'use client';

import { cn } from '@/lib/utils/cn';
import { motion } from 'framer-motion';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';

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
  /** onClick handler removed - cards no longer clickable */
}

export function TestimonialsGrid({
  testimonials,
  variant = 'default',
  maxItems,
  className,
}: TestimonialsGridProps): React.JSX.Element | null {
  // Ref pentru carousel scroll inițial (hooks trebuie să fie la început)
  const carouselRef = useRef<HTMLDivElement>(null);

  // Pentru carousel, nu mai folosim .gridCarousel - aplicăm stilurile direct
  const isCarousel = variant === 'carousel';

  // Early computation pentru displayTestimonials
  const baseTestimonials = testimonials
    ? maxItems
      ? testimonials.slice(0, maxItems)
      : testimonials
    : [];

  // Pentru carousel, clonează primele carduri la sfârșit pentru seamless loop
  const displayTestimonials =
    isCarousel && baseTestimonials.length > 1
      ? [
          ...baseTestimonials,
          ...baseTestimonials.slice(0, 2).map((item, idx) => ({
            ...item,
            id: `${item.id}-clone-${idx}`, // Key unic pentru clonele
          })),
        ]
      : baseTestimonials;

  // States pentru auto-scroll control
  const [isPaused, setIsPaused] = useState(false);
  const autoScrollRef = useRef<NodeJS.Timeout | null>(null);
  const currentIndexRef = useRef(0);

  // Auto-scroll pentru carousel cu seamless loop
  useEffect(() => {
    if (!isCarousel || displayTestimonials.length <= 1) return;

    const cardWidth = 320 + 32; // card width + gap
    const originalCards = baseTestimonials.length;

    const autoScroll = () => {
      if (isPaused || !carouselRef.current) return;

      currentIndexRef.current++;

      // Scroll la următorul card (inclusiv clonele)
      carouselRef.current.scrollTo({
        left: cardWidth * currentIndexRef.current,
        behavior: 'smooth',
      });

      // Când ajungem la prima clonă, continuăm smooth
      // Reset se face doar după ce am trecut prin prima clonă
      if (currentIndexRef.current > originalCards) {
        // > nu >=
        setTimeout(() => {
          if (carouselRef.current && !isPaused) {
            carouselRef.current.scrollTo({
              left: 0,
              behavior: 'auto', // Reset instant după clonă
            });
            currentIndexRef.current = 0;
          }
        }, 800); // Delay după smooth scroll prin clonă
      }
    };

    // Observer pentru manual scroll - detect când user ajunge la clonele
    const handleManualScroll = () => {
      if (!carouselRef.current || isPaused) return;

      const scrollLeft = carouselRef.current.scrollLeft;
      const maxScroll = cardWidth * originalCards;

      // Dacă user-ul a scroll-at manual până la clonele, reset automat
      if (scrollLeft >= maxScroll - 50) {
        // 50px tolerance
        setTimeout(() => {
          if (carouselRef.current) {
            carouselRef.current.scrollTo({
              left: 0,
              behavior: 'auto',
            });
            currentIndexRef.current = 0;
          }
        }, 300); // Delay mai scurt pentru manual scroll
      }
    };

    // Pornește auto-scroll cu timing mai lent
    const startInterval = () => {
      if (autoScrollRef.current) clearInterval(autoScrollRef.current);
      autoScrollRef.current = setInterval(autoScroll, 4000); // 4 secunde - mai lent
    };

    // Add scroll listener pentru manual scroll
    const container = carouselRef.current;
    if (container) {
      container.addEventListener('scroll', handleManualScroll, { passive: true });
    }

    // Start după o mică întârziere
    const initialTimeout = setTimeout(startInterval, 1000);

    return () => {
      clearTimeout(initialTimeout);
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
        autoScrollRef.current = null;
      }
      if (container) {
        container.removeEventListener('scroll', handleManualScroll);
      }
    };
  }, [isCarousel, isPaused, baseTestimonials.length, displayTestimonials.length]);

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
                padding: '2rem 2rem 2rem 1rem',
                scrollSnapType: 'x mandatory',
                scrollbarWidth: 'none',
                // 🎨 Gradient masks pentru fade-out elegant la capete
                maskImage:
                  'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
                WebkitMaskImage:
                  'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
              }
            : variantConfig),
        }}
        variants={motionTokens.grid.container}
        initial='initial'
        animate='animate'
        viewport={motionTokens.scroll.viewport}
        onMouseEnter={() => isCarousel && setIsPaused(true)}
        onMouseLeave={() => isCarousel && setIsPaused(false)}
      >
        {displayTestimonials.map((testimonial, index) => (
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
            <TestimonialCardNew
              testimonial={testimonial}
              variant={getCardVariant(variant)}
              // Eliminăm onClick complet - cardurile nu mai sunt clickabile
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
            className='absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 hover:scale-110 active:bg-[#cbb26a]/40 active:border-[#cbb26a]/60 transition-all duration-200 shadow-lg hover:shadow-xl'
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
            className='absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 hover:scale-110 active:bg-[#cbb26a]/40 active:border-[#cbb26a]/60 transition-all duration-200 shadow-lg hover:shadow-xl'
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
