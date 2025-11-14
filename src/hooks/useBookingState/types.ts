export type Coordinates = [number, number];

export interface LocationData {
  placeId: string;
  address: string;
  coordinates: Coordinates;
  type: 'address' | 'airport' | 'hotel' | 'poi';
  components: Record<string, string>;
}

export type StopPoint = LocationData;

export type PickupDropoffField = LocationData | null;

export interface TripConfiguration {
  /** Trip locations */
  pickup: PickupDropoffField;
  dropoff: PickupDropoffField;

  /** Additional stops */
  additionalStops: StopPoint[];

  /** Dates */
  pickupDate: Date | null;
  returnDate: Date | null;

  /** Times */
  pickupTime: string;
  returnTime: string;

  /** Passengers & Luggage */
  passengers: number;
  luggage: number;

  /** Flight numbers */
  flightNumberPickup: string;
  flightNumberReturn: string;

  /** Hourly bookings */
  hoursRequested: number | null;
}

export type BookingType = 'oneway' | 'return' | 'hourly' | 'fleet';

export interface BookingState {
  // BOOKING TYPE (CRITICAL for conditional UI)
  bookingType: BookingType;
  setBookingType: (type: BookingType) => void;

  // TRIP CONFIGURATION
  tripConfiguration: TripConfiguration;

  // ACȚIUNI
  setPickup: (location: PickupDropoffField) => void;
  setDropoff: (location: PickupDropoffField) => void;

  setAdditionalStops: (stops: StopPoint[]) => void;

  setPickupDateTime: (date: Date | null, time: string) => void;
  setReturnDateTime: (date: Date | null, time: string) => void;

  setPassengers: (value: number) => void;
  setLuggage: (value: number) => void;

  setFlightNumberPickup: (value: string) => void;
  setFlightNumberReturn: (value: string) => void;

  setHoursRequested: (value: number) => void;

  resetTrip: () => void;
}
