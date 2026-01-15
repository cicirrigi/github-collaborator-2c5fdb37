'use client';

import { Edit3, Users } from 'lucide-react';
import { useState } from 'react';

/**
 * 🎯 PASSENGER DETAILS CARD
 * Collect additional passenger names after booking confirmation
 * Simple, clean, modular
 */

interface PassengerDetailsCardProps {
  passengerCount: number;
  primaryPassengerName?: string;
}

export function PassengerDetailsCard({
  passengerCount,
  primaryPassengerName = 'Account Holder',
}: PassengerDetailsCardProps) {
  const [passengerNames, setPassengerNames] = useState<string[]>(
    Array(passengerCount - 1).fill('')
  );

  const handleNameChange = (index: number, name: string) => {
    const updated = [...passengerNames];
    updated[index] = name;
    setPassengerNames(updated);
  };

  if (passengerCount <= 1) {
    return null; // No additional passengers
  }

  return (
    <div className='vl-card'>
      {/* Header */}
      <div className='flex items-center gap-2 text-amber-400 font-medium mb-4'>
        <Users className='w-5 h-5' />
        Passenger Information ({passengerCount} passengers)
      </div>

      {/* Primary Passenger */}
      <div className='space-y-3'>
        <div className='flex items-center justify-between p-3 bg-white/5 rounded-lg'>
          <div>
            <div className='text-white font-medium'>Primary Passenger</div>
            <div className='text-sm text-neutral-400'>{primaryPassengerName}</div>
          </div>
          <div className='text-xs text-amber-400 font-medium'>Account Holder</div>
        </div>

        {/* Additional Passengers */}
        {passengerNames.map((name, index) => (
          <div key={index} className='flex items-center gap-3 p-3 bg-white/5 rounded-lg'>
            <div className='flex-1'>
              <label className='block text-sm text-neutral-400 mb-1'>Passenger {index + 2}</label>
              <div className='flex items-center gap-2'>
                <input
                  type='text'
                  value={name}
                  onChange={e => handleNameChange(index, e.target.value)}
                  placeholder='Enter passenger name (optional)'
                  className='flex-1 bg-transparent border border-white/20 rounded px-3 py-2 text-white placeholder:text-neutral-500 focus:border-amber-400 focus:outline-none'
                />
                <Edit3 className='w-4 h-4 text-neutral-500' />
              </div>
            </div>
          </div>
        ))}

        {/* Info Note */}
        <div className='text-xs text-neutral-400 text-center p-3 bg-blue-500/10 rounded-lg border border-blue-500/20'>
          💡 Passenger names can be provided later if needed. This helps our drivers provide
          personalized service.
        </div>
      </div>
    </div>
  );
}
