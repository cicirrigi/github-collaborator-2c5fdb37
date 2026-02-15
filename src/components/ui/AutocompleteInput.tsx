/**
 * Autocomplete Input Component
 *
 * Enhanced input with Google Places autocomplete
 * Preserves existing styling and functionality
 */

'use client';

import type { GooglePlaceResult } from '@/lib/google/google-services';
import { googleServices } from '@/lib/google/google-services';
import { Loader2 } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface AutocompleteInputProps {
  value: string;
  onChange: (value: string) => void;
  onPlaceSelect?: (place: GooglePlaceResult) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function AutocompleteInput({
  value,
  onChange,
  onPlaceSelect,
  placeholder = 'Enter address...',
  icon,
  className = '',
}: AutocompleteInputProps) {
  const [suggestions, setSuggestions] = useState<GooglePlaceResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const [isSelecting, setIsSelecting] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounced autocomplete search
  useEffect(() => {
    // Skip API calls if we're in the middle of selecting a suggestion
    if (isSelecting) {
      return;
    }

    // Cancel previous request
    if (abortController) {
      abortController.abort();
    }

    // Don't search for empty strings or very short queries
    if (!value || value.length < 3) {
      setSuggestions([]);
      setShowDropdown(false);
      setIsLoading(false);
      return;
    }

    const newAbortController = new AbortController();
    setAbortController(newAbortController);

    // Debounce the search with longer delay to reduce API calls
    const timeoutId = setTimeout(async () => {
      setIsLoading(true);

      try {
        const results = await googleServices.getPlaceSuggestions(value, newAbortController.signal);

        if (!newAbortController.signal.aborted) {
          setSuggestions(results);
          if (results.length > 0) {
            updateDropdownPosition();
            setShowDropdown(true);
          } else {
            setShowDropdown(false);
          }
          setIsLoading(false);
        }
      } catch (error) {
        if (!newAbortController.signal.aborted) {
          setSuggestions([]);
          setShowDropdown(false);
          setIsLoading(false);
        }
      }
    }, 500); // Increased to 500ms debounce for better performance

    // Cleanup
    return () => {
      clearTimeout(timeoutId);
      newAbortController.abort();
    };
  }, [value]); // Simple dependency on value only

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: GooglePlaceResult) => {
    // Set flag to prevent useEffect from running during selection
    setIsSelecting(true);

    // First hide dropdown and clear suggestions to prevent re-triggering
    setShowDropdown(false);
    setSuggestions([]);

    // Then update the input value
    onChange(suggestion.address);
    onPlaceSelect?.(suggestion);
    inputRef.current?.blur();

    // Reset flag after a brief delay to allow typing again
    setTimeout(() => setIsSelecting(false), 100);
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  // Calculate dropdown position relative to input
  const updateDropdownPosition = () => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      const position = {
        top: rect.bottom + 4, // +4 for small gap (no scrollY for fixed positioning)
        left: rect.left, // no scrollX for fixed positioning
        width: rect.width,
      };
      setDropdownPosition(position);
    }
  };

  // Handle input focus
  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      updateDropdownPosition();
      setShowDropdown(true);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className='relative'>
        {icon && <div className='absolute left-3 top-1/2 -translate-y-1/2 z-10'>{icon}</div>}
        <input
          ref={inputRef}
          type='text'
          value={value}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          className={`w-full bg-transparent border border-amber-200/20 rounded-md px-3 py-2 ${
            icon ? 'pl-10' : 'pl-3'
          } text-amber-50 text-sm font-light placeholder:text-amber-200/40 focus:border-amber-300/40 focus:outline-none transition-colors`}
        />

        {/* Loading indicator */}
        {isLoading && (
          <div className='absolute right-3 top-1/2 -translate-y-1/2'>
            <Loader2 className='w-4 h-4 animate-spin text-amber-200/60' />
          </div>
        )}
      </div>

      {/* Portal-based suggestions dropdown - renders in document.body to escape stacking context */}
      {showDropdown &&
        suggestions.length > 0 &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={dropdownRef}
            className='fixed z-[20000] bg-neutral-900/95 backdrop-blur-sm border border-amber-200/20 rounded-lg shadow-xl max-h-60 overflow-y-auto'
            style={{
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              width: `${dropdownPosition.width}px`,
            }}
          >
            {suggestions.map((suggestion, _index) => (
              <button
                key={suggestion.placeId}
                type='button'
                className='w-full px-4 py-3 text-left hover:bg-amber-200/10 focus:bg-amber-200/10 focus:outline-none transition-colors duration-200 border-b border-amber-200/10 last:border-b-0 flex items-start gap-3'
                onClick={() => handleSuggestionSelect(suggestion)}
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
                  <div className='font-medium text-amber-50 text-sm truncate'>
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
        )}
    </div>
  );
}
