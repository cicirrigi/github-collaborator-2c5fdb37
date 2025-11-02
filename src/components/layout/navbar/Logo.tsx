'use client';

import Image from 'next/image';
import Link from 'next/link';
import type React from 'react';

import { brandConfig } from '@/config/brand.config';
import { cn } from '@/lib/utils/cn';

/**
 * 🎨 Vantage Lane Logo (config-driven version)
 * - Text styling from brand.config.ts
 * - Optional shimmer effect
 * - Theme adaptive colors
 * - Zero hardcodări
 * - Matches original site styling
 */

export interface LogoProps {
  /** Size preset */
  readonly size?: 'sm' | 'md' | 'lg';
  /** Link destination */
  readonly href?: string;
  /** Disable shimmer effect */
  readonly noShimmer?: boolean;
  /** Extra classes */
  readonly className?: string;
  /** Click handler */
  readonly onClick?: () => void;
}

export function Logo({
  size = 'md',
  href = '/',
  noShimmer = false,
  className,
  onClick,
}: LogoProps): React.JSX.Element {
  const logoSizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const logoElement = (
    <div
      className={cn(
        // fluid, fără width fix
        'relative flex items-center gap-1 sm:gap-2 flex-shrink-0',
        !noShimmer && 'animate-logoShimmer',
        'transition-transform duration-300 hover:scale-[1.03]',
        className
      )}
    >
      {/* imagine fluidă, cu min-width pentru protecție */}
      <div
        className={cn(
          'relative min-w-[32px] sm:min-w-[40px]',
          logoSizeClasses[size],
          'scale-[1.2] sm:scale-[1.4] md:scale-[1.6] lg:scale-[1.7]',
          'translate-y-[1px] transition-transform duration-300 ease-out'
        )}
      >
        <Image
          src='/LOGO/logo transparent.png'
          alt='Vantage Lane Logo'
          fill
          className='object-contain drop-shadow-lg dark:brightness-[1.1]'
          priority
          unoptimized
        />
      </div>

      {/* text fluid - optically centered */}
      <div
        className={cn(
          'font-sans tracking-wide uppercase font-light select-none -translate-y-[1px]',
          'text-base sm:text-lg md:text-xl lg:text-xl leading-none transition-all duration-300'
        )}
      >
        <span className='bg-gradient-to-r from-[#d4b870] to-[#bfa156] bg-clip-text text-transparent'>
          {brandConfig.logo.text.primary}
        </span>
        <span className='ml-1 text-white'>{brandConfig.logo.text.secondary}</span>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className='inline-block rounded-full focus:outline-none focus:ring-2 focus:ring-brand-primary/50 mr-4 sm:mr-6 md:mr-8 lg:mr-10'
        aria-label={`${brandConfig.identity.name} - Home`}
        {...(onClick && { onClick })}
      >
        {logoElement}
      </Link>
    );
  }

  return logoElement;
}

export default Logo;
