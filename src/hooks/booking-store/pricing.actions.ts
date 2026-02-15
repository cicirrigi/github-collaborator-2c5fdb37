// 💰 PRICING ACTIONS - Render API Integration
import { renderPricingService } from '@/lib/pricing/render-pricing.service';

export const createPricingActions = (set: any, get: any) => ({
  // Route data actions
  setRouteData: (distance: number, duration: number) => {
    console.log('💰 setRouteData called:', { distance, duration });

    set(state => ({
      pricingState: {
        ...state.pricingState,
        routeData: {
          distance,
          duration,
          isCalculated: true,
        },
      },
    }));

    console.log('💰 Auto-triggering calculatePricing...');
    // Auto-trigger pricing calculation when route data is set
    get().calculatePricing();
  },

  clearRouteData: () => {
    set(state => ({
      pricingState: {
        ...state.pricingState,
        routeData: {
          distance: null,
          duration: null,
          isCalculated: false,
        },
      },
    }));
  },

  // Pricing calculation actions
  calculatePricing: async () => {
    console.log('🔥 calculatePricing called');
    const state = get();
    const { pricingState, tripConfiguration, bookingType } = state;

    console.log('🔥 Pricing state data:', {
      routeData: pricingState.routeData,
      hasPickup: !!tripConfiguration.pickup,
      hasDropoff: !!tripConfiguration.dropoff,
      bookingType,
    });

    // Validate required data
    if (
      !pricingState.routeData.isCalculated ||
      !pricingState.routeData.distance ||
      !pricingState.routeData.duration ||
      !tripConfiguration.pickup ||
      !tripConfiguration.dropoff
    ) {
      console.log('❌ Validation failed - missing required data');
      return;
    }

    console.log('✅ Validation passed - proceeding with pricing calculation');

    // Set loading state
    set(state => ({
      pricingState: {
        ...state.pricingState,
        isLoadingPrices: true,
        pricingError: null,
      },
    }));

    try {
      // Prepare base request data
      const baseRequest = {
        pickup: tripConfiguration.pickup.address,
        dropoff: tripConfiguration.dropoff.address,
        bookingType: renderPricingService.mapBookingTypeToRenderType(bookingType) || 'one_way',
        dateTime: tripConfiguration.pickupDateTime?.toISOString() || new Date().toISOString(),
        distance: pricingState.routeData.distance,
        duration: Math.round(pricingState.routeData.duration * 60), // Convert minutes to seconds
        coordinates: {
          pickup: {
            lat: tripConfiguration.pickup.coordinates[1],
            lng: tripConfiguration.pickup.coordinates[0],
          },
          dropoff: {
            lat: tripConfiguration.dropoff.coordinates[1],
            lng: tripConfiguration.dropoff.coordinates[0],
          },
        },
      };

      console.log('🚀 API Request data:', baseRequest);
      console.log('🚀 Complete pickup/dropoff data:');
      console.log('📍 Pickup object:', tripConfiguration.pickup);
      console.log('📍 Dropoff object:', tripConfiguration.dropoff);
      console.log('📍 Dropoff address property:', tripConfiguration.dropoff?.address);
      console.log('📍 Pickup address property:', tripConfiguration.pickup?.address);

      // Add conditional parameters (cast to any to avoid TypeScript errors)
      const requestWithExtras = baseRequest as any;

      if (bookingType === 'hourly' && tripConfiguration.hoursRequested) {
        requestWithExtras.hours = tripConfiguration.hoursRequested;
      }
      if (bookingType === 'daily' && tripConfiguration.daysRequested) {
        requestWithExtras.days = tripConfiguration.daysRequested;
      }

      // Calculate prices for all vehicle types
      console.log('🔥 Calling renderPricingService.calculatePricesForAllVehicles...');
      const pricesResponse =
        await renderPricingService.calculatePricesForAllVehicles(requestWithExtras);

      console.log('🔥 API Response received:', pricesResponse);

      // Update state with calculated prices
      set(state => {
        const newVehiclePrices: Record<string, number | null> = {};

        Object.entries(pricesResponse).forEach(([vehicleType, response]) => {
          console.log(`🔥 Processing ${vehicleType}:`, response);
          if (response.success) {
            newVehiclePrices[vehicleType] = response.finalPrice;
          } else {
            newVehiclePrices[vehicleType] = null;
            console.error(`❌ Pricing failed for ${vehicleType}:`, response.error);
            console.error(
              `❌ Validation details for ${vehicleType}:`,
              JSON.stringify(response.details, null, 2)
            );
          }
        });

        return {
          pricingState: {
            ...state.pricingState,
            vehiclePrices: newVehiclePrices,
            isLoadingPrices: false,
            pricingError: null,
            lastPricingUpdate: new Date(),
          },
        };
      });
    } catch (error) {
      set(state => ({
        pricingState: {
          ...state.pricingState,
          isLoadingPrices: false,
          pricingError: error instanceof Error ? error.message : 'Failed to calculate pricing',
        },
      }));
    }
  },

  setPriceForVehicle: (vehicleType: string, price: number) => {
    set(state => ({
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
    set(state => ({
      pricingState: {
        ...state.pricingState,
        vehiclePrices: {},
        pricingError: null,
        lastPricingUpdate: null,
      },
    }));
  },

  // Utility actions
  getPriceForVehicle: (vehicleType: string): number | null => {
    const state = get();

    // Map our category IDs to render vehicle types
    const renderVehicleType = renderPricingService.mapVehicleCategoryToRenderType(vehicleType);
    if (!renderVehicleType) return null;

    return state.pricingState.vehiclePrices[renderVehicleType] || null;
  },

  hasPricingData: (): boolean => {
    const state = get();
    const prices = Object.values(state.pricingState.vehiclePrices);
    return prices.some(price => price !== null && price !== undefined);
  },

  shouldRecalculatePricing: (): boolean => {
    const state = get();
    const { pricingState, tripConfiguration } = state;

    // If no route data, can't calculate
    if (!pricingState.routeData.isCalculated) return false;

    // If no pickup/dropoff, can't calculate
    if (!tripConfiguration.pickup || !tripConfiguration.dropoff) return false;

    // If never calculated before, should calculate
    if (!pricingState.lastPricingUpdate) return true;

    // If locations changed after last pricing update, should recalculate
    // This is a simplified check - in practice you might want to compare exact addresses
    return true;
  },
});
