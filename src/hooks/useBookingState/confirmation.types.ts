/**
 * 🎯 STEP 4 CONFIRMATION TYPES
 * Clean TypeScript definitions for booking confirmation
 */

export interface PassengerName {
  id: string;
  name: string;
  isPrimary: boolean;
}

export interface DriverAssignment {
  id?: string;
  name?: string;
  phone?: string;
  vehicleInfo?: string;
  status: 'pending' | 'assigned' | 'en_route' | 'arrived';
  assignedAt?: Date;
}

export interface FleetDriverAssignment {
  vehicleId: string;
  categoryName: string;
  modelName: string;
  driver: DriverAssignment;
}

export interface PaymentConfirmation {
  transactionId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  stripeReceiptUrl?: string;
  completedAt: Date;
}

export interface BookingConfirmation {
  bookingId: string;
  referenceNumber: string;
  status: 'confirmed' | 'processing' | 'cancelled';
  confirmedAt: Date;
  passengerNames: PassengerName[];
  driverAssignments: DriverAssignment[] | FleetDriverAssignment[];
  payment: PaymentConfirmation;
  emailSent: boolean;
  emailAddress?: string;
}

/**
 * Confirmation Actions Interface
 */
export interface ConfirmationActions {
  // Passenger name management
  updatePassengerName: (passengerId: string, name: string) => void;
  setPassengerNames: (names: PassengerName[]) => void;

  // Driver assignment updates
  updateDriverAssignment: (assignment: DriverAssignment) => void;
  updateFleetDriverAssignment: (vehicleId: string, assignment: DriverAssignment) => void;

  // Confirmation data
  setBookingConfirmation: (confirmation: BookingConfirmation) => void;
  clearConfirmation: () => void;

  // Helpers
  generateReferenceNumber: () => string;
  initializePassengerNames: (passengerCount: number) => PassengerName[];
}
