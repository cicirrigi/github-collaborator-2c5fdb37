'use client';

import { bookingSessionManager, PaymentState } from '@/lib/booking/session/BookingSessionManager';
import {
  paymentIntentManager,
  type PaymentIntentData,
} from '@/lib/booking/session/PaymentIntentManager';
import { useCallback, useEffect, useState } from 'react';

export interface UseBookingPaymentReturn {
  paymentIntent: PaymentIntentData | null;
  clientSecret: string | null;
  isCreating: boolean;
  error: string | null;

  sessionId: string | null;
  bookingId: string | null;
  paymentState: PaymentState | null;

  initializePayment: (params: {
    bookingId: string;
    amount?: number;
  }) => Promise<PaymentIntentData | null>;
  markAsProcessing: () => void;
  markAsSucceeded: () => void;
  abandonPayment: () => void;

  getPaymentStats: () => any;
  getSessionStats: () => any;
}

/**
 * Enterprise payment hook with session persistence
 *
 * NOTE:
 * - We keep your session managers intact.
 * - We create PaymentIntent via API using bookingId (amount comes from DB).
 */
export function useBookingPayment(): UseBookingPaymentReturn {
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntentData | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initializePayment = useCallback(
    async (params: { bookingId: string }): Promise<PaymentIntentData | null> => {
      if (isCreating) return paymentIntent;

      setIsCreating(true);
      setError(null);

      try {
        const response = await fetch('/api/stripe/payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Idempotency-Key': `pi_${params.bookingId}`,
          },
          body: JSON.stringify(params),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.error || data?.details || 'Failed to create payment intent');
        }

        const intent: PaymentIntentData = {
          id: data.paymentIntentId,
          clientSecret: data.clientSecret,
          amount: data.amount ?? 0, // optional if API returns it
          currency: data.currency ?? 'gbp',
          status: data.status ?? 'requires_payment_method',
        };

        // Keep session manager state in sync (optional but good)
        const session = bookingSessionManager.getCurrentSession(0);
        if (session) {
          // If your manager has a method to store intent in session, call it.
          // Otherwise, you can rely on your existing restore logic.
          try {
            (paymentIntentManager as any).markIntentCreated?.(session.sessionId, {
              paymentIntentId: intent.id,
              clientSecret: intent.clientSecret,
            });
          } catch (e) {
            // Ignore if method doesn't exist
          }
        }

        setPaymentIntent(intent);
        return intent;
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Unknown error occurred';
        setError(msg);
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
