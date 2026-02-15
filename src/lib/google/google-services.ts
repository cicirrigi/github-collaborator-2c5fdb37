/**
 * Google Services Integration
 *
 * Safe wrapper for Google Maps APIs with optimization and error handling
 * NO MODIFICATION OF EXISTING CODE - pure addition
 */

export interface GoogleDirectionsResult {
  distance: string;
  duration: string;
  distanceValue: number; // distance in miles (imperial system)
  durationValue: number; // seconds
}

export interface GooglePlaceResult {
  placeId: string;
  address: string;
  coordinates: [number, number];
  type: 'address' | 'airport' | 'hotel' | 'poi';
  components: Record<string, string>;
}

interface DirectionsCache {
  [key: string]: {
    result: GoogleDirectionsResult;
    timestamp: number;
  };
}

interface PlacesCache {
  [key: string]: {
    results: GooglePlaceResult[];
    timestamp: number;
  };
}

class GoogleServicesManager {
  private directionsCache: DirectionsCache = {};
  private placesCache: PlacesCache = {};
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private readonly API_KEY: string;

  constructor() {
    this.API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
    if (!this.API_KEY) {
      console.warn('Google Maps API key not found in environment variables');
    }
  }

  /**
   * Calculate distance and duration between two locations using Google Maps JavaScript API
   * Uses caching to minimize API calls
   */
  async getDirections(origin: string, destination: string): Promise<GoogleDirectionsResult | null> {
    if (!origin || !destination) {
      return null;
    }

    // Check if Google Maps API is loaded
    if (!window.google || !window.google.maps) {
      console.warn('Google Maps API not loaded yet');
      return null;
    }

    const cacheKey = `${origin}_${destination}`;
    const cached = this.directionsCache[cacheKey];

    // Return cached result if valid
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.result;
    }

    return new Promise(resolve => {
      try {
        const service = new window.google.maps.DirectionsService();

        const request = {
          origin: origin,
          destination: destination,
          travelMode: window.google.maps.TravelMode.DRIVING,
          unitSystem: window.google.maps.UnitSystem.IMPERIAL, // Changed to miles
          avoidHighways: false,
          avoidTolls: false,
        };

        service.route(request, (result: any, status: any) => {
          if (status === window.google.maps.DirectionsStatus.OK && result?.routes?.[0]?.legs?.[0]) {
            const leg = result.routes[0].legs[0];
            const directionsResult: GoogleDirectionsResult = {
              distance: leg.distance.text,
              duration: leg.duration.text,
              distanceValue: leg.distance.value,
              durationValue: leg.duration.value,
            };

            // Cache the result
            this.directionsCache[cacheKey] = {
              result: directionsResult,
              timestamp: Date.now(),
            };

            resolve(directionsResult);
          } else {
            resolve(null);
          }
        });
      } catch (error) {
        console.error('Google Directions API error:', error);
        resolve(null);
      }
    });
  }

  /**
   * Get place suggestions using Google Maps JavaScript API
   * Uses caching to minimize API calls
   */
  async getPlaceSuggestions(input: string, signal?: AbortSignal): Promise<GooglePlaceResult[]> {
    if (!input || input.length < 3) {
      return [];
    }

    // Check if Google Maps API is loaded
    if (!window.google || !window.google.maps || !window.google.maps.places) {
      console.warn('Google Maps API not loaded yet');
      return [];
    }

    const cacheKey = input.toLowerCase().trim();
    const cached = this.placesCache[cacheKey];

    // Return cached result if valid
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.results;
    }

    return new Promise(resolve => {
      if (signal?.aborted) {
        resolve([]);
        return;
      }

      try {
        const service = new window.google.maps.places.AutocompleteService();

        const request = {
          input: input,
          componentRestrictions: { country: 'gb' }, // UK only
          types: ['geocode', 'establishment'], // Addresses and places (geocode includes addresses)
        };

        service.getPlacePredictions(request, (predictions: any[], status: any) => {
          if (signal?.aborted) {
            resolve([]);
            return;
          }

          if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
            const results: GooglePlaceResult[] = predictions.map((prediction: any) => ({
              placeId: prediction.place_id,
              address: prediction.description,
              coordinates: [0, 0] as [number, number], // Will be filled by place details if needed
              type: this.determineLocationTypeFromPrediction(prediction),
              components: this.extractComponentsFromPrediction(prediction),
            }));

            // Cache the results
            this.placesCache[cacheKey] = {
              results,
              timestamp: Date.now(),
            };

            resolve(results);
          } else {
            resolve([]);
          }
        });
      } catch (error) {
        console.error('Google Places API error:', error);
        resolve([]);
      }
    });
  }

  /**
   * Clear expired cache entries
   */
  private clearExpiredCache(): void {
    const now = Date.now();

    // Clear directions cache
    Object.keys(this.directionsCache).forEach(key => {
      const cacheEntry = this.directionsCache[key];
      if (cacheEntry && now - cacheEntry.timestamp > this.CACHE_DURATION) {
        delete this.directionsCache[key];
      }
    });

    // Clear places cache
    Object.keys(this.placesCache).forEach(key => {
      const cacheEntry = this.placesCache[key];
      if (cacheEntry && now - cacheEntry.timestamp > this.CACHE_DURATION) {
        delete this.placesCache[key];
      }
    });
  }

  /**
   * Determine location type from Google Places prediction
   */
  private determineLocationType(prediction: {
    types?: string[];
  }): 'address' | 'airport' | 'hotel' | 'poi' {
    const types = prediction.types || [];

    if (types.includes('airport')) return 'airport';
    if (types.includes('lodging')) return 'hotel';
    if (types.includes('establishment') || types.includes('point_of_interest')) return 'poi';
    return 'address';
  }

  /**
   * Determine location type from Google Maps JS API prediction
   */
  private determineLocationTypeFromPrediction(prediction: {
    types?: string[];
  }): 'address' | 'airport' | 'hotel' | 'poi' {
    const types = prediction.types || [];

    if (types.includes('airport')) return 'airport';
    if (types.includes('lodging')) return 'hotel';
    if (types.includes('establishment') || types.includes('point_of_interest')) return 'poi';
    return 'address';
  }

  /**
   * Extract address components from Google Places prediction
   */
  private extractComponents(prediction: {
    terms?: Array<{ value: string }>;
  }): Record<string, string> {
    const components: Record<string, string> = {};

    if (prediction.terms) {
      prediction.terms.forEach((term: { value: string }, index: number) => {
        if (index === 0) components.street = term.value;
        if (index === (prediction.terms?.length ?? 0) - 1) components.country = term.value;
      });
    }

    return components;
  }

  /**
   * Extract address components from Google Maps JS API prediction
   */
  private extractComponentsFromPrediction(prediction: {
    terms?: Array<{ value: string }>;
  }): Record<string, string> {
    const components: Record<string, string> = {};

    if (prediction.terms) {
      prediction.terms.forEach((term: { value: string }, index: number) => {
        if (index === 0) components.street = term.value;
        if (index === (prediction.terms?.length ?? 0) - 1) components.country = term.value;
      });
    }

    return components;
  }
}

// Singleton instance
export const googleServices = new GoogleServicesManager();

// Auto-cleanup cache every 10 minutes
if (typeof window !== 'undefined') {
  setInterval(
    () => {
      // Access private method through instance
      (googleServices as any).clearExpiredCache();
    },
    10 * 60 * 1000
  );
}
