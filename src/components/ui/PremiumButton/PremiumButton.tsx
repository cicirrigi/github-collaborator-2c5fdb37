/**
 * 🧩 PremiumButton – Vantage Lane UI v3.0.1
 * Simplified non-polymorphic component
 */

'use client';

import { forwardRef, type ElementType, type ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';
import { PremiumButtonVariants } from './PremiumButton.variants';

export type PremiumButtonVariant = 'default' | 'primary' | 'secondary';
export type PremiumButtonSize = 'sm' | 'md' | 'lg';

export interface PremiumButtonProps {
  readonly as?: ElementType;
  readonly className?: string;
  readonly children?: ReactNode;
  readonly variant?: PremiumButtonVariant;
  readonly size?: PremiumButtonSize;
  readonly disabled?: boolean;
  readonly loading?: boolean;
  readonly 'aria-label'?: string;
  readonly onClick?: () => void;
  readonly onKeyDown?: (e: React.KeyboardEvent) => void;
  readonly role?: string;
  readonly tabIndex?: number;
}

export const PremiumButton = forwardRef<HTMLElement, PremiumButtonProps>(function PremiumButton(
  {
    as,
    className,
    children,
    variant = 'default',
    size = 'md',
    disabled = false,
    loading = false,
    'aria-label': ariaLabel,
    onClick,
    onKeyDown,
    role,
    tabIndex,
  },
  ref
) {
  const Comp = (as ?? 'div') as ElementType;
  const classes = PremiumButtonVariants({ variant, size, disabled });

  return (
    <Comp
      ref={ref}
      type={Comp === 'button' ? 'button' : undefined}
      aria-label={ariaLabel}
      aria-disabled={disabled || loading || undefined}
      aria-busy={loading || undefined}
      role={Comp === 'button' ? 'button' : role}
      tabIndex={disabled || loading ? -1 : tabIndex || 0}
      onClick={onClick}
      onKeyDown={onKeyDown}
      data-variant={variant}
      data-size={size}
      data-loading={loading || undefined}
      className={cn(
        classes,
        'select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/50',
        className
      )}
    >
      {loading ? (
        <span className='flex items-center gap-2'>
          <svg className='h-4 w-4 animate-spin' fill='none' viewBox='0 0 24 24'>
            <circle
              className='opacity-25'
              cx='12'
              cy='12'
              r='10'
              stroke='currentColor'
              strokeWidth='4'
            ></circle>
            <path
              className='opacity-75'
              fill='currentColor'
              d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
            ></path>
          </svg>
          {children}
        </span>
      ) : (
        children
      )}
    </Comp>
  );
});

PremiumButton.displayName = 'PremiumButton';
export default PremiumButton;
