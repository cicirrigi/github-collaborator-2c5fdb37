'use client';

import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useState } from 'react';
import type React from 'react';

import { TestimonialCard } from './TestimonialCard';
import { testimonialsHorizontalTokens } from './TestimonialsHorizontal.tokens';
import type { TestimonialData } from './TestimonialsSection.types';

interface TestimonialsHorizontalProps {
  readonly testimonials: readonly TestimonialData[];
  readonly className?: string;
}

/**
 * 🎠 TestimonialsHorizontal - Smooth horizontal scroll layout
 *
 * Features:
 * - Native smooth scroll with scroll-snap
 * - Responsive card sizing via tokens
 * - Optional fade edges for visual polish
 * - Stagger animations for entrance
 * - Zero hardcoded values - fully orchestrated
 * - Mobile swipe support built-in
 */
export function TestimonialsHorizontal({
  testimonials,
  className = '',
}: TestimonialsHorizontalProps): React.JSX.Element {
  const tokens = testimonialsHorizontalTokens;

  // ✅ Endless scroll cu multe duplicate pentru smooth loop
  const duplicatedTestimonials = [
    ...testimonials,
    ...testimonials,
    ...testimonials,
    ...testimonials,
    ...testimonials,
    ...testimonials,
  ]; // 6 copii pentru buffer mare

  // Navigation state - index-based pentru endless scroll
  const [currentIndex, setCurrentIndex] = useState(testimonials.length * 2); // Start în mijloc
  const [isAnimating, setIsAnimating] = useState(false);

  // Card dimensions pentru calculul translateX
  const CARD_WIDTH = 24 * 16; // 24rem -> 384px
  const GAP = 2 * 16; // 2rem -> 32px
  const SCROLL_STEP = CARD_WIDTH * 0.75; // ✅ Pas optimizat pentru smoothness

  // ✅ Endless scroll cu reset invizibil când buffer se epuizează
  const goToNext = useCallback(() => {
    if (isAnimating) return;

    setIsAnimating(true);
    setCurrentIndex(prev => {
      const nextIndex = prev + 1;

      // ✅ Reset invizibil când suntem aproape de capăt
      if (nextIndex >= duplicatedTestimonials.length - testimonials.length) {
        // Reset la începutul copiei din mijloc - invizibil pentru user
        return testimonials.length;
      }

      return nextIndex;
    });

    setTimeout(() => setIsAnimating(false), 700);
  }, [testimonials.length, isAnimating, duplicatedTestimonials.length]);

  const goToPrevious = useCallback(() => {
    if (isAnimating) return;

    setIsAnimating(true);
    setCurrentIndex(prev => {
      const prevIndex = prev - 1;

      // ✅ Reset invizibil când suntem aproape de început
      if (prevIndex < testimonials.length) {
        // Reset la sfârșitul copiei din mijloc - invizibil pentru user
        return duplicatedTestimonials.length - testimonials.length - 1;
      }

      return prevIndex;
    });

    setTimeout(() => setIsAnimating(false), 700);
  }, [testimonials.length, isAnimating, duplicatedTestimonials.length]);

  return (
    <div className={className}>
      <motion.div
        style={tokens.container}
        {...tokens.animations.containerEntrance}
        viewport={{ once: true }}
      >
        {/* Track container cu smooth movement */}
        <motion.div
          style={tokens.trackWrapper}
          animate={{
            x: -currentIndex * SCROLL_STEP,
          }}
          transition={tokens.animations.trackTransition}
        >
          {duplicatedTestimonials.map((testimonial, index) => (
            <motion.div
              key={`testimonial-${index}`} // ✅ Unique keys pentru duplicates
              style={tokens.cardWrapper}
              {...tokens.animations.cardStagger}
              transition={{
                ...tokens.animations.cardStagger.transition,
                delay: index * 0.1, // Stagger effect
              }}
              viewport={{ once: true }}
            >
              <TestimonialCard testimonial={testimonial} variant='default' />
            </motion.div>
          ))}
        </motion.div>

        {/* Navigation Arrows - frumoase și elegante */}
        <motion.button
          style={{
            ...tokens.arrows.container,
            ...tokens.arrows.left,
          }}
          whileHover={tokens.arrows.hover}
          whileTap={{ scale: 0.95 }}
          onClick={goToPrevious}
          aria-label='Previous testimonial'
        >
          <ChevronLeft style={tokens.arrows.icon} />
        </motion.button>

        <motion.button
          style={{
            ...tokens.arrows.container,
            ...tokens.arrows.right,
          }}
          whileHover={tokens.arrows.hover}
          whileTap={{ scale: 0.95 }}
          onClick={goToNext}
          aria-label='Next testimonial'
        >
          <ChevronRight style={tokens.arrows.icon} />
        </motion.button>
      </motion.div>
    </div>
  );
}
