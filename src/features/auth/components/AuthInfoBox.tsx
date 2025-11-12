/**
 * 📝 AuthInfoBox Component - Vantage Lane 2.0
 *
 * Reutilizabil pentru toate tipurile de mesaje în formulare
 * Suportă info, success, error cu design tokens consistenti
 */

'use client';

import { cn } from '@/lib/utils/cn';
import { authTokens as tokens } from '../tokens/authTokens';

type InfoBoxVariant = 'info' | 'success' | 'error';

interface AuthInfoBoxProps {
  variant: InfoBoxVariant;
  children: React.ReactNode;
  className?: string;
  role?: 'alert' | 'status' | 'note';
  ariaLive?: 'polite' | 'assertive' | 'off';
}

/**
 * Variante de stil pentru fiecare tip de mesaj
 */
const variantStyles: Record<InfoBoxVariant, string> = {
  info: 'p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-sm',
  success: tokens.message.success,
  error: tokens.message.error,
};

/**
 * Role-uri ARIA recomandate pentru fiecare variant
 */
const defaultRoles: Record<InfoBoxVariant, 'alert' | 'status' | 'note'> = {
  info: 'note',
  success: 'status',
  error: 'alert',
};

/**
 * Aria-live values pentru fiecare tip
 */
const defaultAriaLive: Record<InfoBoxVariant, 'polite' | 'assertive' | 'off'> = {
  info: 'off',
  success: 'polite',
  error: 'assertive',
};

export function AuthInfoBox({ variant, children, className, role, ariaLive }: AuthInfoBoxProps) {
  const finalRole = role || defaultRoles[variant];
  const finalAriaLive = ariaLive || defaultAriaLive[variant];

  return (
    <div
      className={cn(variantStyles[variant], className)}
      role={finalRole}
      aria-live={finalAriaLive}
    >
      {children}
    </div>
  );
}
