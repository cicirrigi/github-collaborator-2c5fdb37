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
  readonly first_name: string;
  readonly last_name: string;
  readonly phone: string | null;
  readonly profile_photo_url: string | null;
  readonly saved_address: Record<string, unknown> | null;
  readonly is_active: boolean;
  readonly organization_id: string | null;
  readonly created_at: string;
  readonly updated_at: string;
  readonly deleted_at: string | null;
}

export interface CustomerPreferences {
  readonly temperature_preference: string | null;
  readonly music_preference: string | null;
  readonly communication_style: string | null;
  readonly pet_friendly_default: boolean | null;
  readonly created_at: string | null;
  readonly updated_at: string | null;
}

export interface ProfileData {
  readonly auth_user: AuthUser;
  readonly customer: Customer | null;
  readonly preferences: CustomerPreferences | null;
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
