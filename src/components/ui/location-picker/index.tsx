'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import type { LocationPickerProps, GooglePlace } from './types';
import {
  LOCATION_VARIANTS,
  SIZE_CLASSES,
  THEME_CLASSES,
  VALIDATION,
  SPACING_CONFIG,
  BACKGROUND_CONFIG,
} from './constants';
import { designTokens } from '@/design-system/tokens/colors';
import { SuggestionsDropdown } from './SuggestionsDropdown';

// Re-export types pentru convenience
export type { LocationPickerProps, GooglePlace, LocationVariant } from './types';

export const LocationPicker = ({
  value,
  onChange,
  variant = 'pickup',
  size = 'md',
  disabled = false,
  required = false,
  className,
  placeholder,
  icon,
  error,
  onValidate,
}: LocationPickerProps) => {
  const [inputValue, setInputValue] = useState(value?.address || '');
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<GooglePlace[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedValueRef = useRef<string | null>(null);

  // Get variant config
  const variantConfig = LOCATION_VARIANTS[variant];
  const displayIcon = icon || <variantConfig.icon className={SIZE_CLASSES.icon[size]} />;
  const displayPlaceholder = placeholder || variantConfig.placeholder;

  // Input validation
  const validateInput = (input: string): string | null => {
    if (required && !input.trim()) {
      return VALIDATION.messages.required;
    }
    if (input.length > 0 && input.length < VALIDATION.minLength) {
      return VALIDATION.messages.tooShort;
    }
    if (input.length > VALIDATION.maxLength) {
      return VALIDATION.messages.tooLong;
    }
    return null;
  };

  // Handle input change with debounced search
  useEffect(() => {
    if (isSelecting) return; // 🔥 STOP dacă tocmai a fost selectat ceva
    if (inputValue === selectedValueRef.current) return; // 🔥 nu mai face nimic
    if (!inputValue || inputValue.length < VALIDATION.minLength) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsLoading(true);

      // TODO: Replace with Google Places API
      /* 
      const service = new google.maps.places.AutocompleteService();
      service.getPlacePredictions({ input: inputValue }, (predictions) => {
        if (!predictions) return;
        setSuggestions(predictions.map((p) => ({
          placeId: p.place_id,
          address: p.description,
          coordinates: [0, 0], // complete later with PlaceDetailsService
          type: 'address',
          components: {},
        })));
        setIsOpen(true);
        setIsLoading(false);
      });
      */

      // For now, mock suggestions
      const mockSuggestions: GooglePlace[] = [
        {
          placeId: '1',
          address: `${inputValue} - Heathrow Airport`,
          coordinates: [51.47, -0.4543],
          type: 'airport',
          components: { country: 'UK', city: 'London' },
        },
        {
          placeId: '2',
          address: `${inputValue} - Central London`,
          coordinates: [51.5074, -0.1278],
          type: 'address',
          components: { country: 'UK', city: 'London' },
        },
      ];

      setSuggestions(mockSuggestions);
      setIsOpen(true);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [inputValue, isSelecting]);

  // Click outside to close dropdown (enterprise UX)
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setIsOpen(false);
        setSuggestions([]);
      }
    };

    document.addEventListener('pointerdown', handleClickOutside);
    return () => document.removeEventListener('pointerdown', handleClickOutside);
  }, []);

  // Handle suggestion selection
  const handleSelectSuggestion = (suggestion: GooglePlace) => {
    setIsSelecting(true);
    setIsOpen(false);
    setSuggestions([]);
    onChange?.(suggestion);
    setInputValue(suggestion.address);
    selectedValueRef.current = suggestion.address; // 🔥 memorizează ultima selecție

    // Important: blur-ul trebuie să vină DUPĂ setIsOpen și inputValue
    setTimeout(() => {
      inputRef.current?.blur();
      setIsSelecting(false);
    }, 300);
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    if (!newValue.trim()) {
      selectedValueRef.current = null; // 🔥 reset
      setIsOpen(false);
      setSuggestions([]);
      onChange?.(null);
    }
  };

  // Validation error (doar dacă a interacționat user-ul)
  const validationError = hasInteracted ? validateInput(inputValue) : null;
  const displayError = error || validationError;

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {/* Input container */}
      <div className='relative group'>
        {/* Icon */}
        <div
          className={cn(
            'absolute top-1/2 -translate-y-1/2 transition-colors z-10',
            'text-gray-600 dark:text-gray-400',
            'group-hover:text-yellow-600 dark:group-hover:text-yellow-400',
            !disabled && isOpen && 'text-gray-800 dark:text-gray-200'
          )}
          style={{
            left: SPACING_CONFIG.iconLeft[size],
          }}
        >
          {displayIcon}
        </div>

        {/* Input field */}
        <input
          ref={inputRef}
          type='text'
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => {
            if (isSelecting) return; // 🔥 Previi redeschiderea după selecție
            setHasInteracted(true);
            if (inputValue.length >= VALIDATION.minLength) setIsOpen(true);
          }}
          onBlur={() => {
            setTimeout(() => {
              if (!isSelecting) {
                setIsOpen(false);
                setSuggestions([]);
              }
            }, 150);
          }}
          placeholder={displayPlaceholder}
          disabled={disabled}
          className={cn(
            THEME_CLASSES.input.base,
            SIZE_CLASSES.container[size],
            SPACING_CONFIG.inputPaddingLeft[size],
            'bg-white/20 dark:bg-black/20',
            'text-gray-600 dark:text-gray-400',
            'hover:bg-yellow-50/30 dark:hover:bg-yellow-900/20',
            'hover:border-yellow-300/50',
            'focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500',
            displayError && 'bg-red-50/20 dark:bg-red-900/20',
            disabled && 'bg-gray-100/20 text-gray-400 cursor-not-allowed dark:bg-gray-800/20'
          )}
        />

        {/* Loading indicator */}
        {isLoading && (
          <div className='absolute right-3 top-1/2 -translate-y-1/2'>
            <div className='w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin' />
          </div>
        )}
      </div>

      {/* Suggestions dropdown */}
      <SuggestionsDropdown
        suggestions={suggestions}
        isLoading={isLoading}
        isOpen={isOpen}
        onSelect={handleSelectSuggestion}
      />

      {/* Error message */}
      {displayError && (
        <p className='mt-1 text-sm text-red-600 dark:text-red-400'>{displayError}</p>
      )}
    </div>
  );
};
