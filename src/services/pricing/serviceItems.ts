import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let _supabaseAdmin: SupabaseClient | null = null;

function getSupabaseAdmin() {
  if (!_supabaseAdmin) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) throw new Error('Missing Supabase env vars for serviceItems');
    _supabaseAdmin = createClient(url, key, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return _supabaseAdmin;
}

// 🎯 SERVICE ITEM DB TYPES
export interface ServiceItem {
  id: string; // service code like 'flowers-standard'
  name: string; // display name like 'Standard Luxury Bouquet'
  price_pence: number; // price in pence
  currency: string; // 'GBP'
  is_active: boolean;
}

// 🎯 ENTERPRISE PRICE LOOKUP UTILITY
export async function getServiceItemsByCodes(codes: string[]): Promise<ServiceItem[]> {
  if (codes.length === 0) return [];

  console.log('[getServiceItemsByCodes] Looking up codes:', codes);

  const { data, error } = await getSupabaseAdmin()
    .from('service_items')
    .select('id, name, price_pence, currency, is_active')
    .in('id', codes)
    .eq('is_active', true);

  if (error) {
    console.error('[getServiceItemsByCodes] Database error:', error);
    throw new Error(`Failed to fetch service items: ${error.message}`);
  }

  const foundCodes = new Set((data as ServiceItem[]).map((item: ServiceItem) => item.id));
  const missingCodes = codes.filter(code => !foundCodes.has(code));

  // 🚨 ENTERPRISE INVARIANT: All requested codes must exist in DB
  if (missingCodes.length > 0) {
    console.error('[getServiceItemsByCodes] Missing codes in DB:', missingCodes);
    throw new Error(`Service codes not found in database: ${missingCodes.join(', ')}`);
  }

  console.log('[getServiceItemsByCodes] Found items:', data.length);
  return data;
}

// 🎯 BUILD LINE ITEMS FOR QUOTE SNAPSHOT
export interface QuoteLineItem {
  service_code: string;
  service_name: string;
  unit_price_pence: number;
  currency: string;
  is_complimentary: boolean;
  configuration?: Record<string, unknown>;
}

export async function buildQuoteLineItems(
  serviceCodes: string[],
  complimentarySet: Set<string>,
  configurations: Map<string, Record<string, unknown>>
): Promise<QuoteLineItem[]> {
  if (serviceCodes.length === 0) return [];

  // 📊 Fetch pricing from DB
  const serviceItems = await getServiceItemsByCodes(serviceCodes);

  // 🔧 Build line items with DB pricing
  const lineItems: QuoteLineItem[] = serviceItems.map(item => {
    const isComplimentary = complimentarySet.has(item.id);

    const lineItem: QuoteLineItem = {
      service_code: item.id,
      service_name: item.name,
      unit_price_pence: isComplimentary ? 0 : item.price_pence, // Force 0 for complimentary
      currency: item.currency,
      is_complimentary: isComplimentary,
    };

    const config = configurations.get(item.id);
    if (config) {
      lineItem.configuration = config;
    }

    return lineItem;
  });

  console.log('[buildQuoteLineItems] Generated line items:', lineItems.length);
  return lineItems;
}

// 🧮 CALCULATE TOTAL FROM LINE ITEMS
export function calculateQuoteTotal(lineItems: QuoteLineItem[]): number {
  return lineItems.reduce((total, item) => total + item.unit_price_pence, 0);
}
