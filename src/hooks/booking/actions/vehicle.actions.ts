/**
 * 🚗 Vehicle Actions
 */

import type {
  VehicleSelection,
  SpecialRequest,
  PaymentDetails,
} from '../../../types/booking/index';

import type { BookingStore } from '@/types/booking';

type ZustandSet = (
  partial: Partial<BookingStore> | ((state: BookingStore) => Partial<BookingStore>)
) => void;
type ZustandGet = () => BookingStore;

export interface VehicleActions {
  setVehicleSelection: (selection: VehicleSelection) => void;
  toggleService: (serviceId: string) => void;
  addSpecialRequest: (text: string, category: SpecialRequest['category']) => void;
  removeSpecialRequest: (id: string) => void;
  setPaymentDetails: (details: PaymentDetails) => void;
}

export const createVehicleActions = (set: ZustandSet, get: ZustandGet): VehicleActions => ({
  setVehicleSelection: (selection: VehicleSelection) => {
    set({ vehicleSelection: selection, isDirty: true });

    // TODO: Implement these methods in BookingStore
    // get().updateLimitsFromVehicle();
    // get().validatePassengerLimits();
    get().calculatePricing();
  },

  toggleService: (serviceId: string) => {
    set((state: any) => ({
      services: state.services.map((service: any) =>
        service.id === serviceId ? { ...service, isSelected: !service.isSelected } : service
      ),
      isDirty: true,
    }));
    get().calculatePricing();
  },

  addSpecialRequest: (text: string, category: SpecialRequest['category']) => {
    const request: SpecialRequest = {
      id: `req_${Date.now()}`,
      text: text.trim(),
      category,
    };

    set((state: any) => ({
      specialRequests: [...state.specialRequests, request],
      isDirty: true,
    }));
  },

  removeSpecialRequest: (id: string) => {
    set((state: any) => ({
      specialRequests: state.specialRequests.filter((req: any) => req.id !== id),
      isDirty: true,
    }));
  },

  setPaymentDetails: (details: PaymentDetails) => {
    set({ paymentDetails: details, isDirty: true });
  },
});
