// ========================================
// 🔗 CROSS-STEP VALIDATION ENGINE
// ========================================

import type { TripConfiguration } from '../../../hooks/useBookingState/booking.types';
import type { BookingType } from '../booking-rules';

// 🎯 CROSS-STEP VALIDATION RESULT
export interface CrossStepValidationResult {
  isValid: boolean;
  recommendations: string[];
  warnings: string[];
  errors: string[];
}

/**
 * 🔗 CROSS-STEP VALIDATION
 * Validates compatibility between Step 1 and Step 2 selections
 */
export const validateCrossStep = (
  bookingType: BookingType,
  tripConfiguration: TripConfiguration
): CrossStepValidationResult => {
  const recommendations: string[] = [];
  const warnings: string[] = [];
  const errors: string[] = [];

  // 🛫 AIRPORT PICKUP → LUXURY RECOMMENDATION
  const isAirportTrip =
    tripConfiguration.pickup?.type === 'airport' || tripConfiguration.dropoff?.type === 'airport';

  if (isAirportTrip && tripConfiguration.selectedVehicle?.category?.id === 'executive') {
    recommendations.push(
      'Consider Luxury or SUV vehicles for enhanced airport transfer experience'
    );
  }

  // 👥 PASSENGER COUNT → VEHICLE CAPACITY
  if (tripConfiguration.passengers && tripConfiguration.selectedVehicle?.category) {
    const passengerCount = tripConfiguration.passengers;
    const categoryId = tripConfiguration.selectedVehicle.category.id;

    // Vehicle capacity limits
    const capacityLimits = {
      executive: 3,
      luxury: 3,
      suv: 6,
      mpv: 7,
    };

    const maxCapacity = capacityLimits[categoryId as keyof typeof capacityLimits] || 4;

    if (passengerCount > maxCapacity) {
      errors.push(
        `${tripConfiguration.selectedVehicle.category.name} vehicles accommodate up to ${maxCapacity} passengers. Please select SUV or MPV for ${passengerCount} passengers.`
      );
    }
  }

  // 🏢 BESPOKE → LUXURY REQUIREMENT
  if (bookingType === 'bespoke' && tripConfiguration.selectedVehicle?.category) {
    const categoryId = tripConfiguration.selectedVehicle.category.id;
    if (!['luxury', 'suv'].includes(categoryId)) {
      errors.push('Bespoke service requires Luxury or SUV vehicles for premium experience');
    }
  }

  // 💼 CORPORATE → PROFESSIONAL VEHICLES
  if (bookingType === 'corporate' && tripConfiguration.selectedVehicle?.category) {
    const categoryId = tripConfiguration.selectedVehicle.category.id;
    if (!['executive', 'luxury'].includes(categoryId)) {
      warnings.push(
        'Corporate bookings typically use Executive or Luxury vehicles for professional appearance'
      );
    }
  }

  // 🎉 EVENTS → PREMIUM RECOMMENDATIONS
  if (bookingType === 'events') {
    const categoryId = tripConfiguration.selectedVehicle?.category?.id;
    if (categoryId === 'executive') {
      recommendations.push('For special events, consider Luxury or SUV for enhanced experience');
    }

    if (isAirportTrip) {
      recommendations.push('Consider premium features for event airport transfers');
    }
  }

  // ⚡ FLEET → GROUP CAPACITY
  if (bookingType === 'fleet') {
    if (tripConfiguration.passengers && tripConfiguration.passengers < 4) {
      warnings.push(
        'Fleet bookings are typically for 4+ passengers. Consider standard booking for smaller groups.'
      );
    }

    const categoryId = tripConfiguration.selectedVehicle?.category?.id;
    if (categoryId && !['suv', 'mpv'].includes(categoryId)) {
      recommendations.push('Fleet bookings work best with SUV or MPV vehicles for group capacity');
    }
  }

  return {
    isValid: errors.length === 0,
    recommendations,
    warnings,
    errors,
  };
};

/**
 * 🎯 SMART RECOMMENDATIONS ENGINE
 * Provides intelligent suggestions based on Step 1 + 2 data
 */
export const getSmartRecommendations = (
  bookingType: BookingType,
  tripConfiguration: TripConfiguration
): string[] => {
  const recommendations: string[] = [];

  // Duration-based recommendations (placeholder for future integration)
  // TODO: Integrate with Step 1 datetime fields when available

  // Weather-based recommendations (if available)
  // Premium features suggestions
  // Upgrade recommendations

  return recommendations;
};
