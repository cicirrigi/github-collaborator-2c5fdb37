// 💰 PRICING ACTIONS - NEW BACKEND INTEGRATION
// This is the NEW version using backend-pricing.service
// Old version is preserved in pricing.actions.ts.OLD for safety

import { backendPricingService } from '@/services/backend-pricing.service';
import type { BookingState } from '../useBookingState/booking.types';

// FIX 14: Request ID counter for race condition handling

let currentRequestId = 0;

export const createPricingActions = (
  set: (partial: Partial<BookingState> | ((state: BookingState) => Partial<BookingState>)) => void,
  get: () => BookingState
) => ({
  // Route data actions (unchanged)
  setRouteData: (distance: number, duration: number) => {
    console.log('💰 setRouteData called:', { distance, duration });

    set((state: BookingState) => ({
      pricingState: {
        ...state.pricingState,
        routeData: {
          distance,
          duration,
          isCalculated: true,
        },
      },
    }));

    // FIX 6: Removed auto-trigger - pricing should be triggered explicitly by UI
    // This prevents creating phantom quotes in backend on every route change
  },

  clearRouteData: () => {
    set((state: BookingState) => ({
      pricingState: {
        ...state.pricingState,
        routeData: {
          distance: null,
          duration: null,
          isCalculated: false,
        },
      },
      // FIX 15: Invalidate quote when route data is cleared
      quoteStatus: 'stale',
    }));
  },

  // 🆕 NEW: Calculate pricing using backend and create quote
  calculatePricing: async () => {
    console.log('🔥 calculatePricing called (NEW BACKEND VERSION)');
    const state = get();
    const { pricingState, tripConfiguration, bookingType } = state;

    // FIX 3: Validate required data with proper null checks (not !)
    // For hourly/daily bookings, dropoff is optional
    const dropoffRequired = bookingType !== 'hourly' && bookingType !== 'daily';

    if (!tripConfiguration.pickup || (dropoffRequired && !tripConfiguration.dropoff)) {
      console.log('❌ PRICING VALIDATION FAILED - missing required locations');
      set((state: BookingState) => ({
        pricingState: {
          ...state.pricingState,
          pricingError: 'Missing required locations for pricing calculation',
          isLoadingPrices: false,
        },
        quoteStatus: 'error',
      }));
      return;
    }

    console.log('✅ Validation passed - calling backend');

    // FIX 14: Generate unique request ID to handle race conditions
    const requestId = ++currentRequestId;
    console.log(`🔢 Request ID: ${requestId}`);

    // FIX 5: Invalidate old quote/booking before creating new one
    state.clearQuoteAndBooking();

    // Set loading state
    set((state: BookingState) => ({
      pricingState: {
        ...state.pricingState,
        isLoadingPrices: true,
        pricingError: null,
      },
      quoteStatus: 'loading',
    }));

    try {
      // Get vehicle type for single vehicle bookings
      const vehicleType = tripConfiguration.selectedVehicle?.category?.id;

      // FIX 4, 7 & 13: Prepare complete request with all booking types support
      const quoteRequest = {
        bookingType: bookingType,
        pickup: {
          address: tripConfiguration.pickup.address,
          coordinates: tripConfiguration.pickup.coordinates,
        },
        dropoff: tripConfiguration.dropoff
          ? {
              address: tripConfiguration.dropoff.address,
              coordinates: tripConfiguration.dropoff.coordinates,
            }
          : {
              address: tripConfiguration.pickup.address,
              coordinates: tripConfiguration.pickup.coordinates,
            },
        // Distance is already in miles from Google Maps - no conversion needed
        distance: pricingState.routeData.distance || 0,
        duration: pricingState.routeData.duration || 0,
        vehicleType: vehicleType || undefined,
        dateTime: tripConfiguration.pickupDateTime
          ? tripConfiguration.pickupDateTime.toISOString()
          : new Date().toISOString(), // Backend requires dateTime
        returnDateTime: tripConfiguration.returnDateTime
          ? tripConfiguration.returnDateTime.toISOString()
          : bookingType === 'return'
            ? tripConfiguration.pickupDateTime?.toISOString() || new Date().toISOString()
            : null,
        // For FLEET bookings, use fleetSelection hours/days, otherwise use tripConfiguration
        hours:
          bookingType === 'fleet'
            ? tripConfiguration.fleetSelection?.fleetHours
            : tripConfiguration.hoursRequested,
        days:
          bookingType === 'fleet'
            ? tripConfiguration.fleetSelection?.fleetDays
            : tripConfiguration.daysRequested,
        // For FLEET bookings, send baseServiceType based on fleetMode
        baseServiceType:
          bookingType === 'fleet'
            ? tripConfiguration.fleetSelection?.fleetMode === 'hourly'
              ? 'hourly'
              : tripConfiguration.fleetSelection?.fleetMode === 'daily'
                ? 'daily'
                : 'oneway'
            : undefined,
        passengers: tripConfiguration.passengers,
        luggage: tripConfiguration.luggage,
        // Additional stops for outbound trip
        additionalStops:
          tripConfiguration.additionalStops.length > 0
            ? tripConfiguration.additionalStops.map(stop => ({
                address: stop.address,
                coordinates: stop.coordinates,
              }))
            : undefined,
        // FIX: Return trip locations - for standard return, swap pickup/dropoff
        returnPickup:
          bookingType === 'return'
            ? tripConfiguration.returnPickup
              ? {
                  address: tripConfiguration.returnPickup.address,
                  coordinates: tripConfiguration.returnPickup.coordinates,
                }
              : tripConfiguration.dropoff
                ? {
                    address: tripConfiguration.dropoff.address,
                    coordinates: tripConfiguration.dropoff.coordinates,
                  }
                : undefined
            : undefined,
        returnDropoff:
          bookingType === 'return'
            ? tripConfiguration.returnDropoff
              ? {
                  address: tripConfiguration.returnDropoff.address,
                  coordinates: tripConfiguration.returnDropoff.coordinates,
                }
              : {
                  address: tripConfiguration.pickup.address,
                  coordinates: tripConfiguration.pickup.coordinates,
                }
            : undefined,
        returnAdditionalStops:
          tripConfiguration.returnAdditionalStops.length > 0
            ? tripConfiguration.returnAdditionalStops.map(stop => ({
                address: stop.address,
                coordinates: stop.coordinates,
              }))
            : undefined,
        // Fleet configuration for FLEET bookings
        fleetConfig:
          bookingType === 'fleet' && tripConfiguration.fleetSelection?.vehicles?.length > 0
            ? tripConfiguration.fleetSelection.vehicles.reduce(
                (config, vehicle) => {
                  const categoryId = vehicle.category.id;
                  config[categoryId] = (config[categoryId] || 0) + vehicle.quantity;
                  return config;
                },
                {} as Record<string, number>
              )
            : undefined,
        // Service packages - send ALL services to backend for driver visibility
        servicePackages: {
          // Included services (always active for all bookings)
          includedServices: tripConfiguration.servicePackages.includedServices,
          // Map all selected premium features to service IDs
          premiumFeatures: Object.entries(tripConfiguration.servicePackages.premiumFeatures)
            .filter(([_, enabled]) => enabled)
            .map(([key]) => {
              // Map camelCase to kebab-case service IDs
              const mapping: Record<string, string> = {
                paparazziSafeMode: 'paparazzi-safe-mode',
                frontSeatRequest: 'front-seat-request',
                comfortRideMode: 'comfort-ride-mode',
                personalLuggagePrivacy: 'personal-luggage-privacy',
              };
              return mapping[key];
            }),
          // Trip preferences (music, temperature, communication)
          tripPreferences: {
            music: tripConfiguration.servicePackages.tripPreferences.music,
            temperature: tripConfiguration.servicePackages.tripPreferences.temperature,
            communication: tripConfiguration.servicePackages.tripPreferences.communication,
          },
          // Map paid upgrades to service IDs
          paidUpgrades: [
            ...(tripConfiguration.servicePackages.paidUpgrades.flowers
              ? [`flowers-${tripConfiguration.servicePackages.paidUpgrades.flowers}`]
              : []),
            ...(tripConfiguration.servicePackages.paidUpgrades.champagne
              ? [`champagne-${tripConfiguration.servicePackages.paidUpgrades.champagne}`]
              : []),
            ...(tripConfiguration.servicePackages.paidUpgrades.securityEscort
              ? ['security-escort']
              : []),
          ],
        },
        flightNumber: tripConfiguration.flightNumberPickup || undefined,
        customRequirements: tripConfiguration.customRequirements || undefined,
      };

      console.log('📤 Sending quote request to backend:', quoteRequest);

      // 🆕 Call NEW backend service
      const quoteResponse = await backendPricingService.calculateAndQuote(quoteRequest);

      console.log('📥 Received quote response:', quoteResponse);

      // FIX 14: Check if this is still the latest request
      if (requestId !== currentRequestId) {
        console.log(
          `⚠️ Ignoring stale response (request ${requestId}, current ${currentRequestId})`
        );
        return;
      }

      // 🆕 Save quote data in store using new actions
      state.setQuoteData(quoteResponse.quoteId, quoteResponse);

      // Also update pricing state for UI compatibility
      set((state: BookingState) => {
        // Preserve existing prices and add/update the new one
        const updatedVehiclePrices = {
          ...state.pricingState.vehiclePrices, // ✅ Keep existing prices
          ...(vehicleType && { [vehicleType]: quoteResponse.pricing.finalPrice }), // ✅ Add new price
        };

        console.log('💾 Saving to store:', {
          vehicleType,
          priceFromBackend: quoteResponse.pricing.finalPrice,
          updatedVehiclePrices,
        });

        return {
          pricingState: {
            ...state.pricingState,
            vehiclePrices: updatedVehiclePrices,
            isLoadingPrices: false,
            pricingError: null,
            lastPricingUpdate: new Date(),
          },
        };
      });

      console.log('✅ Quote saved successfully in store');
    } catch (error) {
      console.log('❌ Pricing calculation failed:', error);
      set((state: BookingState) => ({
        pricingState: {
          ...state.pricingState,
          isLoadingPrices: false,
          pricingError: error instanceof Error ? error.message : 'Failed to calculate pricing',
        },
        quoteStatus: 'error',
      }));
    }
  },

  setPriceForVehicle: (vehicleType: string, price: number) => {
    set((state: BookingState) => ({
      pricingState: {
        ...state.pricingState,
        vehiclePrices: {
          ...state.pricingState.vehiclePrices,
          [vehicleType]: price,
        },
      },
    }));
  },

  clearAllPrices: () => {
    set((state: BookingState) => ({
      pricingState: {
        ...state.pricingState,
        vehiclePrices: {},
        pricingError: null,
        lastPricingUpdate: null,
      },
      // FIX 15: Invalidate quote when prices are cleared
      quoteStatus: 'stale',
    }));
  },

  // Utility actions (unchanged)
  getPriceForVehicle: (vehicleType: string): number | null => {
    const state = get();
    const price = state.pricingState.vehiclePrices[vehicleType];
    return price ?? null; // Use ?? to handle 0 correctly
  },

  hasPricingData: (): boolean => {
    const state = get();
    const prices = Object.values(state.pricingState.vehiclePrices);
    return prices.some(price => price !== null && price !== undefined);
  },

  // FIX 10: Properly implement shouldRecalculatePricing
  shouldRecalculatePricing: (): boolean => {
    const state = get();
    const { quoteStatus, quoteResponse, pricingState, tripConfiguration } = state;

    // Can't calculate without route data
    if (!pricingState.routeData.isCalculated) return false;

    // Can't calculate without locations
    if (!tripConfiguration.pickup || !tripConfiguration.dropoff) return false;

    // Should recalculate if quote is stale or in error
    if (quoteStatus === 'stale' || quoteStatus === 'error') return true;

    // Should recalculate if no quote exists
    if (quoteStatus === 'idle' || !quoteResponse) return true;

    // Should recalculate if quote is expired
    if (quoteResponse && new Date(quoteResponse.expiresAt) < new Date()) {
      // Mark as expired
      set({ quoteStatus: 'expired' });
      return true;
    }

    // Quote is ready and valid
    return false;
  },
});
