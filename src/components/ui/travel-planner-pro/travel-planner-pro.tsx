'use client';

import { useBookingState } from '@/hooks/useBookingState';
import { getBookingRule } from '@/lib/booking/booking-rules';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { ValidationFeedbackContainer } from '../validation-feedback';
import { RoutePreviewPro } from './components';
import { TRAVEL_PLANNER_PRO_THEME } from './constants';
import {
  DateTimeSection,
  DurationSection,
  FlightNumbersSection,
  PassengersLuggageSection,
  PickupDropoffSection,
  StopsSection,
} from './layout';

interface TravelPlannerProProps {
  className?: string;
  onPlanChange?: (plan: { startDate: Date; endDate?: Date; passengers: number }) => void;
}

export const TravelPlannerPro = ({
  className,
  onPlanChange: _onPlanChange,
}: TravelPlannerProProps) => {
  // UI-local state
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const [validation] = useState({ errors: [] });

  // Global booking state (single source of truth)
  const bookingState = useBookingState();
  const {
    bookingType,
    tripConfiguration,
    setPickup,
    setDropoff,
    setAdditionalStops,
    setPickupDateTime,
    setReturnDateTime,
    setPassengers,
    setLuggage,
    setFlightNumberPickup,
    setFlightNumberReturn,
    setHoursRequested,
  } = bookingState;

  // Get booking rules for current booking type
  const bookingRule = getBookingRule(bookingType);

  // Auto-clear stops when showStops = false (e.g., hourly booking)
  useEffect(() => {
    if (!bookingRule.showStops && tripConfiguration.additionalStops.length > 0) {
      setAdditionalStops([]);
    }
  }, [bookingRule.showStops, tripConfiguration.additionalStops.length, setAdditionalStops]);

  // Auto-clear return date/time when bookingType changes to non-return
  useEffect(() => {
    if (!bookingRule.showReturn) {
      if (tripConfiguration.returnDate || tripConfiguration.returnTime) {
        setReturnDateTime(null, '');
      }
    }
  }, [
    bookingRule.showReturn,
    tripConfiguration.returnDate,
    tripConfiguration.returnTime,
    setReturnDateTime,
  ]);

  // Handler functions using direct store actions
  const handlePassengersChange = (count: number) => setPassengers(count);
  const handleLuggageChange = (count: number) => setLuggage(count);
  const handleFlightNumberPickupChange = (flightNumber: string) =>
    setFlightNumberPickup(flightNumber);
  const handleFlightNumberReturnChange = (flightNumber: string) =>
    setFlightNumberReturn(flightNumber);
  const handleHoursRequestedChange = (hours: number) => setHoursRequested(hours);

  // Stops handlers
  const handleStopsCountChange = (value: number) => {
    const currentStops = tripConfiguration.additionalStops;
    if (value > currentStops.length) {
      const newStops = [...currentStops];
      while (newStops.length < value) {
        newStops.push({
          placeId: '',
          address: '',
          coordinates: [0, 0],
          type: 'address',
          components: {},
        });
      }
      setAdditionalStops(newStops);
    } else if (value < currentStops.length) {
      setAdditionalStops(currentStops.slice(0, value));
    }
  };

  // Handlers
  const handleNavigate = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  const handleDateSelect = (date: Date) => {
    const { pickupTime, returnTime } = tripConfiguration;

    if (!bookingRule.showReturn) {
      // SINGLE DATE MODE: oneway, hourly, fleet
      setPickupDateTime(date, pickupTime);
      // NEVER set return for single date bookings
    } else {
      // RANGE DATE MODE: return trips only
      const { pickupDate, returnDate } = tripConfiguration;

      if (!pickupDate || (pickupDate && returnDate)) {
        // Start new range: set pickup, clear return
        setPickupDateTime(date, pickupTime);
        setReturnDateTime(null, returnTime ?? '');
      } else if (date >= pickupDate) {
        // Set return date after pickup
        setReturnDateTime(date, returnTime ?? '');
      } else {
        // New pickup before previous, reset range
        setPickupDateTime(date, pickupTime);
        setReturnDateTime(null, returnTime ?? '');
      }
    }
  };

  const handlePickupTimeSelect = (time: string) => {
    setPickupDateTime(tripConfiguration.pickupDate, time);
  };

  const handleReturnTimeSelect = (time: string) => {
    setReturnDateTime(tripConfiguration.returnDate, time);
  };

  // Step 1 Validation Helper - Ready for integration
  // const getStep1ValidationStatus = () => validateStep1Complete(bookingType, tripConfiguration);

  return (
    <div className={cn(TRAVEL_PLANNER_PRO_THEME.container, className)}>
      {/* Validation Feedback */}
      {showValidationErrors && validation.errors.length > 0 && (
        <ValidationFeedbackContainer
          errors={validation.errors.map((error: { message: string }) => error.message)}
          onDismissErrors={() => setShowValidationErrors(false)}
          className='mb-6'
          showPriorityOnly={true}
        />
      )}
      <header>
        <h2 className={TRAVEL_PLANNER_PRO_THEME.header}>Travel Planner Pro</h2>
        <p className={TRAVEL_PLANNER_PRO_THEME.subtext}>
          Plan your luxury journey with precision and style.
        </p>
      </header>

      {/* RETURN TRIP INDICATOR */}
      {bookingType === 'return' && (
        <div
          className={`${TRAVEL_PLANNER_PRO_THEME.card} ${TRAVEL_PLANNER_PRO_THEME.motion.transition} p-4 mb-6`}
        >
          <div className='flex items-center gap-3'>
            <span className='text-2xl'>↔️</span>
            <div className='flex flex-col'>
              <span className='text-sm font-medium text-white'>Round Trip — Return included</span>
              <span className='text-xs text-neutral-400'>Pickup → Dropoff / Return → Pickup</span>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <div className='grid lg:grid-cols-2 gap-8'>
        {/* LEFT COLUMN: All Step 1 input components */}
        <div className='flex flex-col gap-8'>
          <PickupDropoffSection
            bookingRule={bookingRule}
            tripConfiguration={tripConfiguration}
            onPickupChange={setPickup}
            onDropoffChange={setDropoff}
          />

          <StopsSection
            bookingRule={bookingRule}
            tripConfiguration={tripConfiguration}
            onStopsCountChange={handleStopsCountChange}
            onStopsChange={setAdditionalStops}
          />

          <PassengersLuggageSection
            bookingRule={bookingRule}
            tripConfiguration={tripConfiguration}
            onPassengersChange={handlePassengersChange}
            onLuggageChange={handleLuggageChange}
          />

          <FlightNumbersSection
            bookingRule={bookingRule}
            tripConfiguration={tripConfiguration}
            onFlightNumberPickupChange={handleFlightNumberPickupChange}
            onFlightNumberReturnChange={handleFlightNumberReturnChange}
          />

          <DurationSection
            bookingRule={bookingRule}
            tripConfiguration={tripConfiguration}
            onHoursRequestedChange={handleHoursRequestedChange}
          />
        </div>

        {/* RIGHT COLUMN: Calendar, Time Slots, RoutePreview */}
        <div className='flex flex-col gap-8'>
          <DateTimeSection
            bookingRule={bookingRule}
            tripConfiguration={tripConfiguration}
            currentMonth={currentMonth}
            onDateSelect={handleDateSelect}
            onNavigate={handleNavigate}
            onPickupTimeSelect={handlePickupTimeSelect}
            onReturnTimeSelect={handleReturnTimeSelect}
          />

          {/* Route Preview */}
          <div className={TRAVEL_PLANNER_PRO_THEME.card}>
            <RoutePreviewPro />
          </div>
        </div>
      </div>
    </div>
  );
};
