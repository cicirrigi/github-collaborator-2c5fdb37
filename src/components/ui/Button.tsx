/**
 * 🔘 Button Component - Vantage Lane 2.0
 *
 * Enterprise-grade button with configurable variants and sizes.
 * Connected to theme.config.ts for consistency.
 */

import type React from 'react';

import { themeConfig } from '@/config/theme.config';
import { cn } from '@/lib/utils/cn';

type ButtonVariant = keyof typeof themeConfig.components.button.variants;
type ButtonSize = keyof typeof themeConfig.components.button.sizes;

export interface ButtonProps {
  readonly variant?: ButtonVariant;
  readonly size?: ButtonSize;
  readonly className?: string;
  readonly disabled?: boolean;
  readonly loading?: boolean;
  readonly children: React.ReactNode;
  readonly onClick?: () => void;
  readonly type?: 'button' | 'submit' | 'reset';
}

/**
 * 🎨 Universal button component with theme integration
 */
export function Button({
  variant = 'primary',
  size = 'md',
  className,
  disabled = false,
  loading = false,
  children,
  onClick,
  type = 'button',
}: ButtonProps): React.JSX.Element {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        // Base styles from theme config
        themeConfig.components.button.base,
        // Variant styles from theme config
        themeConfig.components.button.variants[variant],
        // Size styles from theme config
        themeConfig.components.button.sizes[size],
        // Disabled state
        disabled && 'cursor-not-allowed opacity-50',
        // Loading state
        loading && 'cursor-wait',
        // Custom className
        className
      )}
    >
      {loading ? (
        <div className='flex items-center gap-2'>
          <div className='h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent' />
          {children}
        </div>
      ) : (
        children
      )}
    </button>
  );
}

export default Button;
