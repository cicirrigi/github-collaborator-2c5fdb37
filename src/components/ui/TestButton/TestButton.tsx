/**
 * 🧩 TestButton – Vantage Lane UI v3.0.0
 * Generated on 2025-10-20T00:24:01.156Z
 * Type: base
 */

'use client';

import React, { forwardRef, type JSX, type ReactNode, type ElementType, type ComponentPropsWithRef } from 'react';
import { cn } from '@/lib/utils/cn';
import { designTokens } from '@/config/design-tokens';
import { brandConfig } from '@/config/brand.config';
import { TestButtonVariants } from './TestButton.variants';

export type TestButtonVariant = 'default' | 'primary' | 'secondary';
export type TestButtonSize = 'sm' | 'md' | 'lg';

export interface TestButtonProps<T extends ElementType = 'div'> extends Omit<ComponentPropsWithRef<T>, 'as' | 'color'> {
  readonly as?: T;
  readonly className?: string;
  readonly children?: ReactNode;
  readonly variant?: TestButtonVariant;
  readonly size?: TestButtonSize;
  readonly disabled?: boolean;
  readonly 'aria-label'?: string;
}

export const TestButton = forwardRef<HTMLElement, TestButtonProps>(
  function TestButton<T extends ElementType = 'div'>(
    { as, className, children, variant = 'default', size = 'md', disabled = false, 'aria-label': ariaLabel, ...rest }: TestButtonProps<T>,
    ref
  ): JSX.Element {
    const Comp = (as ?? 'div') as ElementType;

    const classes = TestButtonVariants({ variant, size, disabled });

    return (
      <Comp
        ref={ref}
        aria-label={ariaLabel}
        aria-disabled={disabled || undefined}
        role={Comp === 'button' ? 'button' : rest.role}
        tabIndex={disabled ? -1 : (rest.tabIndex || 0)}
        className={cn(
          classes,
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/50 select-none',
          className
        )}
        {...rest}
      >
        {children}
      </Comp>
    );
  }
);

TestButton.displayName = 'TestButton';
export default TestButton;
