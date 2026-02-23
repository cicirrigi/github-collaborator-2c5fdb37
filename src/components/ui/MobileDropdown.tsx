import type { GooglePlaceResult } from '@/lib/google/google-services';
import React from 'react';
import { createPortal } from 'react-dom';

interface MobileDropdownProps {
  suggestions: GooglePlaceResult[];
  showDropdown: boolean;
  dropdownPosition: { top: number; left: number; width: number };
  onSuggestionSelect: (suggestion: GooglePlaceResult) => void;
  isSelectingRef: React.MutableRefObject<boolean>;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
}

export function MobileDropdown({
  suggestions,
  showDropdown,
  dropdownPosition,
  onSuggestionSelect,
  isSelectingRef,
  dropdownRef,
}: MobileDropdownProps) {
  if (!showDropdown || suggestions.length === 0 || typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <div
      ref={dropdownRef}
      className='fixed z-[20000] bg-neutral-900/95 backdrop-blur-sm border border-amber-200/20 rounded-lg shadow-xl max-h-60 overflow-y-auto'
      style={{
        top: `${dropdownPosition.top}px`,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100vw - 32px)',
        maxWidth: '400px',
        WebkitOverflowScrolling: 'touch',
        touchAction: 'pan-y',
      }}
    >
      {suggestions.map(suggestion => (
        <button
          key={suggestion.placeId}
          type='button'
          className='w-full px-4 py-3 text-left hover:bg-amber-200/10 focus:bg-amber-200/10 focus:outline-none transition-colors duration-200 border-b border-amber-200/10 last:border-b-0 flex items-start gap-3'
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            if (!isSelectingRef.current) {
              onSuggestionSelect(suggestion);
            }
          }}
        >
          <div className='flex-shrink-0 mt-1'>
            {suggestion.type === 'airport' ? (
              <div className='w-2 h-2 bg-blue-400 rounded-full' />
            ) : suggestion.type === 'hotel' ? (
              <div className='w-2 h-2 bg-green-400 rounded-full' />
            ) : (
              <div className='w-2 h-2 bg-amber-400 rounded-full' />
            )}
          </div>

          <div className='flex-1 min-w-0'>
            <div className='font-medium text-amber-50 text-sm break-words'>
              {suggestion.address}
            </div>
            {suggestion.components.country && (
              <div className='text-xs text-amber-200/60 mt-0.5'>
                {suggestion.components.country}
              </div>
            )}
          </div>

          <div className='flex-shrink-0 text-xs text-amber-200/40 capitalize mt-1'>
            {suggestion.type}
          </div>
        </button>
      ))}
    </div>,
    document.body
  );
}
