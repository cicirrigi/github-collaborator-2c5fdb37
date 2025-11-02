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

      {/* Brand Text from config */}
      <div className={cn('font-sans tracking-wide uppercase font-light', textSizeClasses[size])}>
        <span style={{ color: brandConfig.logo.colors.primary }}>
          {brandConfig.logo.text.primary}
        </span>
        <span className='ml-1' style={{ color: brandConfig.logo.colors.secondary }}>
          {brandConfig.logo.text.secondary}
        </span>
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
