/**
 * Booking mappers entrypoint (non-deprecated).
 *
 * This is the module required by `src/services/booking.service.ts`.
 */

export { mapOnewayBooking } from './oneway.mapper';
export { mapOnewayLegs } from './oneway.mapper';

export { mapReturnBooking } from './return.mapper';
export { mapReturnBookingMetadata } from './return.mapper';
export { mapReturnLegs } from './return.mapper';
