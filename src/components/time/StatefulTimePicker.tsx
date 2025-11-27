/**
 * 🕒 VANTAGE LANE — StatefulTimePicker
 * Desktop popover + Mobile fullscreen modal controller.
 * Zero styling — only logic + structure.
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import type { TimePickerProps, TimeValue } from './core/time-types';
import { MobileTimePickerModal } from './mobile/MobileTimePickerModal';
import { TimePicker } from './TimePicker';

export function StatefulTimePicker({
  value,
  onChange,
  timezone,
  interval,
  minTime,
  maxTime,
  leadMinutes,
  className = '',
}: TimePickerProps) {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  /* -----------------------------------------------------
     Detect mobile vs desktop
     ----------------------------------------------------- */
  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth < 768);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  /* -----------------------------------------------------
     Handle outside click to close popover (desktop only)
     ----------------------------------------------------- */
  useEffect(() => {
    if (isMobile) return; // modal handles itself on mobile
    if (!open) return;

    const handler = (e: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, isMobile]);

  /* -----------------------------------------------------
     Handlers
     ----------------------------------------------------- */
  const handleInputClick = () => {
    setOpen(true);
  };

  const handleChange = (t: TimeValue | null) => {
    onChange(t);
    if (!isMobile) {
      setOpen(false); // desktop: close after select
    }
  };

  /* -----------------------------------------------------
     UI Rendering
     ----------------------------------------------------- */
  return (
    <div ref={containerRef} className={`relative ${className}`} data-stateful-timepicker='true'>
      {/* Input field trigger */}
      <button
        type='button'
        onClick={handleInputClick}
        className='w-full p-3 text-left bg-white/5 border border-amber-200/20 rounded-lg hover:bg-white/10 transition-colors text-amber-100'
        data-timepicker-trigger='true'
      >
        {value
          ? `${String(value.hours).padStart(2, '0')}:${String(value.minutes).padStart(2, '0')}`
          : 'Select time'}
      </button>

      {/* Desktop popover */}
      {!isMobile && open && (
        <div
          className='absolute left-0 top-full mt-2 z-50 w-64 bg-black/95 backdrop-blur-lg border border-amber-200/20 rounded-lg shadow-xl'
          data-timepicker-popover='true'
        >
          <TimePicker
            value={value}
            onChange={handleChange}
            timezone={timezone}
            interval={interval}
            minTime={minTime}
            maxTime={maxTime}
            leadMinutes={leadMinutes}
          />
        </div>
      )}

      {/* Mobile modal */}
      {isMobile && (
        <MobileTimePickerModal
          open={open}
          onClose={() => setOpen(false)}
          onConfirm={handleChange}
          value={value}
          onChange={onChange}
          timezone={timezone}
          interval={interval}
          minTime={minTime}
          maxTime={maxTime}
          leadMinutes={leadMinutes}
        />
      )}
    </div>
  );
}
