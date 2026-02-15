/**
 * Render Pricing Calculator Service
 *
 * Connects to external Render pricing API to calculate real vehicle prices
 * based on Google Maps distance and booking parameters
 */

export interface RenderPricingRequest {
  pickup: string;
  dropoff: string;
  vehicleType: 'executive' | 'luxury' | 'suv' | 'van';
  bookingType: 'one_way' | 'return' | 'hourly' | 'daily';
  dateTime: string; // ISO 8601 format
  distance: number; // miles from Google Maps
  duration: number; // minutes from Google Maps
  coordinates?: {
    pickup: { lat: number; lng: number };
    dropoff: { lat: number; lng: number };
  };
  extras?: string[];
  hours?: number; // for hourly bookings
  days?: number; // for daily bookings
}

export interface RenderPricingResponse {
  success: boolean;
  finalPrice: number;
  currency: string;
  breakdown: {
    baseFare: number;
    distanceFee: number;
    timeFee: number;
    additionalFees: number;
    services: number;
    subtotal: number;
    multipliers: Record<string, number>;
    discounts: number;
    finalPrice: number;
  };
  details: Array<{
    component: string;
    amount: number;
    description: string;
  }>;
  timestamp: string;
}

export interface RenderPricingError {
  success: false;
  error: string;
  details?: Array<{
    field: string;
    message: string;
  }>;
  timestamp: string;
}

class RenderPricingService {
  private readonly BACKEND_URL = '/api/pricing'; // Use local Next.js API proxy

  /**
   * Calculate price for a single vehicle type
   */
  async calculatePrice(
    request: RenderPricingRequest
  ): Promise<RenderPricingResponse | RenderPricingError> {
    try {
      const response = await fetch(`${this.BACKEND_URL}/calculate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Render Pricing API error:', error);
      return {
        success: false,
        error: 'Failed to connect to pricing service',
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Calculate prices for all vehicle types at once
   */
  async calculatePricesForAllVehicles(
    baseRequest: Omit<RenderPricingRequest, 'vehicleType'>
  ): Promise<Record<string, RenderPricingResponse | RenderPricingError>> {
    const vehicleTypes: Array<'executive' | 'luxury' | 'suv' | 'van'> = [
      'executive',
      'luxury',
      'suv',
      'van',
    ];

    const pricePromises = vehicleTypes.map(async vehicleType => {
      const request: RenderPricingRequest = {
        ...baseRequest,
        vehicleType,
      };

      const result = await this.calculatePrice(request);
      return { vehicleType, result };
    });

    const results = await Promise.all(pricePromises);

    const pricesMap: Record<string, RenderPricingResponse | RenderPricingError> = {};
    results.forEach(({ vehicleType, result }) => {
      pricesMap[vehicleType] = result;
    });

    return pricesMap;
  }

  /**
   * Map our vehicle category IDs to Render API vehicle types
   */
  mapVehicleCategoryToRenderType(
    categoryId: string
  ): 'executive' | 'luxury' | 'suv' | 'van' | null {
    const mapping: Record<string, 'executive' | 'luxury' | 'suv' | 'van'> = {
      executive: 'executive',
      luxury: 'luxury',
      suv: 'suv',
      mpv: 'van', // MPV maps to van in Render API
    };

    return mapping[categoryId] || null;
  }

  /**
   * Map our booking types to Render API booking types
   */
  mapBookingTypeToRenderType(
    bookingType: string
  ): 'one_way' | 'return' | 'hourly' | 'daily' | null {
    const mapping: Record<string, 'one_way' | 'return' | 'hourly' | 'daily'> = {
      oneway: 'one_way',
      return: 'return',
      hourly: 'hourly',
      daily: 'daily',
    };

    return mapping[bookingType] || 'one_way'; // default to one_way
  }

  /**
   * Health check for the pricing service
   */
  async healthCheck(): Promise<{ success: boolean; status?: string }> {
    try {
      // Simple health check via proxy
      const testRequest: RenderPricingRequest = {
        pickup: 'Test Location',
        dropoff: 'Test Destination',
        vehicleType: 'executive',
        bookingType: 'one_way',
        dateTime: new Date().toISOString(),
        distance: 10,
        duration: 20,
      };

      const response = await this.calculatePrice(testRequest);
      return { success: response.success || false };
    } catch (error) {
      return { success: false };
    }
  }
}

// Export singleton instance
export const renderPricingService = new RenderPricingService();
