import React from 'react';
import { Trash2, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AdditionalStopsProps, Stop } from '../types';
import { TRAVEL_THEME, MOTION } from '../constants';
import { LocationPicker } from '../../location-picker';
import { StopsCounter } from './stops-counter';

export const AdditionalStops = ({
  stops,
  maxStops = 5,
  bookingType,
  onStopsChange,
  showMapPreview = false,
  className
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
          coordinates: undefined
        });
      }
    } else if (count < stops.length) {
      // Remove stops
      newStops.splice(count);
    }
    
    onStopsChange(newStops);
  };

  // Handle individual stop update
  const handleStopUpdate = (index: number, place: any) => {
    const newStops = [...stops];
    if (place) {
      newStops[index] = {
        ...newStops[index],
        address: place.address,
        place: place,
        coordinates: place.coordinates
      };
    } else {
      // Clear the stop
      newStops[index] = {
        ...newStops[index],
        address: '',
        place: undefined,
        coordinates: undefined
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
        'flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700',
        'bg-white dark:bg-gray-800/50',
        MOTION.transition
      )}
    >
      {/* Drag Handle */}
      <div className="flex-shrink-0">
        <GripVertical className="w-4 h-4 text-gray-400 cursor-grab" />
      </div>

      {/* Stop Number */}
      <div className="flex-shrink-0">
        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#CBB26A] to-[#D4AF37] text-white text-xs font-medium flex items-center justify-center">
          {index + 1}
        </div>
      </div>

      {/* Location Picker */}
      <div className="flex-1">
        <LocationPicker
          variant="stop"
          placeholder={`Stop ${index + 1} address`}
          value={stop.place || null}
          onChange={(place) => handleStopUpdate(index, place)}
          size="sm"
        />
      </div>

      {/* Remove Button */}
      <button
        onClick={() => handleRemoveStop(index)}
        className={cn(
          'flex-shrink-0 p-2 rounded-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20',
          MOTION.transition,
          MOTION.tap
        )}
        aria-label={`Remove stop ${index + 1}`}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );

  return (
    <div className={cn(
      TRAVEL_THEME.sections.stops,
      MOTION.transition,
      className
    )}>
      {/* Stops Counter */}
      <StopsCounter
        value={stops.length}
        max={maxStops}
        onChange={handleStopsCountChange}
        className="mb-6"
      />

      {/* Stops List */}
      {stops.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h6 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Configure Stops
            </h6>
            <span className="text-xs text-gray-500">
              {stops.filter(s => s.address).length} of {stops.length} configured
            </span>
          </div>
          
          <div className="space-y-3">
            {stops.map((stop, index) => renderStop(stop, index))}
          </div>
        </div>
      )}

      {/* Map Preview Placeholder */}
      {showMapPreview && stops.length > 0 && (
        <div className={cn(
          TRAVEL_THEME.sections.mapPreview,
          'mt-6',
          MOTION.fadeIn
        )}>
          <div className="flex items-center justify-center h-32 text-gray-500 text-sm">
            <div className="text-center">
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg mx-auto mb-2" />
              Map preview will show here
              <div className="text-xs mt-1">
                Google Maps integration coming soon
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Helper Tips */}
      {stops.length === 0 && (
        <div className="text-center py-6 text-gray-500 text-sm">
          <div className="space-y-2">
            <p>No additional stops added</p>
            <p className="text-xs">
              Use the counter above to add stops to your journey
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
