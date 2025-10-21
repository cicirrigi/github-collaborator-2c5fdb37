/**
 * 🧩 TestButton – Vantage Lane UI v3.0.1
 * Fixed forwardRef typings for generic polymorphic components
 */

'use client';

import { forwardRef, type ElementType, type ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';
import { TestButtonVariants } from './TestButton.variants';

export type TestButtonVariant = 'default' | 'primary' | 'secondary';
export type TestButtonSize = 'sm' | 'md' | 'lg';

export interface TestButtonProps {
  readonly as?: ElementType;
  readonly className?: string;
  readonly children?: ReactNode;
  readonly variant?: TestButtonVariant;
  readonly size?: TestButtonSize;
  readonly disabled?: boolean;
  readonly 'aria-label'?: string;
  readonly onClick?: () => void;
  readonly onKeyDown?: (e: React.KeyboardEvent) => void;
  readonly role?: string;
  readonly tabIndex?: number;
}

export const TestButton = forwardRef<HTMLElement, TestButtonProps>(function TestButton(
  {
    as,
    className,
    children,
    variant = 'default',
    size = 'md',
    disabled = false,
    'aria-label': ariaLabel,
    onClick,
    onKeyDown,
    role,
    tabIndex,
  },
  ref
) {
  const Comp = (as ?? 'div') as ElementType;
  const classes = TestButtonVariants({ variant, size, disabled });

  return (
    <Comp
      ref={ref}
      aria-label={ariaLabel}
      aria-disabled={disabled || undefined}
      role={Comp === 'button' ? 'button' : role}
      tabIndex={disabled ? -1 : tabIndex || 0}
      onClick={onClick}
      onKeyDown={onKeyDown}
      className={cn(
        classes,
        'select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/50',
        className
      )}
    >
      {children}
    </Comp>
  );
});

TestButton.displayName = 'TestButton';
export default TestButton;
