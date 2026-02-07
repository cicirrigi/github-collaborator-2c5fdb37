/**
 * 📞 Phone Utilities - Phone Number Format Conversion
 *
 * Utilități pentru convertirea numerelor de telefon
 * Local format ↔ E.164 format
 */

import { AsYouType, parsePhoneNumber } from 'libphonenumber-js';

/**
 * Convert local phone number to E.164 format
 * Examples:
 * - "0745544466" (RO) → "+40745544466"
 * - "07123456789" (UK) → "+447123456789"
 */
export function formatPhoneToE164(phone: string, defaultCountry = 'RO'): string {
  if (!phone) return '';

  // Already in E.164 format
  if (phone.startsWith('+')) return phone;

  try {
    const phoneNumber = parsePhoneNumber(phone, defaultCountry as any);
    return phoneNumber?.number || phone;
  } catch {
    // If parsing fails, return original
    return phone;
  }
}

/**
 * Convert E.164 phone number to national format for display
 * Examples:
 * - "+40745544466" → "0745 544 466"
 * - "+447123456789" → "07123 456789"
 */
export function formatPhoneForDisplay(phone: string): string {
  if (!phone) return '';

  try {
    const phoneNumber = parsePhoneNumber(phone);
    return phoneNumber?.formatNational() || phone;
  } catch {
    return phone;
  }
}

/**
 * Validate if phone number is valid E.164 format
 */
export function isValidE164Phone(phone: string): boolean {
  if (!phone || !phone.startsWith('+')) return false;

  try {
    const phoneNumber = parsePhoneNumber(phone);
    return phoneNumber?.isValid() || false;
  } catch {
    return false;
  }
}

/**
 * Format phone as user types (for input display)
 */
export function formatPhoneAsYouType(phone: string, country = 'RO'): string {
  if (!phone) return '';

  const formatter = new AsYouType(country as any);
  return formatter.input(phone);
}
