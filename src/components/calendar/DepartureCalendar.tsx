'use client';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { useBookingStore } from '../../features/booking/store/booking.store';

export function DepartureCalendar() {
  const { departureDateTime, setDepartureDateTime } = useBookingStore();

  return (
    <div>
      <h3 className='text-black text-sm mb-2'>Select Date & Time</h3>
      <DatePicker
        selected={departureDateTime}
        onChange={(selectedDate: Date | null) => {
          setDepartureDateTime(selectedDate);
        }}
        minDate={new Date()}
        filterTime={time => {
          const today = new Date();
          const selectedDay = departureDateTime || today;

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
