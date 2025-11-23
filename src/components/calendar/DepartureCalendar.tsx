'use client';

import { useBookingState } from '@/hooks/useBookingState';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export function DepartureCalendar() {
  const { tripConfiguration, setPickupDateTime } = useBookingState();

  return (
    <div>
      <h3 className='text-black text-sm mb-2'>Select Date & Time</h3>
      <DatePicker
        selected={tripConfiguration.pickupDateTime}
        onChange={(selectedDate: Date | null) => {
          setPickupDateTime(selectedDate);
        }}
        minDate={new Date()}
        filterTime={time => {
          const today = new Date();
          const selectedDay = tripConfiguration.pickupDateTime || today;

          if (selectedDay.toDateString() === today.toDateString()) {
            return time.getTime() > today.getTime();
          }

          return true;
        }}
        inline
        showTimeSelect
        timeFormat='HH:mm'
        timeIntervals={15}
        dateFormat='MMMM d, yyyy h:mm aa'
      />
    </div>
  );
}
