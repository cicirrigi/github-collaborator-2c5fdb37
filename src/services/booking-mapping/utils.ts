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
  category: string
): number | null => {
  // This will be implemented when we have fleet selection in store
  // For now return test values for FLEET legs testing
  const testFleetCounts: Record<string, number> = {
    executive: 2,
    s_class: 1,
    v_class: 1,
    suv: 1,
  };

  return testFleetCounts[category] || null;
};
