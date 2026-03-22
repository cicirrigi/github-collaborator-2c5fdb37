/**
 * useBilling Hook - Multi-tenant ready
 * Purpose: CRUD operations for billing profiles
 *
 * IMPORTANT: customerId must come from secure session context,
 * not arbitrary user input. Typically from createCustomerWithOrganization.
 */

import { createClient } from '@/lib/supabase/client';
import type {
  BillingProfileRow,
  CreateBillingProfileInput,
  CreateBillingProfileResponse,
  UpdateBillingProfileInput,
} from '@/types/billing/billing.types';

/**
 * Billing hook with explicit customer context
 *
 * @param customerId - Customer ID from secure session context
 * @returns CRUD operations for billing profiles
 */
export function useBilling(customerId: string) {
  // Guard: fail fast if customerId is invalid
  if (!customerId) {
    throw new Error('useBilling requires a valid customerId');
  }

  const supabase = createClient();

  /**
   * Get all billing profiles for customer
   * Ordered by: default first, then by creation date
   */
  const getProfiles = async () => {
    const { data, error } = await supabase
      .from('customer_billing_profiles_v1')
      .select('*')
      .eq('customer_id', customerId)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false });

    return { data: data as BillingProfileRow[] | null, error };
  };

  /**
   * Get default billing profile for customer
   * Returns null if no default exists
   */
  const getDefaultProfile = async () => {
    const { data, error } = await supabase
      .from('customer_billing_profiles_v1')
      .select('*')
      .eq('customer_id', customerId)
      .eq('is_default', true)
      .maybeSingle();

    return { data: data as BillingProfileRow | null, error };
  };

  /**
   * Get specific billing profile by ID
   * Validates ownership (customer_id must match)
   * Returns null if profile not found (not an error)
   */
  const getProfile = async (billingId: string) => {
    const { data, error } = await supabase
      .from('customer_billing_profiles_v1')
      .select('*')
      .eq('id', billingId)
      .eq('customer_id', customerId)
      .maybeSingle();

    return { data: data as BillingProfileRow | null, error };
  };

  /**
   * Create new billing profile
   * First profile is automatically set as default
   *
   * @param input - Complete billing data using discriminated union
   * @returns Single profile object (not array)
   */
  const createProfile = async (input: Omit<CreateBillingProfileInput, 'customerId'>) => {
    const { data, error } = await supabase.rpc('create_billing_profile', {
      p_customer_id: customerId,
      p_entity_type: input.entityType,
      p_individual_data: input.entityType === 'individual' ? input.individualData : null,
      p_company_data: input.entityType === 'company' ? input.companyData : null,
      p_set_as_default: input.setAsDefault || false,
    });

    // RPC returns array, but we created one profile - return first element
    const profile = (data as CreateBillingProfileResponse[] | null)?.[0] ?? null;
    return { data: profile, error };
  };

  /**
   * Update existing billing profile
   * Requires COMPLETE payload (not partial)
   *
   * @param input - Complete billing data using discriminated union
   */
  const updateProfile = async (input: UpdateBillingProfileInput) => {
    const { data, error } = await supabase.rpc('update_billing_profile', {
      p_billing_id: input.billingId,
      p_individual_data: input.entityType === 'individual' ? input.individualData : null,
      p_company_data: input.entityType === 'company' ? input.companyData : null,
      p_set_as_default: input.setAsDefault || null,
    });

    return { data, error };
  };

  /**
   * Set specific profile as default
   * Automatically unsets other defaults
   */
  const setDefault = async (billingId: string) => {
    const { data, error } = await supabase.rpc('set_default_billing_profile', {
      p_billing_id: billingId,
    });

    return { data, error };
  };

  /**
   * Soft delete billing profile
   * Auto-promotes next profile to default if deleted was default
   */
  const deleteProfile = async (billingId: string) => {
    const { data, error } = await supabase.rpc('delete_billing_profile', {
      p_billing_id: billingId,
    });

    return { data, error };
  };

  return {
    getProfiles,
    getDefaultProfile,
    getProfile,
    createProfile,
    updateProfile,
    setDefault,
    deleteProfile,
  };
}
