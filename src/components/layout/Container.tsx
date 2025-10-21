import type React from 'react';

import { cn } from '@/lib/utils/cn';

/**
 * 📦 Container component
 * Centers and limits content width across all pages with consistent spacing.
 *
 * ✅ Features:
 * - Responsive padding system (px-4 sm:px-6 lg:px-8)
 * - Configurable max-width presets via size prop
 * - Semantic HTML via as prop (div, main, section, article)
 * - Fluid mode option (removes max-width constraints)
 * - TypeScript strict with comprehensive prop validation
 * - Full accessibility and SEO optimization
 *
 * @example
 * // Standard content container
 * <Container size="lg">
 *   <MainContent />
 * </Container>
 *
 * @example
 * // Semantic section with medium width
 * <Container as="section" size="md">
 *   <BookingForm />
 * </Container>
 *
 * @example
 * // Full-width background section
 * <Container fluid className="bg-neutral-50 dark:bg-neutral-900">
 *   <HeroSection />
 * </Container>
 *
 * @example
 * // Article layout for blog posts
 * <Container as="article" size="sm">
 *   <BlogContent />
 * </Container>
 */

export interface ContainerProps {
  /** Content to render inside the container */
  children: React.ReactNode;
  /** Preset max-width variant for different content types */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Additional Tailwind classes for customization */
  className?: string;
  /** HTML element type for semantic markup */
  as?: React.ElementType;
  /** Removes max-width constraints for full-width layouts */
  fluid?: boolean;
}

export function Container({
  children,
  size = 'lg',
  className,
  as: Tag = 'div',
  fluid = false,
}: ContainerProps): React.JSX.Element {
  return (
    <Tag
      className={cn(
        // Base responsive padding system
        'mx-auto px-4 sm:px-6 lg:px-8',
        // Max-width system (disabled in fluid mode)
        !fluid && {
          'max-w-3xl': size === 'sm', // 768px - Articles, forms
          'max-w-4xl': size === 'md', // 896px - Content pages
          'max-w-6xl': size === 'lg', // 1152px - Standard layouts
          'max-w-7xl': size === 'xl', // 1280px - Wide layouts
          'max-w-full': size === 'full', // 100% - Full width
        },
        className
      )}
      {...(Tag === 'main' && { 'aria-label': 'Main content' })}
      {...(Tag === 'section' && { role: 'region' })}
    >
      {children}
    </Tag>
  );
}

export default Container;
