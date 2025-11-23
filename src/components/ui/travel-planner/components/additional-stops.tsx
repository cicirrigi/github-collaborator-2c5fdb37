import { GripVertical, Trash2 } from 'lucide-react';

import { LocationPicker } from '@/components/ui/location-picker';
import { type GooglePlace } from '@/components/ui/location-picker/types';
import { MOTION } from '@/components/ui/travel-planner/constants';
import { type AdditionalStopsProps, type Stop } from '@/components/ui/travel-planner/types';
import { cn } from '@/lib/utils';

import { StopsCounter } from './stops-counter';

export const AdditionalStops = ({
  stops,
  maxStops = 5,
  bookingType: _bookingType,
  onStopsChange,
  showMapPreview: _showMapPreview = false,
  className,
}: AdditionalStopsProps) => {
  // Handle stops count change
  const handleStopsCountChange = (count: number) => {
    const newStops = [...stops];

    if (count > stops.length) {
      // Add new stops
      for (let i = stops.length; i < count; i++) {
        newStops.push({
          id: `stop-${Date.now()}-${i}`,
          address: '',
          coordinates: null,
        });
      }
    } else if (count < stops.length) {
      // Remove stops
      newStops.splice(count);
    }

    onStopsChange(newStops);
  };

  // Handle individual stop update
  const handleStopUpdate = (index: number, place: GooglePlace | null) => {
    const newStops = [...stops];
    if (place) {
      newStops[index] = {
        id: newStops[index]?.id || `stop-${index}-${Date.now()}`,
        address: place.address,
        place: place,
        coordinates: place.coordinates,
      };
    } else {
      // Clear the stop
      newStops[index] = {
        id: newStops[index]?.id || `stop-${index}-${Date.now()}`,
        address: '',
        place: null,
        coordinates: null,
      };
    }
    onStopsChange(newStops);
  };

  // Remove specific stop
  const handleRemoveStop = (index: number) => {
    const newStops = stops.filter((_, i) => i !== index);
    onStopsChange(newStops);
  };

  // Render individual stop
  const renderStop = (stop: Stop, index: number) => (
    <div
      key={stop.id}
      className={cn(
        'flex items-center gap-3 rounded-lg border border-gray-200 p-4 dark:border-gray-700',
        'bg-white dark:bg-gray-800/50',
        MOTION.transition
      )}
    >
      {/* Drag Handle */}
      <div className='flex-shrink-0'>
        <GripVertical className='h-4 w-4 cursor-grab text-gray-400' />
      </div>

      {/* Stop Number */}
      <div className='flex-shrink-0'>
        <div className='flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-accent)] text-xs font-medium text-white'>
          {index + 1}
        </div>
      </div>

      {/* Location Picker */}
      <div className='flex-1'>
        <LocationPicker
          variant='stop'
          placeholder={`Stop ${index + 1} address`}
          value={stop.place || null}
          onChange={place => handleStopUpdate(index, place)}
          size='sm'
        />
      </div>

      {/* Remove Button */}
      <button
        onClick={() => handleRemoveStop(index)}
        className={cn(
          'flex-shrink-0 rounded-full p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20',
          MOTION.transition,
          MOTION.tap
        )}
        aria-label={`Remove stop ${index + 1}`}
      >
        <Trash2 className='h-4 w-4' />
      </button>
    </div>
  );

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className='mb-4 flex items-center gap-3'>
        <div className='h-5 w-5 rounded-full bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-accent)]' />
        <h4 className='font-semibold text-gray-700 dark:text-gray-300'>Additional Stops</h4>
        <span className='ml-auto text-xs text-gray-500'>Max {maxStops}</span>
      </div>

      {/* Stops Counter */}
      <StopsCounter value={stops.length} max={maxStops} onChange={handleStopsCountChange} />

      {/* Stops List */}
      {stops.length > 0 && (
        <div className='space-y-3'>
          <div className='flex items-center justify-between'>
            <h6 className='text-sm font-medium text-gray-600 dark:text-gray-400'>
              Configure Stops:
            </h6>
            <span className='text-xs text-gray-500'>
              {stops.filter(s => s.address).length} of {stops.length} configured
            </span>
          </div>

          <div className='max-h-64 space-y-3 overflow-y-auto'>
            {stops.map((stop, index) => renderStop(stop, index))}
          </div>
        </div>
      )}

      {/* Helper Tips */}
      {stops.length === 0 && (
        <div className='py-8 text-center text-sm text-gray-500'>
          <div className='space-y-2'>
            <p>No additional stops added</p>
            <p className='text-xs opacity-75'>Use the counter above to add stops to your journey</p>
          </div>
        </div>
      )}
    </div>
  );
};
