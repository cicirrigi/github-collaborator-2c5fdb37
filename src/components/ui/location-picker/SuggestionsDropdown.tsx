import { MapPin, Plane } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { GooglePlace } from './types';

interface SuggestionsDropdownProps {
  suggestions: GooglePlace[];
  isLoading: boolean;
  isOpen: boolean;
  onSelect: (suggestion: GooglePlace) => void;
}

export const SuggestionsDropdown = ({
  suggestions,
  isLoading,
  isOpen,
  onSelect,
}: SuggestionsDropdownProps) => {
  if (!isOpen) return null;

  return (
    <div className='absolute left-0 right-0 z-50 mt-1 max-h-64 overflow-y-auto rounded-lg border bg-background/95 backdrop-blur-sm shadow-xl'>
      {isLoading ? (
        <div className='p-4 text-center text-neutral-500'>
          <div className='animate-spin rounded-full h-5 w-5 border-2 border-brand-primary/20 border-t-brand-primary mx-auto mb-2' />
          Searching locations...
        </div>
      ) : suggestions.length > 0 ? (
        suggestions.map(suggestion => (
          <button
            key={suggestion.placeId}
            type='button'
            className='w-full px-4 py-3 text-left transition-colors duration-200 hover:bg-brand-primary/10 focus:bg-brand-primary/10 focus:outline-none border-b border-border last:border-b-0 flex items-start gap-3'
            onClick={() => onSelect(suggestion)}
          >
            <div className='flex-shrink-0 mt-1'>
              {suggestion.type === 'airport' ? (
                <Plane className='h-4 w-4 text-brand-primary' />
              ) : (
                <MapPin className='h-4 w-4 text-neutral-400' />
              )}
            </div>
            <div className='flex-1 min-w-0'>
              <div className='font-medium text-foreground truncate'>{suggestion.address}</div>
              {suggestion.components.city && (
                <div className='text-sm text-neutral-500 mt-0.5'>
                  {suggestion.components.city}
                  {suggestion.components.country && `, ${suggestion.components.country}`}
                </div>
              )}
            </div>
            <div className='flex-shrink-0 text-xs text-neutral-400 capitalize mt-1'>
              {suggestion.type}
            </div>
          </button>
        ))
      ) : (
        <div className='p-4 text-center text-neutral-500'>
          No locations found. Try a different search term.
        </div>
      )}
    </div>
  );
};
