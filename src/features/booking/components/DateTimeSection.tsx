'use client';

import { useBookingState } from '@/hooks/useBookingState';

import { BespokePickerComponent } from '../../../components/calendar/BespokePickerComponent';
import { DailyPickerComponent } from '../../../components/calendar/DailyPickerComponent';
import { DeparturePickerComponent } from '../../../components/calendar/DeparturePickerComponent';
import { FleetPickerComponent } from '../../../components/calendar/FleetPickerComponent';
import { HourlyPickerComponent } from '../../../components/calendar/HourlyPickerComponent';
import { ReturnPickerComponent } from '../../../components/calendar/ReturnPickerComponent';

export function DateTimeSection() {
  const { bookingType } = useBookingState();

  return (
    <div className='space-y-5'>
      {/* ONE WAY */}
      {bookingType === 'oneway' && <DeparturePickerComponent />}

      {/* RETURN */}
      {bookingType === 'return' && (
        <div className='space-y-5'>
          <DeparturePickerComponent />
          <ReturnPickerComponent />
        </div>
      )}

      {/* HOURLY */}
      {bookingType === 'hourly' && <HourlyPickerComponent />}

      {/* DAILY */}
      {bookingType === 'daily' && <DailyPickerComponent />}

      {/* FLEET */}
      {bookingType === 'fleet' && <FleetPickerComponent />}

      {/* BESPOKE */}
      {bookingType === 'bespoke' && <BespokePickerComponent />}
    </div>
  );
}
