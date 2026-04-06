import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let _supabaseAdmin: SupabaseClient | null = null;

function getSupabaseAdmin() {
  if (!_supabaseAdmin) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) throw new Error('Missing Supabase env vars for organizationResolver');
    _supabaseAdmin = createClient(url, key, {
      auth: { persistSession: false },
    });
  }
  return _supabaseAdmin;
}

/**
 * 🏢 Resolve organization ID for a user
 *
 * Logic:
 * 1. Check if user is member of any organization
 * 2. If yes, return first organization (chronologically)
 * 3. If no, return default Vantage Lane organization
 *
 * @param authUserId - Supabase auth user ID
 * @returns organization_id UUID string
 */
export async function resolveUserOrganization(authUserId: string): Promise<string> {
  try {
    // 1) Check user's organization membership
    const { data: membership, error: membershipErr } = await supabaseAdmin
      .from('organization_members')
      .select('organization_id')
      .eq('user_id', authUserId)
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle(); // ✅ Returns null if no membership, no error

    if (membershipErr) {
      console.error('[resolveUserOrganization] Membership lookup failed:', membershipErr);
      throw membershipErr;
    }

    if (membership) {
      console.log('[resolveUserOrganization] User has org membership:', membership.organization_id);
      return membership.organization_id;
    }

    // 2) Fallback to default organization (is_default = true)
    const { data: defaultOrg, error: orgErr } = await supabaseAdmin
      .from('organizations')
      .select('id')
      .eq('is_default', true)
      .single();

    if (orgErr || !defaultOrg) {
      console.error('[resolveUserOrganization] Failed to get default org:', orgErr);
      throw new Error(
        'No default organization found. Cannot proceed without organization assignment.'
      );
    }

    console.log('[resolveUserOrganization] Using default org:', defaultOrg.id);
    return defaultOrg.id;
  } catch (error) {
    console.error('[resolveUserOrganization] Unexpected error:', error);
    throw error; // Re-throw instead of returning hardcoded fallback
  }
}

/**
 * 🔧 Find or create customer with proper organization assignment
 *
 * Uses FIND-OR-CREATE pattern instead of UPSERT to avoid overwriting
 * profile data (first_name, last_name) on every booking.
 *
 * @param authUserId - Supabase auth user ID
 * @param userData - User data from auth (only used for initial creation)
 * @returns customer record with organization_id
 */
export async function createCustomerWithOrganization(
  authUserId: string,
  userData: {
    email: string;
    first_name?: string;
    last_name?: string;
  }
) {
  const organizationId = await resolveUserOrganization(authUserId);

  // 1️⃣ FIND: Try to get existing customer
  const { data: existingCustomer, error: findErr } = await supabaseAdmin
    .from('customers')
    .select('id, organization_id')
    .eq('auth_user_id', authUserId)
    .eq('organization_id', organizationId)
    .maybeSingle(); // ✅ Returns null if not found, no error

  // Handle real errors (not "not found")
  if (findErr) {
    console.error('[createCustomerWithOrganization] Find failed:', findErr);
    throw new Error(`Failed to find customer: ${findErr.message}`);
  }

  // 2️⃣ If customer exists, return it WITHOUT modifying profile data
  if (existingCustomer) {
    console.log('[createCustomerWithOrganization] Found existing customer:', existingCustomer.id);
    return { customer: existingCustomer, organizationId };
  }

  // 3️⃣ CREATE: Customer doesn't exist, insert new one
  console.log('[createCustomerWithOrganization] Creating new customer for user:', authUserId);

  // Clean and validate input data
  const cleanEmail = userData.email.trim().toLowerCase();
  const cleanFirstName = userData.first_name?.trim() || '';
  const cleanLastName = userData.last_name?.trim() || '';

  const { data: newCustomer, error: insertErr } = await supabaseAdmin
    .from('customers')
    .insert({
      auth_user_id: authUserId,
      organization_id: organizationId,
      email: cleanEmail,
      first_name: cleanFirstName || 'Guest',
      last_name: cleanLastName,
      is_active: true,
    })
    .select('id, organization_id')
    .single();

  if (insertErr) {
    // 🔒 Race condition handling: If unique constraint violated (another request created customer)
    // re-fetch the customer instead of failing
    if (insertErr.code === '23505') {
      // Postgres unique_violation error code
      console.log('[createCustomerWithOrganization] Unique constraint hit, re-fetching customer');
      const { data: racedCustomer, error: refetchErr } = await supabaseAdmin
        .from('customers')
        .select('id, organization_id')
        .eq('auth_user_id', authUserId)
        .eq('organization_id', organizationId)
        .single();

      if (refetchErr || !racedCustomer) {
        console.error('[createCustomerWithOrganization] Re-fetch after race failed:', refetchErr);
        throw new Error(
          `Failed to create or retrieve customer: ${refetchErr?.message || 'Unknown error'}`
        );
      }

      console.log(
        '[createCustomerWithOrganization] Retrieved customer created by concurrent request'
      );
      return { customer: racedCustomer, organizationId };
    }

    // Other errors: fail
    console.error('[createCustomerWithOrganization] Insert failed:', insertErr);
    throw new Error(`Failed to create customer: ${insertErr.message}`);
  }

  return { customer: newCustomer, organizationId };
}
