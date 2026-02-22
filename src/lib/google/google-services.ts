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

interface PlaceDetailsCache {
  [placeId: string]: {
    coordinates: [number, number];
    timestamp: number;
  };
}

// Small helper so TS doesn't complain about window.google typing
type GoogleWindow = typeof window & {
  google?: any;
};

class GoogleServicesManager {
  private directionsCache: DirectionsCache = {};
  private placesCache: PlacesCache = {};
  private placeDetailsCache: PlaceDetailsCache = {};

  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  // NOTE: This API key isn't used directly here because we rely on the Google Maps JS API already loaded in the browser.
  // Keeping it to avoid "deleting something important" in existing expectations.
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
    const o = (origin || '').trim();
    const d = (destination || '').trim();

    if (!o || !d) return null;

    const w = window as GoogleWindow;

    // Check if Google Maps API is loaded
    if (!w.google || !w.google.maps) {
      console.warn('Google Maps API not loaded yet');
      return null;
    }

    // Clean expired cache occasionally
    this.clearExpiredCache();

    const cacheKey = `${o.toLowerCase()}__${d.toLowerCase()}`;
    const cached = this.directionsCache[cacheKey];

    // Return cached result if valid
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.result;
    }

    return new Promise(resolve => {
      try {
        const service = new w.google.maps.DirectionsService();

        const request = {
          origin: o,
          destination: d,
          travelMode: w.google.maps.TravelMode.DRIVING,
          unitSystem: w.google.maps.UnitSystem.IMPERIAL, // affects text units
          avoidHighways: false,
          avoidTolls: false,
        };

        service.route(request, (result: any, status: any) => {
          try {
            if (status === w.google.maps.DirectionsStatus.OK && result?.routes?.[0]?.legs?.[0]) {
              const leg = result.routes[0].legs[0];

              // IMPORTANT:
              // leg.distance.value is in METERS (even if unitSystem is IMPERIAL).
              // Convert meters -> miles for distanceValue to match the interface comment.
              const meters = Number(leg.distance?.value ?? 0);
              const miles = meters > 0 ? meters / 1609.344 : 0;

              const directionsResult: GoogleDirectionsResult = {
                distance: String(leg.distance?.text ?? ''),
                duration: String(leg.duration?.text ?? ''),
                distanceValue: miles,
                durationValue: Number(leg.duration?.value ?? 0),
              };

              this.directionsCache[cacheKey] = {
                result: directionsResult,
                timestamp: Date.now(),
              };

              resolve(directionsResult);
              return;
            }

            resolve(null);
          } catch (e) {
            console.error('Google Directions parsing error:', e);
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
   * Calculate distance and duration for route with multiple waypoints (stops)
   * Supports [pickup, stop1, stop2, dropoff] route calculation
   */
  async getDirectionsWithWaypoints(locations: string[]): Promise<GoogleDirectionsResult | null> {
    if (!locations || locations.length < 2) return null;

    // Filter out empty locations
    const validLocations = locations.filter(loc => (loc || '').trim());
    if (validLocations.length < 2) return null;

    // If only 2 locations, use regular getDirections
    if (validLocations.length === 2) {
      return this.getDirections(validLocations[0], validLocations[1]);
    }

    const w = window as GoogleWindow;

    // Check if Google Maps API is loaded
    if (!w.google || !w.google.maps) {
      console.warn('Google Maps API not loaded yet');
      return null;
    }

    // Clean expired cache occasionally
    this.clearExpiredCache();

    const cacheKey = validLocations.map(l => l.toLowerCase()).join('__waypoint__');
    const cached = this.directionsCache[cacheKey];

    // Return cached result if valid
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.result;
    }

    return new Promise(resolve => {
      try {
        const service = new w.google.maps.DirectionsService();

        const origin = validLocations[0];
        const destination = validLocations[validLocations.length - 1];
        const waypoints = validLocations.slice(1, -1).map(location => ({
          location: location,
          stopover: true,
        }));

        const request = {
          origin: origin,
          destination: destination,
          waypoints: waypoints,
          travelMode: w.google.maps.TravelMode.DRIVING,
          unitSystem: w.google.maps.UnitSystem.IMPERIAL,
          avoidHighways: false,
          avoidTolls: false,
        };

        service.route(request, (result: any, status: any) => {
          try {
            if (status === w.google.maps.DirectionsStatus.OK && result?.routes?.[0]) {
              const route = result.routes[0];

              // Sum up all legs (pickup → stop1 → stop2 → dropoff)
              let totalDistanceMeters = 0;
              let totalDurationSeconds = 0;
              let distanceText = '';
              let durationText = '';

              if (route.legs && route.legs.length > 0) {
                for (const leg of route.legs) {
                  totalDistanceMeters += Number(leg.distance?.value ?? 0);
                  totalDurationSeconds += Number(leg.duration?.value ?? 0);
                }

                // Convert meters to miles
                const totalMiles = totalDistanceMeters > 0 ? totalDistanceMeters / 1609.344 : 0;

                // Format text display
                distanceText = `${Math.round(totalMiles * 10) / 10} miles`;
                const hours = Math.floor(totalDurationSeconds / 3600);
                const minutes = Math.round((totalDurationSeconds % 3600) / 60);
                durationText = hours > 0 ? `${hours}h ${minutes}m` : `${minutes} mins`;

                const directionsResult: GoogleDirectionsResult = {
                  distance: distanceText,
                  duration: durationText,
                  distanceValue: totalMiles,
                  durationValue: totalDurationSeconds,
                };

                this.directionsCache[cacheKey] = {
                  result: directionsResult,
                  timestamp: Date.now(),
                };

                resolve(directionsResult);
              } else {
                resolve(null);
              }
            } else {
              resolve(null);
            }
          } catch {
            resolve(null);
          }
        });
      } catch {
        resolve(null);
      }
    });
  }

  /**
   * Get place suggestions using Google Maps JavaScript API
   * Uses caching to minimize API calls
   *
   * NOTE:
   * This version returns coordinates for each suggestion (as your current code expects).
   * If you later want it even lighter/faster, the clean pattern is:
   * - suggestions return placeId/address only
   * - coords fetched only on selection
   */
  async getPlaceSuggestions(input: string, signal?: AbortSignal): Promise<GooglePlaceResult[]> {
    const q = (input || '').trim();
    if (!q || q.length < 3) return [];

    const w = window as GoogleWindow;

    // Check if Google Maps API is loaded
    if (!w.google || !w.google.maps || !w.google.maps.places) {
      console.warn('Google Maps API not loaded yet');
      return [];
    }

    // Clean expired cache occasionally
    this.clearExpiredCache();

    const cacheKey = q.toLowerCase();
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
        const service = new w.google.maps.places.AutocompleteService();

        const request = {
          input: q,
          componentRestrictions: { country: 'gb' }, // UK only
          types: ['geocode', 'establishment'],
        };

        service.getPlacePredictions(request, (predictions: any[], status: any) => {
          // Keep callback non-async (safer with typings), run async work inside.
          (async () => {
            if (signal?.aborted) {
              resolve([]);
              return;
            }

            if (
              status === w.google.maps.places.PlacesServiceStatus.OK &&
              Array.isArray(predictions)
            ) {
              // Fetch coords for predictions, but be defensive: if details fail, exclude entry.
              const results = await Promise.all(
                predictions.map(async (prediction: any) => {
                  const placeId = prediction?.place_id;
                  const description = prediction?.description;

                  if (!placeId || !description) return null;
                  if (signal?.aborted) return null;

                  const coordinates = await this.getPlaceCoordinates(placeId, signal);
                  if (!coordinates) return null;

                  const mapped: GooglePlaceResult = {
                    placeId,
                    address: description,
                    coordinates,
                    type: this.determineLocationTypeFromPrediction(prediction),
                    components: this.extractComponentsFromPrediction(prediction),
                  };

                  return mapped;
                })
              );

              const filtered = results.filter(Boolean) as GooglePlaceResult[];

              this.placesCache[cacheKey] = {
                results: filtered,
                timestamp: Date.now(),
              };

              resolve(filtered);
              return;
            }

            resolve([]);
          })().catch(err => {
            console.error('Google Places prediction handling error:', err);
            resolve([]);
          });
        });
      } catch (error) {
        console.error('Google Places API error:', error);
        resolve([]);
      }
    });
  }

  /**
   * Get place coordinates using Places Details via Google Maps JavaScript API
   * Cached to reduce repeated calls.
   */
  private async getPlaceCoordinates(
    placeId: string,
    signal?: AbortSignal
  ): Promise<[number, number] | null> {
    const id = (placeId || '').trim();
    if (!id) return null;

    const w = window as GoogleWindow;

    if (!w.google || !w.google.maps || !w.google.maps.places) {
      return null;
    }

    const cached = this.placeDetailsCache[id];
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.coordinates;
    }

    if (signal?.aborted) return null;

    return new Promise(resolve => {
      try {
        // PlacesService needs an HTMLElement; create a lightweight detached div.
        const div = document.createElement('div');
        const placesService = new w.google.maps.places.PlacesService(div);

        const request = {
          placeId: id,
          fields: ['geometry.location'],
        };

        placesService.getDetails(request, (place: any, status: any) => {
          try {
            if (signal?.aborted) {
              resolve(null);
              return;
            }

            if (
              status === w.google.maps.places.PlacesServiceStatus.OK &&
              place?.geometry?.location
            ) {
              const loc = place.geometry.location;

              // Google LatLng has methods lat() lng()
              const lat = typeof loc.lat === 'function' ? Number(loc.lat()) : Number(loc.lat);
              const lng = typeof loc.lng === 'function' ? Number(loc.lng()) : Number(loc.lng);

              if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
                resolve(null);
                return;
              }

              const coords: [number, number] = [lat, lng];

              this.placeDetailsCache[id] = {
                coordinates: coords,
                timestamp: Date.now(),
              };

              resolve(coords);
              return;
            }

            resolve(null);
          } catch (e) {
            console.error('Google Place Details parsing error:', e);
            resolve(null);
          }
        });
      } catch (error) {
        console.error('Google Place Details API error:', error);
        resolve(null);
      }
    });
  }

  /**
   * Clear expired cache entries
   */
  private clearExpiredCache(): void {
    const now = Date.now();

    // Directions cache
    Object.keys(this.directionsCache).forEach(key => {
      const entry = this.directionsCache[key];
      if (entry && now - entry.timestamp > this.CACHE_DURATION) {
        delete this.directionsCache[key];
      }
    });

    // Places predictions cache
    Object.keys(this.placesCache).forEach(key => {
      const entry = this.placesCache[key];
      if (entry && now - entry.timestamp > this.CACHE_DURATION) {
        delete this.placesCache[key];
      }
    });

    // Place details cache
    Object.keys(this.placeDetailsCache).forEach(key => {
      const entry = this.placeDetailsCache[key];
      if (entry && now - entry.timestamp > this.CACHE_DURATION) {
        delete this.placeDetailsCache[key];
      }
    });
  }

  /**
   * Determine location type from Google Maps JS API prediction
   */
  private determineLocationTypeFromPrediction(prediction: {
    types?: string[];
  }): 'address' | 'airport' | 'hotel' | 'poi' {
    const types = prediction?.types || [];

    if (types.includes('airport')) return 'airport';
    if (types.includes('lodging')) return 'hotel';
    if (types.includes('establishment') || types.includes('point_of_interest')) return 'poi';
    return 'address';
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
