export { createBookingStore } from './useBookingState/createBookingStore';
export type * from './useBookingState/types';

import { createBookingStore } from './useBookingState/createBookingStore';

// Hook simplu
export const useBookingState = createBookingStore;
