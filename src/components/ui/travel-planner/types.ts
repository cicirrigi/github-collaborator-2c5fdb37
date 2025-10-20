import { BookingTabType } from '../booking-tabs/types';
import { GooglePlace } from '../location-picker/types';

// Time slot interface
export interface TimeSlot {
  value: string;
  label: string;
  disabled?: boolean;
  category?: 'morning' | 'afternoon' | 'evening';
}

// Stop interface pentru additional stops
export interface Stop {
  id: string;
  address: string;
  place?: GooglePlace;
  coordinates?: [number, number];
}

// Travel plan complet
export interface TravelPlan {
  // Date & Time
  pickupDate: Date;
  returnDate?: Date;
  pickupTime: TimeSlot | null;
  returnTime?: TimeSlot | null;
  
  // Locations
  pickup: GooglePlace | null;
  destination: GooglePlace | null;
  additionalStops: Stop[];
  
  // Meta
  bookingType: BookingTabType;
  totalStops: number;
}

// Props pentru componente
export interface TravelPlannerProps {
  bookingType: BookingTabType;
  initialPlan?: Partial<TravelPlan>;
  onPlanChange?: (plan: TravelPlan) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showMapPreview?: boolean;
  enableWeatherHints?: boolean;
}

export interface DateTimeSectionProps {
  bookingType: BookingTabType;
  pickupDate: Date | null;
  returnDate?: Date | null;
  pickupTime: TimeSlot | null;
  returnTime?: TimeSlot | null;
  onDateChange: (pickup: Date, return?: Date) => void;
  onTimeChange: (pickup: TimeSlot, return?: TimeSlot) => void;
  showReturn: boolean;
  isLoading?: boolean;
  className?: string;
}

export interface AdditionalStopsProps {
  stops: Stop[];
  maxStops?: number;
  bookingType: BookingTabType;
  onStopsChange: (stops: Stop[]) => void;
  showMapPreview?: boolean;
  className?: string;
}

export interface StopsCounterProps {
  value: number;
  max: number;
  min?: number;
  onChange: (count: number) => void;
  disabled?: boolean;
  className?: string;
}

// Map preview types
export interface MapPreviewProps {
  stops: Stop[];
  pickup?: GooglePlace;
  destination?: GooglePlace;
  className?: string;
}

// Weather hint types  
export interface WeatherHint {
  condition: string;
  temperature: number;
  recommendation?: string;
  icon: string;
}

// Skeleton loader types
export interface DateTimeSectionSkeletonProps {
  showReturn?: boolean;
  className?: string;
}
