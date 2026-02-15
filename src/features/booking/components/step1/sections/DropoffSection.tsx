'use client';

import { AutocompleteInput } from '@/components/ui/AutocompleteInput';
import { useBookingState } from '@/hooks/useBookingState';
import { getBookingRule } from '@/lib/booking/booking-rules';
import { MapPin } from 'lucide-react';
import { usePickupDropoffLogic } from '../hooks/usePickupDropoffLogic';

export function DropoffSection() {
  const { dropoff, handleDropoffChange } = usePickupDropoffLogic();
  const { bookingType } = useBookingState();
  const bookingRule = getBookingRule(bookingType);

  const placeholderText = bookingRule.dropoffOptional
    ? 'Enter destination address (optional)...'
    : 'Enter destination address...';

  return (
    <div className='space-y-3'>
      <AutocompleteInput
        value={dropoff}
        onChange={handleDropoffChange}
        placeholder={placeholderText}
        icon={<MapPin className='w-4 h-4 text-amber-200/60' />}
      />
    </div>
  );
}
