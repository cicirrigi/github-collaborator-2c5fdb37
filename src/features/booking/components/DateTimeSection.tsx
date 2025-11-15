'use client';

import { useBookingStore } from '../store/booking.store';

import { BespokePickerComponent } from '../../../components/calendar/BespokePickerComponent';
import { DailyPickerComponent } from '../../../components/calendar/DailyPickerComponent';
import { DeparturePickerComponent } from '../../../components/calendar/DeparturePickerComponent';
import { FleetPickerComponent } from '../../../components/calendar/FleetPickerComponent';
import { HourlyPickerComponent } from '../../../components/calendar/HourlyPickerComponent';
import { ReturnPickerComponent } from '../../../components/calendar/ReturnPickerComponent';

export function DateTimeSection() {
  const { tripType } = useBookingStore();

  return (
    <div className='space-y-5'>
      {/* ONE WAY */}
      {tripType === 'oneway' && <DeparturePickerComponent />}

      {/* RETURN */}
      {tripType === 'return' && (
        <div className='space-y-5'>
          <DeparturePickerComponent />
          <ReturnPickerComponent />
        </div>
      )}

      {/* HOURLY */}
      {tripType === 'hourly' && <HourlyPickerComponent />}

      {/* DAILY */}
      {tripType === 'daily' && <DailyPickerComponent />}

      {/* FLEET */}
      {tripType === 'fleet' && <FleetPickerComponent />}

      {/* BESPOKE */}
      {tripType === 'bespoke' && <BespokePickerComponent />}
    </div>
  );
}
