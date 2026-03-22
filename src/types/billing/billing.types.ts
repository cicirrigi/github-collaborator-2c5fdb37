/**
 * Billing Types - Multi-tenant ready
 * Purpose: Type definitions for billing_entities and billing_snapshot
 */

export type BillingEntityType = 'individual' | 'company';

/**
 * Billing address structure (used in both individual and company profiles)
 */
export interface BillingAddress {
  street_line_1: string;
  street_line_2?: string | null;
  city: string;
  county?: string | null;
  postal_code: string;
  country: string;
  country_code: string; // ISO 3166-1 alpha-2 (e.g., "GB", "US")
}

/**
 * Individual billing data structure
 * Stored in billing_entities.individual_data JSONB column
 */
export interface IndividualBillingData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  billing_address: BillingAddress;
}

/**
 * Company billing data structure
 * Stored in billing_entities.company_data JSONB column
 */
export interface CompanyBillingData {
  company_name: string;
  vat_number?: string | null;
  registration_number?: string | null;
  billing_email: string;
  phone: string;
  contact_name?: string | null;
  billing_address: BillingAddress;
}

/**
 * Billing profile row from customer_billing_profiles_v1 view
 * Used for read operations - represents DB state
 */
export interface BillingProfileRow {
  id: string;
  customer_id: string;
  organization_id: string;
  entity_type: BillingEntityType;
  is_default: boolean;
  individual_data: IndividualBillingData | null;
  company_data: CompanyBillingData | null;
  created_at: string;
  updated_at: string;
  email: string; // Computed field (from individual_data or company_data)
  display_name: string; // Computed field (full name or company name)
}

/**
 * Billing snapshot structure
 * Stored in bookings.billing_snapshot JSONB column
 * Immutable copy of billing data at booking creation time
 */
export interface BillingSnapshot {
  entity_type: BillingEntityType;
  individual_data: IndividualBillingData | null;
  company_data: CompanyBillingData | null;
  captured_at: string; // ISO 8601 timestamp
}

/**
 * Input for creating new billing profile
 * Discriminated union enforces entity_type consistency
 */
export type CreateBillingProfileInput =
  | {
      customerId: string;
      entityType: 'individual';
      individualData: IndividualBillingData;
      companyData?: never;
      setAsDefault?: boolean;
    }
  | {
      customerId: string;
      entityType: 'company';
      companyData: CompanyBillingData;
      individualData?: never;
      setAsDefault?: boolean;
    };

/**
 * Input for updating existing billing profile
 * Discriminated union enforces COMPLETE payload per entity_type
 */
export type UpdateBillingProfileInput =
  | {
      billingId: string;
      entityType: 'individual';
      individualData: IndividualBillingData;
      companyData?: never;
      setAsDefault?: boolean;
    }
  | {
      billingId: string;
      entityType: 'company';
      companyData: CompanyBillingData;
      individualData?: never;
      setAsDefault?: boolean;
    };

/**
 * RPC response from create_billing_profile
 */
export interface CreateBillingProfileResponse {
  id: string;
  entity_type: BillingEntityType;
  is_default: boolean;
}
