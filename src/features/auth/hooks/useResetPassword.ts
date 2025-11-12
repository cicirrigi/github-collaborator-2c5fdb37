/**
 * 🔐 useResetPassword Hook - Vantage Lane 2.0
 *
 * Hook pentru reset password functionality
 * Gestionează setarea unei parole noi cu token de verificare
 */

'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';

import type { ResetPasswordFormData } from '../types/auth.types';
import { resetPasswordSchema } from '../validation/authSchema';
import { updatePassword } from '../services/supabaseAuth';
import { authTokens } from '../tokens/authTokens';

interface UseResetPasswordOptions {
  redirectTo?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useResetPassword(options?: UseResetPasswordOptions) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Get token from URL params
  const token = searchParams?.get('access_token') || '';

  // React Hook Form setup
  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token,
      password: '',
      confirmPassword: '',
    },
  });

  const { handleSubmit, setValue } = form;

  // Update token in form when it changes
  useEffect(() => {
    if (token) {
      setValue('token', token);
    }
  }, [token, setValue]);

  /**
   * Handle reset password form submission
   */
  const onSubmit = handleSubmit(async (data: ResetPasswordFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);

      if (!data.token) {
        setError(authTokens.messages.resetPassword.tokenMissing);
        return;
      }

      // Additional password validation
      if (!data.password || data.password.length < 8) {
        setError('Password must be at least 8 characters long.');
        return;
      }

      // Supabase injects the reset token automatically in session context
      // No need to pass it manually to updateUser()
      const { error: updateError } = await updatePassword(data.password);

      if (updateError) {
        // Map technical errors to user-friendly messages
        const friendlyMessage =
          updateError.message.includes('token') || updateError.message.includes('expired')
            ? authTokens.messages.resetPassword.tokenInvalid
            : authTokens.messages.resetPassword.generic;

        setError(friendlyMessage);
        options?.onError?.(updateError);
        return;
      }

      setSuccess(authTokens.messages.resetPassword.success);
      options?.onSuccess?.();

      // Redirect after success
      setTimeout(() => {
        router.push(options?.redirectTo || '/auth/signin');
      }, 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update password';
      setError(errorMessage);
      options?.onError?.(new Error(errorMessage));
    } finally {
      setIsLoading(false);
    }
  });

  /**
   * Clear error and success messages
   */
  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  return {
    // Form management
    form,
    onSubmit,

    // State
    isLoading,
    error,
    success,
    token,

    // Actions
    clearMessages,
  };
}
