/**
 * 🎯 useAuthForm Hook - Vantage Lane 2.0
 *
 * Hook centralizat pentru logic form Auth
 * Gestionează validare, submit, loading, errors
 */

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { signInWithEmail, signUpWithEmail } from '../services/supabaseAuth';
import type { AuthMode, SignInFormData, SignUpFormData } from '../types/auth.types';
import { signInSchema, signUpSchema } from '../validation/authSchema';

// Union types for conditional form handling
type AuthFormData = SignInFormData | SignUpFormData;
type AuthDefaultValues = SignInFormData | SignUpFormData;

interface UseAuthFormOptions {
  mode: AuthMode;
  redirectTo?: string | undefined;
  onSuccess?: (() => void) | undefined;
  onError?: ((error: Error) => void) | undefined;
}

// Helper function for default values
function getDefaultValues(mode: AuthMode) {
  return mode === 'signin'
    ? { email: '', password: '', rememberMe: false }
    : {
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        phone: '',
        acceptTerms: false,
        marketingConsent: false,
      };
}

export function useAuthForm({
  mode,
  redirectTo = '/dashboard',
  onSuccess,
  onError,
}: UseAuthFormOptions) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Select schema based on mode
  const schema = mode === 'signin' ? signInSchema : signUpSchema;
  const defaultValues = getDefaultValues(mode);

  // Use proper union types for conditional form handling
  const form = useForm<AuthFormData>({
    resolver: zodResolver(schema),
    mode: 'onBlur' as const,
    defaultValues: defaultValues as AuthDefaultValues,
  });

  /**
   * Handle form submission
   */
  const onSubmit = async (data: AuthFormData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      let result;

      // Type-safe branching based on mode
      if (mode === 'signin') {
        result = await signInWithEmail(data as SignInFormData);
      } else {
        result = await signUpWithEmail(data as SignUpFormData);
      }

      if (result.error || !result.user) {
        const errorMessage = result.error ? getErrorMessage(result.error) : 'Authentication failed';
        setError(errorMessage);
        onError?.(result.error || new Error(errorMessage));
        return;
      }

      // Success
      if (mode === 'signin') {
        setSuccess('Sign in successful! Redirecting...');
      } else {
        // Redirect to verify-email page after successful signup
        const email = (data as SignUpFormData).email;
        router.push(`/auth/verify-email?email=${encodeURIComponent(email)}`);
        onSuccess?.();
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An unexpected error occurred');
      setError(error.message);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Clear errors
   */
  const clearError = () => setError(null);

  /**
   * Clear success message
   */
  const clearSuccess = () => setSuccess(null);

  // Reset form ONLY if schema actually changes, not every tab switch
  useEffect(() => {
    form.reset(getDefaultValues(mode), { keepValues: false });
    setError(null);
    setSuccess(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]); // 🟢 Intentionally omit "form" - prevents infinite re-renders

  // Handle redirect with cleanup
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (success?.includes('Redirecting')) {
      timeout = setTimeout(() => {
        router.push(redirectTo);
        onSuccess?.();
      }, 1000);
    }
    return () => clearTimeout(timeout);
  }, [success, redirectTo, onSuccess, router]);

  return {
    form,
    isLoading,
    error,
    success,
    onSubmit: form.handleSubmit(onSubmit),
    clearError,
    clearSuccess,
  };
}

/**
 * Convert Supabase errors to user-friendly messages
 */
function getErrorMessage(error: Error): string {
  const message = error.message.toLowerCase();

  // Authentication errors
  if (/invalid.*credential/i.test(message)) {
    return 'Invalid email or password. Please try again.';
  }

  if (/already.*registered/i.test(message)) {
    return 'This email is already registered. Please sign in instead.';
  }

  if (/invalid.*email/i.test(message)) {
    return 'Please enter a valid email address.';
  }

  if (/password.*weak/i.test(message)) {
    return 'Password is too weak. Please use at least 8 characters with letters and numbers.';
  }

  if (/password/i.test(message)) {
    return 'Password must be at least 8 characters long.';
  }

  // Network errors
  if (/network|fetch|connection/i.test(message)) {
    return 'Network error. Please check your connection and try again.';
  }

  // Rate limiting
  if (/rate.*limit|too.*many/i.test(message)) {
    return 'Too many attempts. Please wait a few minutes before trying again.';
  }

  // Email verification
  if (/email.*confirm|verify/i.test(message)) {
    return 'Please check your email and click the verification link.';
  }

  // Generic fallback
  return error.message || 'An error occurred. Please try again.';
}
