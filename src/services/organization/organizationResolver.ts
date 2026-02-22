import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

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
      .single();

    if (!membershipErr && membership) {
      console.log('[resolveUserOrganization] User has org membership:', membership.organization_id);
      return membership.organization_id;
    }

    // 2) Fallback to default Vantage Lane organization
    const { data: defaultOrg, error: orgErr } = await supabaseAdmin
      .from('organizations')
      .select('id')
      .eq('name', 'Vantage Lane')
      .eq('org_type', 'platform_owner')
      .single();

    if (orgErr || !defaultOrg) {
      console.error('[resolveUserOrganization] Failed to get default org:', orgErr);
      // Hardcoded fallback to known Vantage Lane ID
      return '9a5caade-4791-4860-93b5-12b1c4fa9830';
    }

    console.log('[resolveUserOrganization] Using default org:', defaultOrg.id);
    return defaultOrg.id;
  } catch (error) {
    console.error('[resolveUserOrganization] Unexpected error:', error);
    // Always fallback to default Vantage Lane
    return '9a5caade-4791-4860-93b5-12b1c4fa9830';
  }
}

/**
 * 🔧 Create customer with proper organization assignment
 *
 * @param authUserId - Supabase auth user ID
 * @param userData - User data from auth
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

  const { data: customer, error: customerErr } = await supabaseAdmin
    .from('customers')
    .upsert(
      {
        auth_user_id: authUserId,
        organization_id: organizationId, // ✅ PROPER ORG ASSIGNMENT
        email: userData.email,
        first_name: userData.first_name || 'Guest',
        last_name: userData.last_name || '',
        is_active: true,
      },
      {
        onConflict: 'organization_id,auth_user_id', // ✅ CORRECT CONSTRAINT
      }
    )
    .select('id, organization_id')
    .single();

  if (customerErr) {
    console.error('[createCustomerWithOrganization] Failed:', customerErr);
    throw new Error(`Failed to create/update customer: ${customerErr.message}`);
  }

  return { customer, organizationId };
}
