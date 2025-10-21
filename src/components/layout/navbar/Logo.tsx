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
  /** Disable floating animation */
  readonly static?: boolean;
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
  static: isStatic = false,
  noShimmer = false,
  className,
  onClick,
}: LogoProps): React.JSX.Element {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
  };

  const logoElement = (
    <div
      className={cn(
        'relative inline-flex items-center justify-center',
        sizeClasses[size],
        !isStatic && 'animate-luxuryFloat',
        !noShimmer && 'animate-logoShimmer',
        'transition-transform duration-300 hover:scale-[1.05]',
        className
      )}
    >
      {/* Logo Image */}
      <Image
        src='/logo.svg'
        alt={`${brandConfig.identity.name} Logo`}
        fill
        className={cn('object-contain drop-shadow-lg', 'dark:brightness-[1.1]')}
        priority
      />
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
