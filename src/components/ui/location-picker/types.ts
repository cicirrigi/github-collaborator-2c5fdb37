// Types și interfaces pentru LocationPicker
export type LocationVariant = 'pickup' | 'destination' | 'stop';

export interface GooglePlace {
  placeId: string;
  address: string;
  coordinates: [number, number];
  type: 'airport' | 'hotel' | 'address' | 'poi';
  components: {
    country?: string;
    city?: string;
    postcode?: string;
  };
}

export interface LocationPickerProps {
  // Core functionality
  value?: GooglePlace | null;
  onChange?: (location: GooglePlace | null) => void;
  variant?: LocationVariant;

  // UI customization (respectă template-ul bibliotecii)
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  required?: boolean;
  className?: string;

  // Content
  placeholder?: string;
  icon?: React.ReactNode;

  // Google API configuration
  googleConfig?: {
    restrictions?: {
      country?: string;
      bounds?: google.maps.LatLngBounds | null;
    };
    types?: string[];
  };

  // Validation
  error?: string;
  onValidate?: (location: GooglePlace) => string | null;
}
