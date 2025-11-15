import { create } from 'zustand';

export type TripType = 'oneway' | 'return' | 'hourly' | 'daily' | 'fleet' | 'bespoke';

interface BookingState {
  tripType: TripType;

  pickup: string;
  dropoff: string;
  returnPickup: string;
  returnDropoff: string;

  departureDateTime: Date | null;
  returnDateTime: Date | null;

  // 🔥 NEW — Date Range pentru Daily
  dailyRange: [Date | null, Date | null];

  setTripType: (v: TripType) => void;
  setPickup: (v: string) => void;
  setDropoff: (v: string) => void;
  setReturnPickup: (v: string) => void;
  setReturnDropoff: (v: string) => void;

  setDepartureDateTime: (v: Date | null) => void;
  setReturnDateTime: (v: Date | null) => void;
  setDailyRange: (range: [Date | null, Date | null]) => void;
}

export const useBookingStore = create<BookingState>(set => ({
  tripType: 'oneway',

  pickup: '',
  dropoff: '',
  returnPickup: '',
  returnDropoff: '',

  departureDateTime: null,
  returnDateTime: null,

  // 🔥 NEW — Daily Range State
  dailyRange: [null, null] as [Date | null, Date | null],

  setTripType: v => set({ tripType: v }),
  setPickup: v => set({ pickup: v }),
  setDropoff: v => set({ dropoff: v }),
  setReturnPickup: v => set({ returnPickup: v }),
  setReturnDropoff: v => set({ returnDropoff: v }),

  setDepartureDateTime: v => set({ departureDateTime: v }),
  setReturnDateTime: v => set({ returnDateTime: v }),

  setDailyRange: range =>
    set({
      dailyRange: [range[0] ?? null, range[1] ?? null],
    }),
}));
