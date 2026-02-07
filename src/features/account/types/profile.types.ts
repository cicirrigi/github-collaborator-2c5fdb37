/**
 * 👤 Profile Types - Vantage Lane 2.0
 *
 * TypeScript definitions pentru profile management
 * Bazate pe schema reală Supabase: auth.users + customers + customer_metadata + customer_preferences
 */

export interface AuthUser {
  readonly id: string;
  readonly email: string;
  readonly phone: string | null;
  readonly raw_user_meta_data: Record<string, unknown> | null;
  readonly created_at: string;
  readonly updated_at: string;
  readonly last_sign_in_at: string | null;
  readonly email_confirmed_at: string | null;
  readonly phone_confirmed_at: string | null;
}

export interface Customer {
  readonly id: string;
  readonly auth_user_id: string;
  readonly email: string;
  readonly phone: string | null;
  readonly status: string;
  readonly customer_type: string;
  readonly created_at: string;
  readonly updated_at: string;
}

export interface CustomerAddress {
  readonly id: string;
  readonly label: string;
  readonly address_line_1: string;
  readonly address_line_2: string | null;
  readonly city: string;
  readonly county: string | null;
  readonly postcode: string;
  readonly country: string;
  readonly is_default: boolean;
  readonly type: 'home' | 'work' | 'other';
}

export interface EmergencyContact {
  readonly id: string;
  readonly name: string;
  readonly relationship: string;
  readonly phone: string;
  readonly email: string | null;
  readonly is_primary: boolean;
}

export interface CustomerMetadata {
  readonly id: string;
  readonly customer_id: string;
  readonly name: string | null;
  readonly avatar_url: string | null;
  readonly date_of_birth: string | null;
  readonly addresses: CustomerAddress[];
  readonly emergency_contacts: EmergencyContact[];
  readonly medical_info: Record<string, unknown> | null;
  readonly loyalty_tier: string | null;
  readonly member_since: string | null;
  readonly total_rides: number;
  readonly total_spent: number;
  readonly created_at: string;
  readonly updated_at: string;
}

export interface CustomerPreferences {
  readonly id: string;
  readonly customer_id: string;
  readonly preferred_language: string;
  readonly notification_settings: Record<string, unknown>;
  readonly ride_preferences: Record<string, unknown>;
  readonly accessibility_needs: Record<string, unknown>;
  readonly two_factor_enabled: boolean;
  readonly login_notifications: boolean;
  readonly created_at: string;
  readonly updated_at: string;
}

export interface ProfileData {
  readonly auth_user: AuthUser;
  readonly customer: Customer;
  readonly metadata: CustomerMetadata;
  readonly preferences: CustomerPreferences;
}

export interface ProfileFormData {
  readonly first_name: string;
  readonly last_name: string;
  readonly email: string;
  readonly phone: string;
  readonly date_of_birth: string;
  readonly avatar_url: string | null;
}

export interface ProfileUpdateData {
  readonly first_name?: string;
  readonly last_name?: string;
  readonly phone?: string;
  readonly date_of_birth?: string;
  readonly avatar_url?: string | null;
}

// Address interfaces based on favorite_addresses table schema
export interface FavoriteAddress {
  readonly id: string;
  readonly auth_user_id: string;
  readonly label: string;
  readonly full_address: string;
  readonly street_number: string | null;
  readonly street_name: string | null;
  readonly additional_info: string | null;
  readonly county: string | null;
  readonly country: string | null;
  readonly lat: number | null;
  readonly lng: number | null;
  readonly is_default: boolean;
  readonly coordinates: Record<string, unknown> | null;
  readonly created_at: string;
  readonly updated_at: string;
}

export interface CreateAddressData {
  readonly label: string;
  readonly full_address: string;
  readonly street_number?: string;
  readonly street_name?: string;
  readonly additional_info?: string;
  readonly county?: string;
  readonly country?: string;
  readonly lat?: number;
  readonly lng?: number;
  readonly is_default?: boolean;
  readonly coordinates?: Record<string, unknown>;
}

export interface UpdateAddressData {
  readonly label?: string;
  readonly full_address?: string;
  readonly street_number?: string;
  readonly street_name?: string;
  readonly additional_info?: string;
  readonly county?: string;
  readonly country?: string;
  readonly lat?: number;
  readonly lng?: number;
  readonly is_default?: boolean;
  readonly coordinates?: Record<string, unknown>;
}
