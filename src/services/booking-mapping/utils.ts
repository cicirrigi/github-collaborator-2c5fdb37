/**
 * 🔧 Booking Mapping Utils - Helper functions
 */

import type { TripConfiguration } from './types';

/**
 * Maps UI vehicle category ID to DB category string
 * Simple 1:1 mapping - no conversion needed
 */
export const mapVehicleCategoryToDB = (categoryId?: string): string => {
  // Direct 1:1 mapping - UI categories match DB values exactly
  return categoryId || 'executive'; // Default fallback to executive
};

/**
 * Helper to extract fleet vehicle counts by category
 */
export const getFleetVehicleCount = (
  _tripConfig: TripConfiguration,
  _category: string
): number | null => {
  // This will be implemented when we have fleet selection in store
  // For now return null (no fleet booking data in current store)
  return null;
};
