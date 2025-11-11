/**
 * 📝 AuthForm Component - Vantage Lane 2.0
 *
 * Universal form component pentru Sign In / Sign Up
 * Schimbă fields în funcție de mode
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
        className={cn(
          tokens.layout.spacing,
          'flex-1 transition-all duration-500 ease-in-out flex flex-col justify-start'
        )}
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
        <div
          className={cn(
            'transition-all duration-500 ease-in-out transform-gpu',
            mode === 'signup'
              ? 'max-h-[400px] opacity-100 mb-6 overflow-visible'
              : 'max-h-0 opacity-0 mb-0 overflow-hidden'
          )}
        >
          <div
            className={cn(
              'space-y-6 transition-opacity duration-200',
              mode === 'signup' ? 'delay-100 opacity-100' : 'delay-0 opacity-0'
            )}
          >
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <AuthField
                name='firstName'
                label='First Name'
                type='text'
                placeholder='John'
                required
                autoComplete='given-name'
                register={register}
                errors={errors}
                disabled={isLoading}
              />

              <AuthField
                name='lastName'
                label='Last Name'
                type='text'
                placeholder='Doe'
                required
                autoComplete='family-name'
                register={register}
                errors={errors}
                disabled={isLoading}
              />
            </div>

            <AuthField
              name='phone'
              label='Phone Number'
              type='tel'
              placeholder='+44 123 456 7890'
              autoComplete='tel'
              register={register}
              errors={errors}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Email (both modes) */}
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

        {/* Password (both modes) */}
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

        {/* Confirm Password (signup only) */}
        <div
          className={cn(
            'transition-all duration-500 ease-in-out overflow-hidden transform-gpu',
            mode === 'signup' ? 'max-h-[120px] opacity-100 mb-6' : 'max-h-0 opacity-0 mb-0'
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
          <div className={tokens.actions.container}>
            <label className={tokens.checkbox.container}>
              <input
                type='checkbox'
                style={{
                  WebkitAppearance: 'none',
                  MozAppearance: 'none',
                  appearance: 'none',
                  outline: 'none',
                  border: '0',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 1px 2px rgba(0,0,0,0.1)',
                }}
                className={tokens.checkbox.input}
                {...register('rememberMe')}
                disabled={isLoading}
              />
              <span className={tokens.checkbox.label}>Remember me</span>
            </label>

            <Link href='/auth/forgot-password' className={tokens.actions.forgotPassword}>
              Forgot password?
            </Link>
          </div>
        )}

        {/* Terms & Conditions (signup only) */}
        <div
          className={cn(
            'transition-all duration-500 ease-in-out overflow-hidden transform-gpu',
            mode === 'signup' ? 'max-h-[220px] opacity-100 mb-6' : 'max-h-0 opacity-0 mb-0'
          )}
        >
          <div className='space-y-4'>
            <label className={tokens.checkbox.container}>
              <input
                type='checkbox'
                style={{
                  WebkitAppearance: 'none',
                  MozAppearance: 'none',
                  appearance: 'none',
                  outline: 'none',
                  border: '0',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 1px 2px rgba(0,0,0,0.1)',
                }}
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
                style={{
                  WebkitAppearance: 'none',
                  MozAppearance: 'none',
                  appearance: 'none',
                  outline: 'none',
                  border: '0',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 1px 2px rgba(0,0,0,0.1)',
                }}
                className={tokens.checkbox.input}
                {...register('marketingConsent')}
                disabled={isLoading}
              />
              <span className={tokens.checkbox.label}>Send me exclusive offers and updates</span>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <AuthButton type='submit' isLoading={isLoading}>
          {mode === 'signin' ? 'Sign In' : 'Create Account'}
        </AuthButton>

        {/* Social Auth Buttons */}
        <SocialAuthButtons
          onProviderClick={handleSocialAuth}
          isLoading={isLoading}
          disabled={isLoading}
        />
      </form>
    </div>
  );
}
