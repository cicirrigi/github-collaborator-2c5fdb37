'use client';

import { useBookingState } from '@/hooks/useBookingState';
import { LocationData } from '@/hooks/useBookingState/booking.types';
import { Plus, Route, X } from 'lucide-react';
import { CardHeader } from './CardHeader';

export function CardAdditionalStops() {
  const { tripConfiguration, setAdditionalStops } = useBookingState();
  const { additionalStops } = tripConfiguration;

  const handleAddStop = () => {
    const newStop: LocationData = {
      placeId: '',
      address: '',
      coordinates: [0, 0],
      type: 'address',
      components: {},
    };
    setAdditionalStops([...additionalStops, newStop]);
  };

  const handleRemoveStop = (index: number) => {
    const updatedStops = additionalStops.filter((_, i) => i !== index);
    setAdditionalStops(updatedStops);
  };

  const handleStopChange = (index: number, address: string) => {
    const updatedStops = additionalStops.map((stop, i) =>
      i === index ? { ...stop, address } : stop
    );
    setAdditionalStops(updatedStops);
  };

  return (
    <div className='vl-card-flex' style={{ height: 'auto' }}>
      <CardHeader
        icon={Route}
        title='Additional Stops'
        subtitle='Optional stops along your route'
      />
      <div className='vl-card-inner space-y-2'>
        {/* Existing Stops - Ultra Compact */}
        {additionalStops.map((stop, index) => (
          <div key={index} className='bg-white/3 rounded p-2 border border-amber-200/10'>
            <div className='flex items-center gap-1.5 mb-1.5'>
              <div className='w-3 h-3 bg-gradient-to-br from-amber-400/20 to-amber-500/30 rounded-full border border-amber-400/40 flex items-center justify-center'>
                <div className='w-1 h-1 bg-amber-400 rounded-full'></div>
              </div>
              <span className='text-amber-100/80 text-xs font-light'>Stop {index + 1}</span>
              <button
                onClick={() => handleRemoveStop(index)}
                className='ml-auto w-4 h-4 rounded-full border border-amber-200/20 text-amber-200/70 hover:text-amber-200 transition-colors flex items-center justify-center'
              >
                <X className='w-2.5 h-2.5' />
              </button>
            </div>
            <input
              type='text'
              placeholder='Location...'
              value={stop.address}
              onChange={e => handleStopChange(index, e.target.value)}
              className='w-full bg-transparent border border-amber-200/20 rounded-md px-3 py-2 text-amber-50 text-sm font-light placeholder:text-amber-200/40 focus:border-amber-300/40 focus:outline-none transition-colors'
            />
          </div>
        ))}

        {/* Add Stop Button - Mini */}
        {additionalStops.length < 3 && (
          <button
            onClick={handleAddStop}
            className='w-full bg-white/3 border border-amber-200/20 hover:border-amber-200/40 rounded p-2 flex items-center justify-center gap-1.5 transition-all duration-200 hover:bg-white/5'
          >
            <div className='w-4 h-4 rounded-full border border-amber-200/30 flex items-center justify-center text-amber-200/70'>
              <Plus className='w-2.5 h-2.5' />
            </div>
            <span className='text-amber-100/80 text-xs font-light'>Add Stop</span>
          </button>
        )}

        {/* Info - Mini */}
        {additionalStops.length === 0 && (
          <div className='bg-white/3 rounded p-2 border border-amber-200/10 text-center'>
            <div className='text-amber-100/60 text-xs font-light'>Add route stops</div>
            <div className='text-amber-200/50 text-xs font-light'>£15 each</div>
          </div>
        )}
      </div>
    </div>
  );
}
