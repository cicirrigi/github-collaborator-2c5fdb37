/**
 * 📝 TermsAndConditions - Componenta pentru Sign Up terms
 * acceptTerms, marketingConsent cu acordeon smooth
 */

'use client';

import { cn } from '@/lib/utils/cn';
import Link from 'next/link';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { AuthMode } from '../types/auth.types';
import { authTokens as tokens } from '../tokens/authTokens';

interface TermsAndConditionsProps {
  mode: AuthMode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: FieldErrors<any>;
  isLoading: boolean;
}

export function TermsAndConditions({ mode, register, errors, isLoading }: TermsAndConditionsProps) {
  return (
    <div
      className={cn(
        `transition-all ${tokens.accordion.durations.terms} ${tokens.accordion.easing.container} overflow-hidden`,
        mode === 'signup'
          ? `${tokens.accordion.maxHeights.terms} opacity-100 mb-6`
          : 'max-h-0 opacity-0 mb-0'
      )}
    >
      <div className={tokens.spacing.fieldGapSmall}>
        <label className={tokens.checkbox.container}>
          <input
            type='checkbox'
            className={tokens.checkbox.input}
            {...register('acceptTerms')}
            disabled={isLoading}
          />
          <span className={tokens.checkbox.label}>
            I accept the{' '}
            <Link href='/legal/terms' className={tokens.typography.link.base}>
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href='/legal/privacy' className={tokens.typography.link.base}>
              Privacy Policy
            </Link>
          </span>
        </label>
        {'acceptTerms' in errors && errors.acceptTerms && (
          <p className={cn(tokens.typography.error.base, '-mt-4')}>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {(errors as any).acceptTerms.message as string}
          </p>
        )}

        <label className={tokens.checkbox.container}>
          <input
            type='checkbox'
            className={tokens.checkbox.input}
            {...register('marketingConsent')}
            disabled={isLoading}
          />
          <span className={tokens.checkbox.label}>Send me exclusive offers and updates</span>
        </label>
      </div>
    </div>
  );
}
