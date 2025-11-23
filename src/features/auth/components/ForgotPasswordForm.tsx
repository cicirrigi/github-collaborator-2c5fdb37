/**
 * 🔄 ForgotPasswordForm Component - Vantage Lane 2.0
 *
 * Formular pentru cererea de resetare parolă
 * Reutilizează AuthField și AuthButton pentru consistență
 */

'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

import { usePasswordReset } from '../hooks/usePasswordReset';
import { authTokens as tokens } from '../tokens/authTokens';
import { AuthButton } from './AuthButton';
import { AuthField } from './AuthField';
import { AuthInfoBox } from './AuthInfoBox';

interface ForgotPasswordFormProps {
  onSuccess?: (email: string) => void;
  onError?: (error: Error) => void;
}

export function ForgotPasswordForm({ onSuccess, onError }: ForgotPasswordFormProps) {
  const { form, onSubmit, isLoading, error, success } = usePasswordReset({
    ...(onSuccess && { onSuccess }),
    ...(onError && { onError }),
  });

  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className='w-full flex flex-col'>
      <form
        onSubmit={onSubmit}
        className='flex-1 flex flex-col justify-start'
        aria-label='Forgot password form'
        role='main'
      >
        {/* Error Message */}
        {error && <AuthInfoBox variant='error'>{error}</AuthInfoBox>}

        {/* Success Message */}
        {success && (
          <AuthInfoBox variant='success'>
            {success}
            <Link href='/auth/signin' className='underline ml-2'>
              Sign in now →
            </Link>
          </AuthInfoBox>
        )}

        {/* Instructions */}
        <div className='mt-6'>
          <AuthInfoBox variant='info'>{tokens.messages.forgotPassword.instructions}</AuthInfoBox>
        </div>

        {/* Email Field */}
        <div className='mt-6'>
          <AuthField
            name='email'
            label='Email Address'
            type='email'
            placeholder='you@example.com'
            required
            autoComplete='email'
            register={register}
            errors={errors}
            disabled={isLoading}
          />
        </div>

        {/* Submit Button */}
        <div className='mt-8'>
          <AuthButton type='submit' isLoading={isLoading}>
            Send Reset Link
          </AuthButton>
        </div>

        {/* Back to Sign In */}
        <div className='text-center mt-6'>
          <Link
            href='/auth/signin'
            className={cn(
              'text-sm font-medium transition-colors duration-300',
              'text-[var(--text-secondary)] hover:text-[var(--brand-primary)]',
              'focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/50'
            )}
          >
            ← Back to Sign In
          </Link>
        </div>
      </form>
    </div>
  );
}
