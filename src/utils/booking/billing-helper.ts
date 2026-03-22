/**
 * Billing Helper for Booking API
 * Purpose: Fetch and validate billing profiles with explicit error handling
 */

import type { BillingProfileRow, BillingSnapshot } from '@/types/billing/billing.types';
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Fetch billing profile and create snapshot with explicit validation
 *
 * Priority:
 * 1. If billingEntityId provided → validate ownership and use it
 * 2. If not provided → fallback to default profile
 * 3. If neither exists → return null (acceptable for bookings without billing)
 *
 * @param supabase - Supabase client
 * @param customerId - Customer ID (from secure session)
 * @param organizationId - Organization ID (tenant context)
 * @param billingEntityId - Optional explicit billing ID from UI
 * @returns Billing entity ID and snapshot, or null
 * @throws Error if explicit billingEntityId provided but invalid
 */
export async function fetchBillingForBooking(
  supabase: SupabaseClient,
  customerId: string,
  organizationId: string,
  billingEntityId?: string | null
): Promise<{
  billingEntityId: string | null;
  billingSnapshot: BillingSnapshot | null;
}> {
  // Case 1: Explicit billing ID provided by UI
  if (billingEntityId) {
    const { data: selectedBilling, error } = await supabase
      .from('customer_billing_profiles_v1')
      .select('*')
      .eq('id', billingEntityId)
      .eq('customer_id', customerId) // Validate ownership
      .eq('organization_id', organizationId) // Validate tenant
      .single();

    // EXPLICIT ERROR: If UI sent billingEntityId but it's invalid, throw error
    if (error || !selectedBilling) {
      throw new Error(
        `Invalid billing profile: ${billingEntityId}. ` +
          `Profile not found or does not belong to customer ${customerId} in organization ${organizationId}.`
      );
    }

    // Valid billing profile found - create snapshot
    return {
      billingEntityId: selectedBilling.id,
      billingSnapshot: createBillingSnapshot(selectedBilling),
    };
  }

  // Case 2: No explicit billing ID - try default profile (fallback)
  const { data: defaultBilling, error: defaultError } = await supabase
    .from('customer_billing_profiles_v1')
    .select('*')
    .eq('customer_id', customerId)
    .eq('organization_id', organizationId)
    .eq('is_default', true)
    .maybeSingle();

  // If there's a real DB/infrastructure error, throw it
  if (defaultError) {
    throw new Error(`Failed to fetch default billing profile: ${defaultError.message}`);
  }

  // If default profile exists, use it
  if (defaultBilling) {
    return {
      billingEntityId: defaultBilling.id,
      billingSnapshot: createBillingSnapshot(defaultBilling),
    };
  }

  // Case 3: No billing profile at all - acceptable for bookings
  return {
    billingEntityId: null,
    billingSnapshot: null,
  };
}

/**
 * Create billing snapshot from billing profile
 * Removes unnecessary fields and adds captured_at timestamp
 */
function createBillingSnapshot(profile: BillingProfileRow): BillingSnapshot {
  return {
    entity_type: profile.entity_type,
    individual_data: profile.entity_type === 'individual' ? profile.individual_data : null,
    company_data: profile.entity_type === 'company' ? profile.company_data : null,
    captured_at: new Date().toISOString(),
  };
}
