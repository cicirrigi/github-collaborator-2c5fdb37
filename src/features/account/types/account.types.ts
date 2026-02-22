/**
 * 🏷️ Account Types - Vantage Lane 2.0
 *
 * TypeScript definitions pentru sistemul de conturi utilizator
 * Clean types fără any, strict typing
 */

export interface UserProfile {
  readonly id: string;
  readonly email: string;
  readonly phone: string | null;
  readonly fullName: string | null;
  readonly avatarUrl: string | null;
  readonly dateOfBirth: string | null; // ISO date string
  readonly memberSince: string; // ISO date string
  readonly loyaltyTier: LoyaltyTier;
  readonly totalRides: number;
  readonly totalSpent: number;
  readonly status: UserStatus;
}

export interface UserPreferences {
  readonly customerId: string;
  readonly preferredLanguage: string;
  readonly notificationSettings: NotificationSettings;
  readonly ridePreferences: RidePreferences;
  readonly accessibilityNeeds: AccessibilityNeeds;
  readonly twoFactorEnabled: boolean;
  readonly loginNotifications: boolean;
}

export interface NotificationSettings {
  readonly email: boolean;
  readonly sms: boolean;
  readonly push: boolean;
  readonly marketing: boolean;
  readonly bookingUpdates: boolean;
  readonly promotions: boolean;
}

export interface RidePreferences {
  readonly preferredVehicleType: string | null;
  readonly musicPreference: string | null;
  readonly temperaturePreference: string | null;
  readonly communicationStyle: string | null;
}

export interface AccessibilityNeeds {
  readonly wheelchairAccessible: boolean;
  readonly hearingImpaired: boolean;
  readonly visuallyImpaired: boolean;
  readonly mobilityAssistance: boolean;
  readonly serviceAnimal: boolean;
  readonly other: string | null;
}

export interface UserAddress {
  readonly id: string;
  readonly label: string; // Home, Work, Airport, etc.
  readonly address: string;
  readonly placeId: string | null;
  readonly coordinates: readonly [number, number] | null; // [lat, lng]
  readonly isDefault: boolean;
}

export interface EmergencyContact {
  readonly id: string;
  readonly name: string;
  readonly relationship: string;
  readonly phone: string;
  readonly email: string | null;
  readonly isPrimary: boolean;
}

export type LoyaltyTier = 'bronze' | 'silver' | 'gold' | 'platinum';
export type UserStatus = 'active' | 'suspended' | 'pending' | 'inactive';

import type { LucideIcon } from 'lucide-react';

export interface AccountMenuItem {
  readonly id: string;
  readonly label: string;
  readonly path: string;
  readonly icon: LucideIcon;
  readonly description: string;
  readonly isActive?: boolean;
}

export interface AccountSection {
  readonly title: string;
  readonly items: readonly AccountMenuItem[];
}
