/**
 * 🎯 AuthButton Component - Vantage Lane 2.0
 *
 * Primary CTA button pentru submit
 * Cu loading state și disabled
 */

'use client';

import { memo } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

import { authTokens as tokens } from '../tokens/authTokens';

interface AuthButtonProps {
  children: React.ReactNode;
  type?: 'button' | 'submit';
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export const AuthButton = memo(function AuthButton({
  children,
  type = 'submit',
  isLoading = false,
  disabled = false,
  onClick,
}: AuthButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={cn(
        tokens.button.primary.base,
        tokens.button.primary.background,
        tokens.button.primary.text,
        tokens.button.primary.disabled
      )}
    >
      {isLoading ? (
        <div className={tokens.button.primary.loading}>
          <Loader2 className={`${tokens.sizes.iconSmall} animate-spin`} />
          <span>Processing...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
});
