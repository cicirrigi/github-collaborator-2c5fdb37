/// <reference types="vite/client" />

declare module '*.css' {
  const content: string;
  export default content;
}

declare module 'react-phone-number-input/style.css';

declare namespace google {
  namespace maps {
    class Map {}
    class Marker {}
    namespace places {
      class AutocompleteService {}
      class PlacesService {}
      interface AutocompletePrediction {
        place_id: string;
        description: string;
        structured_formatting: {
          main_text: string;
          secondary_text: string;
        };
      }
      interface PlaceResult {
        place_id?: string;
        formatted_address?: string;
        geometry?: {
          location: {
            lat(): number;
            lng(): number;
          };
        };
        address_components?: Array<{
          long_name: string;
          short_name: string;
          types: string[];
        }>;
        name?: string;
        types?: string[];
      }
    }
    class Geocoder {}
    class DirectionsService {}
    class DirectionsRenderer {}
    interface DirectionsResult {}
    interface DirectionsRequest {}
    enum TravelMode {
      DRIVING = 'DRIVING',
    }
    enum DirectionsStatus {
      OK = 'OK',
    }
  }
}
