/**
 * 📝 AuthForm Component - Vantage Lane 2.0
 *
 * Universal form component pentru Sign In / Sign Up
 * Compact și modular
 */

'use client';

import { cn } from '@/lib/utils/cn';
import Link from 'next/link';
import { useAuthForm } from '../hooks/useAuthForm';
import { authTokens as tokens } from '../tokens/authTokens';
import { signInWithProvider } from '../services/supabaseAuth';
import type { AuthMode, SocialProvider } from '../types/auth.types';
import { AuthButton } from './AuthButton';
import { AuthField } from './AuthField';
import { SocialAuthButtons } from './SocialAuthButtons';
import { SignUpFields } from './SignUpFields';
import { TermsAndConditions } from './TermsAndConditions';

interface AuthFormProps {
  mode: AuthMode;
  redirectTo?: string;
  onSuccess?: () => void;
}

export function AuthForm({ mode, redirectTo, onSuccess }: AuthFormProps) {
  const { form, isLoading, error, success, onSubmit } = useAuthForm({
    mode,
    redirectTo,
    onSuccess,
  });

  const {
    register,
    formState: { errors },
  } = form;

  /**
   * Handle social provider authentication
   */
  const handleSocialAuth = async (provider: SocialProvider) => {
    try {
      const result = await signInWithProvider(provider);
      if (result.error) {
        // Could show a toast notification here
        // TODO: Add proper error handling
      }
      // OAuth redirect happens automatically
    } catch {
      // TODO: Add proper error handling
    }
  };

  return (
    <div className='w-full flex flex-col'>
      <form
        onSubmit={onSubmit}
        className='flex-1 flex flex-col justify-start'
        aria-label={mode === 'signin' ? 'Sign in form' : 'Sign up form'}
        id='auth-panel'
        role='tabpanel'
      >
        {/* Error Message */}
        {error && (
          <div className={tokens.message.error} role='alert' aria-live='polite'>
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className={tokens.message.success} role='status' aria-live='polite'>
            {success}
          </div>
        )}

        {/* Sign Up Only Fields */}
        <div className='mt-6'>
          <SignUpFields mode={mode} register={register} errors={errors} isLoading={isLoading} />
        </div>

        {/* Email (both modes) */}
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

        {/* Password (both modes) */}
        <div className='mt-6'>
          <AuthField
            name='password'
            label='Password'
            type='password'
            placeholder='••••••••'
            required
            autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
            register={register}
            errors={errors}
            disabled={isLoading}
          />
        </div>

        {/* Confirm Password (signup only) */}
        <div
          className={cn(
            'mt-6 transition-all overflow-hidden',
            tokens.accordion.durations.confirm,
            tokens.accordion.easing.container,
            mode === 'signup'
              ? `${tokens.accordion.maxHeights.confirm} opacity-100`
              : 'max-h-0 opacity-0'
          )}
        >
          <AuthField
            name='confirmPassword'
            label='Confirm Password'
            type='password'
            placeholder='••••••••'
            required
            autoComplete='new-password'
            register={register}
            errors={errors}
            disabled={isLoading}
          />
        </div>

        {/* Remember Me / Forgot Password (signin only) */}
        {mode === 'signin' && (
          <div className={cn(tokens.actions.container, 'mt-6')}>
            <label className={tokens.checkbox.container}>
              <input type='checkbox' className={tokens.checkbox.input} disabled={isLoading} />
              <span className={tokens.checkbox.label}>Remember me</span>
            </label>
            <Link href='/auth/forgot-password' className={tokens.actions.forgotPassword}>
              Forgot password?
            </Link>
          </div>
        )}

        {/* Terms & Conditions (signup only) */}
        <div className='mt-6'>
          <TermsAndConditions
            mode={mode}
            register={register}
            errors={errors}
            isLoading={isLoading}
          />
        </div>

        {/* Submit Button */}
        <div className='mt-8'>
          <AuthButton type='submit' isLoading={isLoading}>
            {mode === 'signin' ? 'Sign In' : 'Create Account'}
          </AuthButton>
        </div>

        {/* Social Auth Buttons */}
        <div className='mt-8'>
          <SocialAuthButtons
            onProviderClick={handleSocialAuth}
            isLoading={isLoading}
            disabled={isLoading}
          />
        </div>
      </form>
    </div>
  );
}
