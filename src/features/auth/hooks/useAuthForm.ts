/**
 * 🎯 useAuthForm Hook - Vantage Lane 2.0
 *
 * Hook centralizat pentru logic form Auth
 * Gestionează validare, submit, loading, errors
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import type { AuthMode, SignInFormData, SignUpFormData } from '../types/auth.types';
import {
  signInSchema,
  signUpSchema,
  type SignInSchemaType,
  type SignUpSchemaType,
} from '../validation/authSchema';
import { signInWithEmail, signUpWithEmail } from '../services/supabaseAuth';

interface UseAuthFormOptions {
  mode: AuthMode;
  redirectTo?: string | undefined;
  onSuccess?: (() => void) | undefined;
  onError?: ((error: Error) => void) | undefined;
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

  // Initialize react-hook-form with Zod validation
  const form = useForm<SignInSchemaType | SignUpSchemaType>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues:
      mode === 'signin'
        ? {
            email: '',
            password: '',
            rememberMe: false,
          }
        : {
            email: '',
            password: '',
            confirmPassword: '',
            firstName: '',
            lastName: '',
            phone: '',
            acceptTerms: false,
            marketingConsent: false,
          },
  });

  /**
   * Handle form submission
   */
  const onSubmit = async (data: SignInFormData | SignUpFormData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      let result;

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
        setTimeout(() => {
          router.push(redirectTo);
          onSuccess?.();
        }, 1000);
      } else {
        setSuccess('Account created! Please check your email to verify your account.');
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
 * Convert Supabase error to user-friendly message
 */
function getErrorMessage(error: Error): string {
  const message = error.message.toLowerCase();

  if (message.includes('invalid login credentials')) {
    return 'Invalid email or password. Please try again.';
  }

  if (message.includes('email already registered') || message.includes('user already registered')) {
    return 'An account with this email already exists.';
  }

  if (message.includes('invalid email')) {
    return 'Please enter a valid email address.';
  }

  if (message.includes('password')) {
    return 'Password must be at least 8 characters long.';
  }

  if (message.includes('network')) {
    return 'Network error. Please check your connection and try again.';
  }

  // Default fallback
  return error.message || 'An error occurred. Please try again.';
}
