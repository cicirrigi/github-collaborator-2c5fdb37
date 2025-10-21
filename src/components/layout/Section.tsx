'use client';

import type React from 'react';

import { cn } from '@/lib/utils/cn';

import { Container } from './Container';

/**
 * 🧱 Section (Vantage Lane 2.0)
 *
 * A semantic, responsive layout block that provides vertical spacing,
 * background styling, optional animation, alignment, and auto-Container wrapping.
 *
 * ✅ Features
 * - Responsive vertical spacing system (none → xl)
 * - Background variants (transparent, neutral, accent, gradient)
 * - Auto-wrap content in <Container />
 * - Text alignment (left / center / right)
 * - Optional fade-in animation on scroll
 * - TypeScript strict (no `any`)
 * - Fully mobile & dark-mode ready
 * - Accessible & SEO friendly
 *
 * @example
 * <Section spacing="lg" background="neutral" contained>
 *   <AboutContent />
 * </Section>
 */

export interface SectionProps {
  /** Section content */
  readonly children: React.ReactNode;
  /** Vertical padding scale */
  readonly spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  /** Background variant */
  readonly background?: 'transparent' | 'neutral' | 'accent' | 'gradient';
  /** Auto-wrap in <Container /> */
  readonly contained?: boolean;
  /** Container size preset */
  readonly containerSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Text alignment inside the section */
  readonly align?: 'left' | 'center' | 'right';
  /** Adds a fade-in animation */
  readonly animate?: boolean;
  /** Extra Tailwind classes */
  readonly className?: string;
  /** Semantic tag (section, main, article, etc.) */
  readonly as?: React.ElementType;
  /** Section ID for anchor links */
  readonly id?: string;
}

/**
 * 🎨 Responsive Section wrapper
 * Provides spacing, alignment, and background styling with optional animation.
 */
export function Section({
  children,
  spacing = 'lg',
  background = 'transparent',
  contained = true,
  containerSize = 'lg',
  align = 'left',
  animate = false,
  className,
  as: Tag = 'section',
  id,
}: SectionProps): React.JSX.Element {
  const content = contained ? (
    <Container size={containerSize}>
      <div
        className={cn(
          {
            'text-left': align === 'left',
            'text-center': align === 'center',
            'text-right': align === 'right',
          },
          animate && 'motion-safe:animate-fadeIn opacity-0 transition-opacity duration-700 ease-out'
        )}
      >
        {children}
      </div>
    </Container>
  ) : (
    children
  );

  return (
    <Tag
      id={id}
      aria-labelledby={id ? `${id}-heading` : undefined}
      className={cn(
        // Spacing system (mobile → desktop)
        {
          'py-0': spacing === 'none',
          'py-8 sm:py-12': spacing === 'sm',
          'py-12 sm:py-16': spacing === 'md',
          'py-16 sm:py-20': spacing === 'lg',
          'py-24 sm:py-32': spacing === 'xl',
        },
        // Background system
        {
          'bg-transparent': background === 'transparent',
          'bg-white dark:bg-neutral-900': background === 'neutral',
          'bg-brand-primary/10 dark:bg-brand-primary/5': background === 'accent',
          'bg-gradient-to-br from-white to-neutral-50 dark:from-neutral-900 dark:to-neutral-800':
            background === 'gradient',
        },
        // Smooth transitions for dark/light switch
        'transition-colors duration-300 ease-in-out',
        className
      )}
      role={Tag === 'section' ? 'region' : undefined}
    >
      {content}
    </Tag>
  );
}

export default Section;
