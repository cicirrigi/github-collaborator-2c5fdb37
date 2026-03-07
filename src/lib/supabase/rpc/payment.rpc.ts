/**
 * Payment RPC Functions
 * Wave 1A: Wrapper for create_payment_intent_record RPC
 * Wave 1B: Wrapper for apply_stripe_payment_event RPC
 */

import type { SupabaseClient } from '@supabase/supabase-js';

// ============================================
// WAVE 1A TYPES
// ============================================

export interface CreatePaymentIntentRecordParams {
  booking_id: string;
  stripe_payment_intent_id: string;
  amount_pence: number;
  currency: string;
  receipt_email?: string | null;
  idempotency_key: string;
  attempt_no: number;
  organization_id: string;
  livemode: boolean;
  metadata?: Record<string, unknown> | null;
}

export interface CreatePaymentIntentRecordSuccess {
  success: true;
  payment_id: string;
  booking_id: string;
  stripe_payment_intent_id: string;
  idempotency_key: string;
  attempt_no: number;
  amount_pence: number;
  currency: string;
  booking_status: string;
  is_retry: boolean;
  created_at: string;
}

export interface CreatePaymentIntentRecordError {
  success: false;
  error_code: string;
  error_message: string;
  booking_id: string;
}

export type CreatePaymentIntentRecordResult =
  | CreatePaymentIntentRecordSuccess
  | CreatePaymentIntentRecordError;

// ============================================
// RPC WRAPPER
// ============================================

/**
 * Create payment intent record with idempotency protection
 *
 * @param supabase - Supabase client (service role recommended)
 * @param params - Payment intent parameters
 * @returns Result object with success status and payment data or error
 *
 * @example
 * ```typescript
 * const result = await createPaymentIntentRecord(supabaseAdmin, {
 *   booking_id: 'uuid',
 *   stripe_payment_intent_id: 'pi_xxx',
 *   amount_pence: 50000,
 *   currency: 'GBP',
 *   idempotency_key: 'pi_uuid_50000_1',
 *   attempt_no: 1,
 *   organization_id: 'org_uuid',
 *   livemode: false
 * });
 *
 * if (result.success) {
 *   console.log('Payment created:', result.payment_id);
 * } else {
 *   console.error('Error:', result.error_message);
 * }
 * ```
 */
export async function createPaymentIntentRecord(
  supabase: SupabaseClient,
  params: CreatePaymentIntentRecordParams
): Promise<CreatePaymentIntentRecordResult> {
  try {
    const { data, error } = await supabase.rpc('create_payment_intent_record', {
      p_booking_id: params.booking_id,
      p_stripe_payment_intent_id: params.stripe_payment_intent_id,
      p_amount_pence: params.amount_pence,
      p_currency: params.currency,
      p_receipt_email: params.receipt_email ?? null,
      p_idempotency_key: params.idempotency_key,
      p_attempt_no: params.attempt_no,
      p_organization_id: params.organization_id,
      p_livemode: params.livemode,
      p_metadata: params.metadata ?? null,
    });

    if (error) {
      // eslint-disable-next-line no-console
      console.error('❌ RPC create_payment_intent_record failed:', error);
      return {
        success: false,
        error_code: error.code || 'RPC_ERROR',
        error_message: error.message || 'Unknown RPC error',
        booking_id: params.booking_id,
      };
    }

    // RPC returns JSONB, check if it's an error response
    if (data && typeof data === 'object' && !Array.isArray(data) && 'success' in data) {
      return data as CreatePaymentIntentRecordResult;
    }

    // Unexpected response format
    return {
      success: false,
      error_code: 'UNEXPECTED_RESPONSE',
      error_message: 'RPC returned unexpected response format',
      booking_id: params.booking_id,
    };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('❌ Exception calling create_payment_intent_record:', err);
    return {
      success: false,
      error_code: 'EXCEPTION',
      error_message: err instanceof Error ? err.message : 'Unknown exception',
      booking_id: params.booking_id,
    };
  }
}

// ============================================
// WAVE 1B TYPES
// ============================================

