// 🎯 BOOKING TYPES - All type definitions for the unified booking system

export type Coordinates = [number, number];

export interface LocationData {
  placeId: string;
  address: string;
  coordinates: Coordinates;
  type: 'address' | 'airport' | 'hotel' | 'poi';
  components: Record<string, string>;
}

export type BookingType = 'oneway' | 'return' | 'hourly' | 'daily' | 'fleet' | 'bespoke';

export interface TripConfiguration {
  // Locations
  pickup: LocationData | null;
  dropoff: LocationData | null;
  additionalStops: LocationData[];

  // Return Trip Locations
  returnPickup: LocationData | null;
  returnDropoff: LocationData | null;
  returnAdditionalStops: LocationData[];
  isDifferentReturnLocation: boolean;

  // Dates & Times (legacy format - keeping compatibility)
  pickupDate: Date | null;
  returnDate: Date | null;
  pickupTime: string;
  returnTime: string;

  // Dates & Times (unified)
  pickupDateTime: Date | null;
  returnDateTime: Date | null;

  // Daily range for daily bookings
  dailyRange: [Date | null, Date | null];

  // Passengers & Logistics
  passengers: number;
  luggage: number;
  flightNumberPickup: string;
  flightNumberReturn: string;

  // Hourly bookings
  hoursRequested: number | null;

  // Daily bookings
  daysRequested: number | null;
}

export interface BookingState {
  // BOOKING TYPE
  bookingType: BookingType;
  setBookingType: (type: BookingType) => void;

  // TRIP CONFIGURATION
  tripConfiguration: TripConfiguration;

  // WIZARD STATE
  currentStep: number;
  completedSteps: number[];
  totalSteps: number;

  // LOCATION ACTIONS
  setPickup: (location: LocationData | null) => void;
  setDropoff: (location: LocationData | null) => void;
  setAdditionalStops: (stops: LocationData[]) => void;

  // RETURN TRIP ACTIONS
  setReturnPickup: (location: LocationData | null) => void;
  setReturnDropoff: (location: LocationData | null) => void;
  setReturnAdditionalStops: (stops: LocationData[]) => void;
  setIsDifferentReturnLocation: (value: boolean) => void;

  // DATE & TIME ACTIONS (simplified)
  setPickupDateTime: (date: Date | null) => void;
  setReturnDateTime: (date: Date | null) => void;
  setDailyRange: (range: [Date | null, Date | null]) => void;

  // PASSENGER & LOGISTICS ACTIONS
  setPassengers: (value: number) => void;
  setLuggage: (value: number) => void;
  setFlightNumberPickup: (value: string) => void;
  setFlightNumberReturn: (value: string) => void;
  setHoursRequested: (value: number | null) => void;
  setDaysRequested: (value: number | null) => void;

  // WIZARD ACTIONS
  setCurrentStep: (step: number) => void;
  setCompletedSteps: (steps: number[]) => void;
  nextStep: () => void;
  prevStep: () => void;
  canProceedToStep: (step: number) => boolean;
  validateCurrentStep: () => boolean;
  resetTrip: () => void;

  // UTILITY ACTIONS
  calculateEstimatedDistanceAndTime: () => { distanceKm: number; durationMinutes: number };
}

// 🔧 UTILITY TYPE EXPORTS
export type PickupDropoffField = LocationData | null;
export type StopPoint = LocationData;
