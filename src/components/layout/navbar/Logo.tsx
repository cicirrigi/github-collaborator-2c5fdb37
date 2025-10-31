'use client';

import Image from 'next/image';
import Link from 'next/link';
import type React from 'react';

import { brandConfig } from '@/config/brand.config';
import { cn } from '@/lib/utils/cn';

/**
 * 🎨 Vantage Lane Logo (final version)
 * - Floating luxury animation
 * - Optional shimmer effect
 * - Light/dark adaptive
 * - Fully reusable
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

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  const logoElement = (
    <div
      className={cn(
        'relative inline-flex items-center gap-3',
        // Removed animate-luxuryFloat (breathe effect)
        !noShimmer && 'animate-logoShimmer',
        'transition-transform duration-300 hover:scale-[1.05]',
        className
      )}
    >
      {/* Clean Logo - scaled up without affecting navbar height */}
      <div className={cn('relative', logoSizeClasses[size])} style={{ transform: 'scale(1.3)' }}>
        <Image
          src='/LOGO/logo transparent.png'
          alt='Vantage Lane Logo'
          fill
          className={cn('object-contain drop-shadow-lg', 'dark:brightness-[1.1]')}
          priority
          unoptimized
        />
      </div>

      {/* Brand Text with Geist-like styling */}
      <div className={cn('font-sans font-bold tracking-tight', textSizeClasses[size])}>
        <span className='text-black dark:text-white'>VANTAGE</span>
        <span className='text-[var(--brand-primary)] ml-1'>LANE</span>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className='inline-block rounded-full focus:outline-none focus:ring-2 focus:ring-brand-primary/50'
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