export interface ApplyStripePaymentEventParams {
  stripe_event_id: string;
  event_type:
    | 'payment_intent.succeeded'
    | 'payment_intent.payment_failed'
    | 'payment_intent.canceled';
  stripe_payment_intent_id: string;
  livemode: boolean;
  event_created_at: string; // ISO 8601 timestamp
  payload: Record<string, unknown>;
  api_version?: string | null;
  booking_id?: string | null; // Optional verification
  charge_id?: string | null; // For succeeded events
  last_error?: string | null; // For failed events
}

export interface ApplyStripePaymentEventSuccess {
  success: true;
  result: 'processed' | 'already_processed' | 'ignored';
  event_processing_state: 'completed' | 'ignored';
  warning_code?: string | null;
  warning_message?: string | null;
  event_id: string;
  booking_id: string;
  booking_status: string;
  payment_id: string;
  payment_status: string;
  processed_at: string;
  transitions?: {
    booking: {
      before: string;
      after: string;
    };
    payment: {
      before: string;
      after: string;
    };
  };
}

export interface ApplyStripePaymentEventError {
  success: false;
  error_code: string;
  error_message: string;
  event_id?: string;
  stripe_payment_intent_id?: string;
  booking_id?: string;
  payment_status?: string;
  warning_code?: string;
  error_detail?: string;
}

export type ApplyStripePaymentEventResult =
  | ApplyStripePaymentEventSuccess
  | ApplyStripePaymentEventError;

// ============================================
// WAVE 1B RPC WRAPPER
// ============================================

/**
 * Apply Stripe payment webhook event atomically
 *
 * Processes payment_intent.succeeded, payment_intent.payment_failed, payment_intent.canceled
 * with idempotency protection and defensive status transitions.
 *
 * @param supabase - Supabase client (service role required)
 * @param params - Stripe event parameters
 * @returns Result object with success status and event data or error
 *
 * @example
 * ```typescript
 * const result = await applyStripePaymentEvent(supabaseAdmin, {
 *   stripe_event_id: 'evt_xxx',
 *   event_type: 'payment_intent.succeeded',
 *   stripe_payment_intent_id: 'pi_xxx',
 *   livemode: false,
 *   event_created_at: new Date().toISOString(),
 *   payload: stripeEvent,
 *   charge_id: 'ch_xxx'
 * });
 *
 * if (result.success) {
 *   if (result.result === 'already_processed') {
 *     console.log('Event already processed');
 *   } else if (result.result === 'processed') {
 *     console.log('Booking status:', result.booking_status);
 *   }
 * } else {
 *   console.error('Error:', result.error_message);
 * }
 * ```
 */
export async function applyStripePaymentEvent(
  supabase: SupabaseClient,
  params: ApplyStripePaymentEventParams
): Promise<ApplyStripePaymentEventResult> {
  try {
    const { data, error } = await supabase.rpc('apply_stripe_payment_event', {
      p_stripe_event_id: params.stripe_event_id,
      p_event_type: params.event_type,
      p_stripe_payment_intent_id: params.stripe_payment_intent_id,
      p_livemode: params.livemode,
      p_event_created_at: params.event_created_at,
      p_payload: params.payload,
      p_api_version: params.api_version ?? null,
      p_booking_id: params.booking_id ?? null,
      p_charge_id: params.charge_id ?? null,
      p_last_error: params.last_error ?? null,
    });

    if (error) {
      // eslint-disable-next-line no-console
      console.error('❌ RPC apply_stripe_payment_event failed:', error);
      return {
        success: false,
        error_code: error.code || 'RPC_ERROR',
        error_message: error.message || 'Unknown RPC error',
        stripe_payment_intent_id: params.stripe_payment_intent_id,
      };
    }

    // RPC returns JSONB, validate response
    if (data && typeof data === 'object' && !Array.isArray(data) && 'success' in data) {
      return data as ApplyStripePaymentEventResult;
    }

    // Unexpected response format
    return {
      success: false,
      error_code: 'UNEXPECTED_RESPONSE',
      error_message: 'RPC returned unexpected response format',
      stripe_payment_intent_id: params.stripe_payment_intent_id,
    };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('❌ Exception calling apply_stripe_payment_event:', err);
    return {
      success: false,
      error_code: 'EXCEPTION',
      error_message: err instanceof Error ? err.message : 'Unknown exception',
      stripe_payment_intent_id: params.stripe_payment_intent_id,
    };
  }
}
