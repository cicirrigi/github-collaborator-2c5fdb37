/**
 * 🕐 BOOKING TIME HELPERS - Business logic pentru time restrictions
 * Nu afectează UI-ul - doar pure functions pentru validare
 */

import { type BookingType } from './booking-rules';

/**
 * Buffer în ore pentru fiecare booking type
 */
const BOOKING_BUFFER_HOURS: Record<BookingType, number> = {
  oneway: 2,
  return: 2,
  hourly: 2,
  daily: 2,
  fleet: 2,
  bespoke: 0, // Bespoke = doar cerere, fără buffer
} as const;

/**
 * Calculează timpul minim disponibil pentru booking
 * @param bookingType - tipul de booking
 * @param selectedDate - data selectată (pentru a verifica dacă e azi)
 * @returns Date | null - timpul minim disponibil sau null dacă nu se aplică restricții
 */
export const getMinimumBookingTime = (
  bookingType: BookingType,
  selectedDate: Date
): Date | null => {
  const buffer = BOOKING_BUFFER_HOURS[bookingType];
  const now = new Date();

  // Restricții doar pentru ziua de azi - comparație mai sigură
  if (selectedDate.toDateString() !== now.toDateString()) {
    return null;
  }

  // Pentru bespoke: timpul minim = ora curentă (fără buffer, dar nu în trecut)
  if (buffer === 0) {
    return now;
  }

  // Pentru altele: timpul minim = ora curentă + buffer
  const minimumTime = new Date();
  minimumTime.setHours(minimumTime.getHours() + buffer);

  return minimumTime;
};

/**
 * Verifică dacă un timp specific este disponibil pentru booking
 * @param bookingType - tipul de booking
 * @param selectedDateTime - data și ora selectată
 * @returns boolean - true dacă timpul este disponibil
 */
export const isTimeSlotAvailable = (bookingType: BookingType, selectedDateTime: Date): boolean => {
  const minimumTime = getMinimumBookingTime(bookingType, selectedDateTime);

  // Dacă nu se aplică restricții, timpul e disponibil
  if (!minimumTime) {
    return true;
  }

  // Verifică dacă timpul selectat e după timpul minim
  return selectedDateTime >= minimumTime;
};

/**
 * Rotunjește timpul la următorul interval de 15 minute
 */
const roundToNext15Minutes = (date: Date): Date => {
  const rounded = new Date(date);
  const minutes = rounded.getMinutes();
  const remainder = minutes % 15;

  if (remainder !== 0) {
    rounded.setMinutes(minutes + (15 - remainder));
  }
  rounded.setSeconds(0);
  rounded.setMilliseconds(0);

  return rounded;
};

/**
 * Calculează și formatează mesajul pentru primul time slot disponibil
 * Rotunjește la intervalul de 15 minute pentru consistență cu calendar-ul
 */
export const getAvailableFromMessage = (
  bookingType: BookingType,
  selectedDate: Date
): string | null => {
  const minimumTime = getMinimumBookingTime(bookingType, selectedDate);

  if (!minimumTime) {
    return null;
  }

  // Rotunjește la următorul interval de 15 minute (ca în calendar)
  const roundedTime = roundToNext15Minutes(minimumTime);

  // Format: "Earliest Available Pick-up: HH:MM" (format 24h, rotunjit la 15min)
  const timeString = roundedTime.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return `Earliest Available Pick-up: ${timeString}`;
};
