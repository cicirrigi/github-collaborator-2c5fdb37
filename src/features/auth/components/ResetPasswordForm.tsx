/**
 * 🔐 ResetPasswordForm Component - Vantage Lane 2.0
 *
 * Formular pentru setarea unei parole noi cu token
 * Reutilizează AuthField și AuthButton pentru consistență
 */

'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

import { useResetPassword } from '../hooks/useResetPassword';
import { authTokens as tokens } from '../tokens/authTokens';
import { AuthButton } from './AuthButton';
import { AuthField } from './AuthField';
import { AuthInfoBox } from './AuthInfoBox';

interface ResetPasswordFormProps {
  redirectTo?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function ResetPasswordForm({ redirectTo, onSuccess, onError }: ResetPasswordFormProps) {
  const { form, onSubmit, isLoading, error, success, token } = useResetPassword({
    ...(redirectTo && { redirectTo }),
    ...(onSuccess && { onSuccess }),
    ...(onError && { onError }),
  });

  const {
    register,
    formState: { errors },
  } = form;

  // If no token, show error
  if (!token) {
    return (
      <div className='w-full flex flex-col'>
        <div className={tokens.message.error} role='alert'>
          Reset token is missing. Please use the link from your email.
        </div>
        <div className='text-center mt-6'>
          <Link
            href='/auth/forgot-password'
            className={cn(
              'text-sm font-medium transition-colors duration-300',
              'text-[var(--brand-primary)] hover:text-[var(--brand-primary)]/80',
              'focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/50'
            )}
          >
            Request new reset link →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full flex flex-col'>
      <form
        onSubmit={onSubmit}
        className={cn(tokens.layout.spacing, 'flex-1 flex flex-col justify-start')}
        aria-label='Reset password form'
        role='main'
      >
        {/* Error Message */}
        {error && <AuthInfoBox variant='error'>{error}</AuthInfoBox>}

        {/* Success Message */}
        {success && <AuthInfoBox variant='success'>{success}</AuthInfoBox>}

        {/* Instructions */}
        <AuthInfoBox variant='info'>Enter your new password below.</AuthInfoBox>

        {/* Password Fields */}
        <AuthField
          name='password'
          label='New Password'
          type='password'
          placeholder='••••••••'
          required
          autoComplete='new-password'
          register={register}
          errors={errors}
          disabled={isLoading}
        />

        <AuthField
          name='confirmPassword'
          label='Confirm New Password'
          type='password'
          placeholder='••••••••'
          required
          autoComplete='new-password'
          register={register}
          errors={errors}
          disabled={isLoading}
        />

        {/* Submit Button */}
        <AuthButton type='submit' isLoading={isLoading}>
          Update Password
        </AuthButton>

        {/* Back to Sign In */}
        <div className='text-center'>
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
