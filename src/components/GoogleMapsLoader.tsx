/**
 * Google Maps Loader Component
 *
 * Loads Google Maps JavaScript API with Places library using Next.js Script
 * Handles CSP properly and avoids script injection issues
 */

'use client';

import Script from 'next/script';
import { useState } from 'react';

declare global {
  interface Window {
    google?: {
      maps: {
        DirectionsService: new () => any;
        DirectionsStatus: any;
        TravelMode: any;
        UnitSystem: any;
        places: {
          AutocompleteService: new () => any;
          PlacesServiceStatus: any;
        };
      };
    };
    initGoogleMaps?: () => void;
  }
}

interface GoogleMapsLoaderProps {
  children: React.ReactNode;
}

export function GoogleMapsLoader({ children }: GoogleMapsLoaderProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    console.error('Google Maps API key not found in environment variables');
    return <>{children}</>;
  }

  // Global callback function
  if (typeof window !== 'undefined') {
    window.initGoogleMaps = () => {
      console.log('Google Maps API loaded successfully');
      console.log('Available services:', {
        places: !!window.google?.maps?.places,
        directions: !!window.google?.maps?.DirectionsService,
      });
      setIsLoaded(true);
    };
  }

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMaps`}
        strategy='lazyOnload'
        onLoad={() => {
          console.log('Google Maps script loaded');
        }}
        onError={error => {
          console.error('Failed to load Google Maps API:', error);
        }}
      />
      {children}
    </>
  );
}
