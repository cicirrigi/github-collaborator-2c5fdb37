/**
 * 🔄 usePasswordReset Hook - Vantage Lane 2.0
 *
 * Hook pentru forgot password functionality
 * Gestionează trimiterea email-ului de resetare parolă
 */

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import type { ForgotPasswordFormData } from '../types/auth.types';
import { forgotPasswordSchema } from '../validation/authSchema';
import { sendPasswordResetEmail } from '../services/supabaseAuth';
import { authTokens } from '../tokens/authTokens';

interface UsePasswordResetOptions {
  onSuccess?: (email: string) => void;
  onError?: (error: Error) => void;
}

export function usePasswordReset(options?: UsePasswordResetOptions) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // React Hook Form setup
  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const { handleSubmit, reset } = form;

  /**
   * Handle forgot password form submission
   */
  const onSubmit = handleSubmit(async (data: ForgotPasswordFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);

      const { error: resetError } = await sendPasswordResetEmail(data.email);

      if (resetError) {
        // Map technical Supabase errors to user-friendly messages
        const friendlyMessage = resetError.message.includes('User not found')
          ? authTokens.messages.forgotPassword.userNotFound
          : authTokens.messages.forgotPassword.generic;

        setError(friendlyMessage);
        options?.onError?.(resetError);
        return;
      }

      setSuccess(authTokens.messages.forgotPassword.success);
      options?.onSuccess?.(data.email);
      reset(); // Clear form on success
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send reset email';
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

  /**
   * Reset form to initial state
   */
  const resetForm = () => {
    reset();
    clearMessages();
  };

  return {
    // Form management
    form,
    onSubmit,

    // State
    isLoading,
    error,
    success,

    // Actions
    clearMessages,
    resetForm,
  };
}
