import { StateCreator } from 'zustand';
import type { BookingState } from '../useBookingState/booking.types';
import type {
  BookingConfirmation,
  ConfirmationActions,
  DriverAssignment,
  FleetDriverAssignment,
  PassengerName,
} from '../useBookingState/confirmation.types';

/**
 * 🎯 STEP 4 CONFIRMATION ACTIONS
 * Clean Zustand actions for booking confirmation management
 * No UI logic, pure state management
 */

export const createConfirmationActions: StateCreator<BookingState, [], [], ConfirmationActions> = (
  set,
  _get
) => ({
  // 👥 PASSENGER NAME MANAGEMENT
  updatePassengerName: (passengerId: string, name: string) => {
    set((state: BookingState) => ({
      confirmation: state.confirmation
        ? {
            ...state.confirmation,
            passengerNames: state.confirmation.passengerNames.map((p: PassengerName) =>
              p.id === passengerId ? { ...p, name } : p
            ),
          }
        : null,
    }));
  },

  setPassengerNames: (names: PassengerName[]) => {
    set((state: BookingState) => ({
      confirmation: state.confirmation
        ? {
            ...state.confirmation,
            passengerNames: names,
          }
        : null,
    }));
  },

  // 🚗 DRIVER ASSIGNMENT MANAGEMENT
  updateDriverAssignment: (assignment: DriverAssignment) => {
    set((state: BookingState) => ({
      confirmation: state.confirmation
        ? {
            ...state.confirmation,
            driverAssignments: [assignment], // Single driver for normal bookings
          }
        : null,
    }));
  },

  updateFleetDriverAssignment: (vehicleId: string, assignment: DriverAssignment) => {
    set(state => {
      if (!state.confirmation) return state;

      const fleetAssignments = state.confirmation.driverAssignments as FleetDriverAssignment[];
      const updatedAssignments = fleetAssignments.map(fa =>
        fa.vehicleId === vehicleId ? { ...fa, driver: assignment } : fa
      );

      return {
        confirmation: {
          ...state.confirmation,
          driverAssignments: updatedAssignments,
        },
      };
    });
  },

  // 📋 CONFIRMATION DATA MANAGEMENT
  setBookingConfirmation: (confirmation: BookingConfirmation) => {
    set({ confirmation });
  },

  clearConfirmation: () => {
    set({ confirmation: null });
  },

  // 🔧 HELPER FUNCTIONS
  generateReferenceNumber: () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 999999)
      .toString()
      .padStart(6, '0');

    return `VL-${year}${month}${day}-${random}`;
  },

  initializePassengerNames: (passengerCount: number) => {
    const names: PassengerName[] = [];

    // Primary passenger (account holder)
    names.push({
      id: 'primary',
      name: 'Account Holder', // User data should come from auth context, not BookingState
      isPrimary: true,
    });

    // Additional passengers
    for (let i = 2; i <= passengerCount; i++) {
      names.push({
        id: `passenger-${i}`,
        name: '', // Empty - user can fill
        isPrimary: false,
      });
    }

    return names;
  },
});
