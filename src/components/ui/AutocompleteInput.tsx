/**
 * Autocomplete Input Component
 *
 * Enhanced input with Google Places autocomplete
 * Preserves existing styling and functionality
 */

'use client';

import type { GooglePlaceResult } from '@/lib/google/google-services';
import { googleServices } from '@/lib/google/google-services';
import { Loader2, X } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DesktopDropdown } from './DesktopDropdown';
import { MobileDropdown } from './MobileDropdown';

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
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const [isMobile, setIsMobile] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const abortRef = useRef<AbortController | null>(null);
  const rafRef = useRef<number | null>(null);
  const debounceRef = useRef<number | null>(null);
  const isSelectingRef = useRef(false);
  const isFocusedRef = useRef(false);

  const canSearch = useMemo(() => value.trim().length >= 3, [value]);

  // SSR-safe mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const updateDropdownPosition = useCallback(() => {
    if (!inputRef.current) return;

    const rect = inputRef.current.getBoundingClientRect();
    const isDesktop = window.innerWidth >= 768;

    if (isDesktop) {
      // Desktop: Fixed positioning with portal
      setDropdownPosition({
        top: rect.bottom + 4,
        left: rect.left,
        width: Math.max(rect.width, 400),
      });
    } else {
      // Mobile: Will use absolute positioning, no complex calculations needed
      setDropdownPosition({
        top: rect.bottom + 4,
        left: rect.left,
        width: Math.max(rect.width, 320),
      });
    }
  }, []);

  const schedulePositionUpdate = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      updateDropdownPosition();
    });
  }, [updateDropdownPosition]);

  // Debounced autocomplete fetch
  useEffect(() => {
    // Skip API calls if we're in selection process
    if (isSelectingRef.current) return;

    // clear pending debounce
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }

    // abort in-flight request
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }

    if (!canSearch) {
      setIsLoading(false);
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    debounceRef.current = window.setTimeout(async () => {
      const controller = new AbortController();
      abortRef.current = controller;

      setIsLoading(true);

      try {
        const results = await googleServices.getPlaceSuggestions(value, controller.signal);
        if (controller.signal.aborted) return;

        setSuggestions(results);

        if (results.length > 0 && isFocusedRef.current) {
          schedulePositionUpdate();
          setShowDropdown(true);
        } else {
          setShowDropdown(false);
        }
      } catch {
        if (!controller.signal.aborted) {
          setSuggestions([]);
          setShowDropdown(false);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }, 500);

    return () => {
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
      if (abortRef.current) {
        abortRef.current.abort();
        abortRef.current = null;
      }
    };
  }, [value, canSearch, schedulePositionUpdate]);

  // Close on click/touch outside
  useEffect(() => {
    const handler = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (!target) return;

      const inInput = inputRef.current?.contains(target);
      const inDropdown = dropdownRef.current?.contains(target);

      if (!inInput && !inDropdown) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler, { passive: true });

    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, []);

  // Keep dropdown pinned on scroll/resize (including modal scroll containers)
  useEffect(() => {
    if (!showDropdown) return;

    const onMove = () => schedulePositionUpdate();

    window.addEventListener('scroll', onMove, true);
    window.addEventListener('resize', onMove);

    const vv = window.visualViewport;
    vv?.addEventListener('scroll', onMove);
    vv?.addEventListener('resize', onMove);

    // initial
    onMove();

    return () => {
      window.removeEventListener('scroll', onMove, true);
      window.removeEventListener('resize', onMove);
      vv?.removeEventListener('scroll', onMove);
      vv?.removeEventListener('resize', onMove);

      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [showDropdown, schedulePositionUpdate]);

  const handleSuggestionSelect = useCallback(
    (suggestion: GooglePlaceResult) => {
      // Mark that we're selecting to prevent double-open
      isSelectingRef.current = true;

      // close first to avoid weird re-open behavior
      setShowDropdown(false);
      setSuggestions([]);

      onChange(suggestion.address);
      onPlaceSelect?.(suggestion);

      requestAnimationFrame(() => {
        const el = inputRef.current;
        if (!el) return;
        el.focus();
        el.setSelectionRange(0, 0); // cursor la început

        // Clear flag after focus is complete
        setTimeout(() => {
          isSelectingRef.current = false;
        }, 50);
      });
    },
    [onChange, onPlaceSelect]
  );

  const handleClearInput = useCallback(() => {
    onChange('');
    setShowDropdown(false);
    setSuggestions([]);
    inputRef.current?.focus();
  }, [onChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    onChange(next);

    // Skip dropdown opening if we're in selection process
    if (isSelectingRef.current) return;

    // Keep dropdown behavior natural while typing
    if (next.trim().length >= 3) {
      setShowDropdown(true);
      schedulePositionUpdate();
    } else {
      setShowDropdown(false);
    }
  };

  const handleInputFocus = () => {
    isFocusedRef.current = true;
    // Skip if we're in the middle of programmatic selection focus
    if (isSelectingRef.current) return;

    // Re-open dropdown if value is long enough
    if (value.trim().length >= 3) {
      schedulePositionUpdate();
      // Let the fetch effect handle opening the dropdown
    }
  };

  const handleInputBlur = () => {
    isFocusedRef.current = false;
    setShowDropdown(false);
    setSuggestions([]);
  };

  return (
    <div className={`relative ${className}`}>
      <div className='flex items-center gap-2'>
        <div className='relative flex-1'>
          {icon && <div className='absolute left-3 top-1/2 -translate-y-1/2 z-10'>{icon}</div>}
          <input
            ref={inputRef}
            type='text'
            value={value}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            placeholder={placeholder}
            className={`w-full bg-transparent border border-amber-200/20 rounded-md px-3 py-3 ${
              icon ? 'pl-10' : 'pl-3'
            } text-amber-50 text-base md:text-sm font-light placeholder:text-amber-200/40 focus:border-amber-300/40 focus:outline-none transition-colors`}
          />

          {isLoading && (
            <div className='absolute right-3 top-1/2 -translate-y-1/2'>
              <Loader2 className='w-4 h-4 animate-spin text-amber-200/60' />
            </div>
          )}
        </div>

        {/* Clear Button - adjacent to input */}
        {value && (
          <button
            type='button'
            onClick={handleClearInput}
            className='p-2 hover:bg-amber-200/10 rounded-md transition-colors'
            aria-label='Clear input'
          >
            <X className='w-4 h-4 text-amber-200/60 hover:text-amber-200' />
          </button>
        )}
      </div>

      {/* Mobile Dropdown */}
      {isMobile && (
        <MobileDropdown
          suggestions={suggestions}
          showDropdown={showDropdown}
          dropdownPosition={dropdownPosition}
          onSuggestionSelect={handleSuggestionSelect}
          isSelectingRef={isSelectingRef}
          dropdownRef={dropdownRef}
        />
      )}

      {/* Desktop Dropdown */}
      {!isMobile && (
        <DesktopDropdown
          suggestions={suggestions}
          showDropdown={showDropdown}
          dropdownPosition={dropdownPosition}
          onSuggestionSelect={handleSuggestionSelect}
          isSelectingRef={isSelectingRef}
          dropdownRef={dropdownRef}
        />
      )}
    </div>
  );
}
