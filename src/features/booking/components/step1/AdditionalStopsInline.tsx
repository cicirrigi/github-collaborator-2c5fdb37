'use client';

import { AutocompleteInput } from '@/components/ui/AutocompleteInput';
import { GlassmorphismCard } from '@/components/ui/GlassmorphismCard';
import { useBookingState } from '@/hooks/useBookingState';
import { LocationData } from '@/hooks/useBookingState/booking.types';
import type { GooglePlaceResult } from '@/lib/google/google-services';
import { MapPin, Plus, Route, X } from 'lucide-react';

export function AdditionalStopsInline() {
  const { bookingType, tripConfiguration, setAdditionalStops } = useBookingState();
  const { additionalStops } = tripConfiguration;

  // Only show for oneway bookings
  if (bookingType !== 'oneway') {
    return null;
  }

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

  const handleStopPlaceSelect = (index: number, place: GooglePlaceResult) => {
    const updatedStops = additionalStops.map((stop, i) =>
      i === index
        ? {
            placeId: place.placeId,
            address: place.address,
            coordinates: place.coordinates,
            type: place.type,
            components: place.components,
          }
        : stop
    );
    setAdditionalStops(updatedStops);
  };

  return (
    <GlassmorphismCard className='p-4'>
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center gap-2'>
          <Route className='w-4 h-4 text-amber-200/60' />
          <span className='text-white text-sm font-light tracking-wider'>Additional Stops</span>
        </div>
        <span className='text-amber-200/60 text-xs'>Optional</span>
      </div>

      {/* Existing Stops */}
      {additionalStops.length > 0 && (
        <div className='space-y-2 mb-3'>
          {additionalStops.map((stop, index) => (
            <div key={index} className='bg-black/20 rounded p-2 border border-amber-200/5'>
              <div className='flex items-center gap-1.5 mb-1.5'>
                <div className='w-3 h-3 bg-gradient-to-br from-amber-400/20 to-amber-500/30 rounded-full border border-amber-400/40 flex items-center justify-center'>
                  <div className='w-1 h-1 bg-amber-400 rounded-full'></div>
                </div>
                <span className='text-amber-100/80 text-xs font-light'>Stop {index + 1}</span>
                <button
                  onClick={() => handleRemoveStop(index)}
                  className='ml-auto p-0.5 text-amber-200/50 hover:text-red-400 transition-colors'
                  type='button'
                >
                  <X className='w-3 h-3' />
                </button>
              </div>
              <AutocompleteInput
                value={stop.address}
                onChange={address => handleStopChange(index, address)}
                onPlaceSelect={place => handleStopPlaceSelect(index, place)}
                placeholder='Enter stop address...'
                icon={<MapPin className='w-3 h-3 text-amber-200/60' />}
                className='text-xs'
              />
            </div>
          ))}
        </div>
      )}

      {/* Add Stop Button */}
      <button
        onClick={handleAddStop}
        type='button'
        className='w-full flex items-center justify-center gap-2 p-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 hover:border-amber-500/40 rounded-lg transition-all text-amber-200/80 hover:text-amber-100 text-sm'
      >
        <Plus className='w-4 h-4' />
        Add Stop
      </button>
    </GlassmorphismCard>
  );
}
