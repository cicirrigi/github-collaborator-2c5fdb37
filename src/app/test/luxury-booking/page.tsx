import { LuxuryBookingWindow } from '@/components/ui/luxury-booking/BookingWindow';

export default function Page() {
  return (
    <div className='min-h-screen bg-black p-10 text-white'>
      <h1 className='text-3xl mb-10'>Luxury Booking System - Demo</h1>
      <LuxuryBookingWindow />
    </div>
  );
}
