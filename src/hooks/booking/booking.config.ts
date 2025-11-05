import { createJSONStorage } from 'zustand/middleware';

export const bookingPersistConfig = {
  name: 'booking-store',
  storage: createJSONStorage(() =>
    typeof window !== 'undefined'
      ? localStorage
      : {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        }
  ),
};
