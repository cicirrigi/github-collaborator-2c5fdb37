'use client';

import { bookingSessionManager, PaymentState } from '@/lib/booking/session/BookingSessionManager';
import {
  paymentIntentManager,
  type PaymentIntentData,
} from '@/lib/booking/session/PaymentIntentManager';
import { useCallback, useEffect, useState } from 'react';

/**
 * 🏭 ENTERPRISE BOOKING PAYMENT HOOK
 *
 * Industry-standard React integration for payment intent management.
 * Eliminates incomplete transactions through intelligent session management.
 *
 * Features:
 * - Session-based payment intent reuse
 * - Lazy creation (only when needed)
 * - Automatic cleanup on success
 * - Zero abandoned intents in Stripe
 * - Recovery after browser refresh
 */

export interface UseBookingPaymentReturn {
  // Payment intent data
  paymentIntent: PaymentIntentData | null;
  clientSecret: string | null;
  isCreating: boolean;
  error: string | null;

  // Session management
  sessionId: string | null;
  bookingId: string | null;
  paymentState: PaymentState | null;

  // Actions
  initializePayment: (amount: number, customerEmail?: string) => Promise<PaymentIntentData | null>;
  markAsProcessing: () => void;
  markAsSucceeded: () => void;
  abandonPayment: () => void;

  // Debugging
  getPaymentStats: () => any;
  getSessionStats: () => any;
}

/**
 * Enterprise payment hook with session persistence
 */
export function useBookingPayment(): UseBookingPaymentReturn {
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntentData | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Initialize or reuse payment intent for given amount
   */
  const initializePayment = useCallback(
    async (amount: number, customerEmail?: string): Promise<PaymentIntentData | null> => {
      if (isCreating) {
        return paymentIntent; // Don't create multiple times
      }

      setIsCreating(true);
      setError(null);

      try {
        // Use PaymentIntentManager for smart creation/reuse
        const intent = await paymentIntentManager.getOrCreatePaymentIntent(amount, customerEmail);

        if (intent) {
          setPaymentIntent(intent);
          return intent;
        } else {
          setError('Failed to initialize payment intent');
          return null;
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMsg);
        return null;
      } finally {
        setIsCreating(false);
      }
    },
    [isCreating, paymentIntent]
  );

  /**
   * Mark payment as processing (user started payment)
   */
  const markAsProcessing = useCallback(() => {
    const session = bookingSessionManager.getCurrentSession(0);
    if (session) {
      paymentIntentManager.markPaymentAsProcessing(session.sessionId);
    }
  }, []);

  /**
   * Mark payment as succeeded and cleanup
   */
  const markAsSucceeded = useCallback(() => {
    const session = bookingSessionManager.getCurrentSession(0);
    if (session) {
      paymentIntentManager.markPaymentAsSucceeded(session.sessionId);

      // Clear local state after successful payment
      setTimeout(() => {
        setPaymentIntent(null);
        setError(null);
      }, 1000);
    }
  }, []);

  /**
   * Abandon current payment session
   */
  const abandonPayment = useCallback(() => {
    paymentIntentManager.abandonSession();
    setPaymentIntent(null);
    setError(null);
  }, []);

  /**
   * Get payment debugging statistics
   */
  const getPaymentStats = useCallback(() => {
    return paymentIntentManager.getPaymentStats();
  }, []);

  /**
   * Get session debugging statistics
   */
  const getSessionStats = useCallback(() => {
    return bookingSessionManager.getSessionStats();
  }, []);

  /**
   * Initialize from existing session on mount
   */
  useEffect(() => {
    const sessionStats = bookingSessionManager.getSessionStats();

    // If we have an active session with payment intent, restore it
    if (
      sessionStats.hasActiveSession &&
      sessionStats.paymentState === PaymentState.INTENT_CREATED
    ) {
      const session = bookingSessionManager.getCurrentSession(0);
      if (session && session.clientSecret && session.paymentIntentId) {
        setPaymentIntent({
          id: session.paymentIntentId,
          clientSecret: session.clientSecret,
          amount: session.totalAmount,
          currency: 'gbp',
          status: 'requires_payment_method',
        });
      }
    }
  }, []);

  /**
   * Cleanup on component unmount
   */
  useEffect(() => {
    return () => {
      // Don't abandon on unmount - session should persist across navigation
      // Only abandon if user explicitly closes browser/tab
    };
  }, []);

  // Derive current session data
  const sessionStats = bookingSessionManager.getSessionStats();
  const currentSession = sessionStats.hasActiveSession
    ? bookingSessionManager.getCurrentSession(0)
    : null;

  return {
    // Payment intent data
    paymentIntent,
    clientSecret: paymentIntent?.clientSecret || null,
    isCreating,
    error,

    // Session data
    sessionId: currentSession?.sessionId || null,
    bookingId: currentSession?.bookingId || null,
    paymentState: currentSession?.paymentState || null,

    // Actions
    initializePayment,
    markAsProcessing,
    markAsSucceeded,
    abandonPayment,

    // Debugging
    getPaymentStats,
    getSessionStats,
  };
}
