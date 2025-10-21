import { type BookingTabType } from '@/components/ui/booking-tabs/types';
import { type GooglePlace } from '@/components/ui/location-picker/types';

/** Time slot pentru selectarea orelor */
export interface TimeSlot {
  value: string;
  label: string;
  disabled?: boolean;
  category?: 'morning' | 'afternoon' | 'evening';
}

/** Oprire suplimentară în traseu */
export interface Stop {
  id: string;
  address: string;
  place?: GooglePlace | null;
  coordinates?: [number, number] | null;
}

/** Structura completă a planificării */
export interface TravelPlan {
  pickupDate: Date | null;
  returnDate: Date | null;
  pickupTime: TimeSlot | null;
  returnTime: TimeSlot | null;
  pickup: GooglePlace | null;
  destination: GooglePlace | null;
  additionalStops: Stop[];
  bookingType: BookingTabType;
  totalStops: number;
}

/** Props pentru componenta principală */
export interface TravelPlannerProps {
  bookingType: BookingTabType;
  initialPlan?: Partial<TravelPlan>;
  onPlanChange?: (plan: TravelPlan) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showMapPreview?: boolean;
  enableWeatherHints?: boolean;
}

/** Props pentru secțiunea DateTime */
export interface DateTimeSectionProps {
  bookingType: BookingTabType;
  pickupDate: Date | null;
  returnDate: Date | null;
  pickupTime: TimeSlot | null;
  returnTime: TimeSlot | null;
  onDateChange: (pickup: Date | null, returnDate: Date | null) => void;
  onTimeChange: (pickup: TimeSlot | null, returnTime: TimeSlot | null) => void;
  showReturn: boolean;
  isLoading?: boolean;
  className?: string;
}

/** Props pentru opriri suplimentare */
export interface AdditionalStopsProps {
  stops: Stop[];
  maxStops?: number;
  bookingType: BookingTabType;
  onStopsChange: (stops: Stop[]) => void;
  showMapPreview?: boolean;
  className?: string;
}

/** Props pentru contorul de opriri */
export interface StopsCounterProps {
  value: number;
  max: number;
  min?: number;
  onChange: (count: number) => void;
  disabled?: boolean;
  className?: string;
}

/** Props pentru preview-ul hărții */
export interface MapPreviewProps {
  stops: Stop[];
  pickup?: GooglePlace | null;
  destination?: GooglePlace | null;
  className?: string;
}

/** Tipuri pentru sugestii meteo */
export interface WeatherHint {
  condition: string;
  temperature: number;
  recommendation?: string;
  icon: string;
}

/** Skeleton pentru încărcare */
export interface DateTimeSectionSkeletonProps {
  showReturn?: boolean;
  className?: string | undefined;
}
