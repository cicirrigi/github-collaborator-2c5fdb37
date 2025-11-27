/**
 * 🕒 VANTAGE LANE — StatefulTimePicker (FINAL ENTERPRISE VERSION)
 */

'use client';

import { useEffect, useState } from 'react';
import {
  extractTime,
  LEAD_TIME_MINUTES,
  minimumBookableMoment,
  roundTo15,
} from '../../utils/timezone-uk';

import type { TimeValue } from './core/useTimeEngine';

import { DesktopTimePickerModal } from './desktop/DesktopTimePickerModal';
import { MobileTimePickerModal } from './mobile/MobileTimePickerModal';

interface StatefulTimePickerProps {
  /** Selected date from Calendar */
  date: Date;

  /** Selected time (HH:mm) */
  value: TimeValue | null;

  /** Callback when user selects a time */
  onChange: (t: TimeValue | null) => void;

  /** Interval, min/max, lead */
  interval?: number;
  minTime?: TimeValue;
  maxTime?: TimeValue;
  leadMinutes?: number;

  className?: string;
}

export function StatefulTimePicker({
  date,
  value,
  onChange,
  interval = 15,
  minTime,
  maxTime,
  leadMinutes = LEAD_TIME_MINUTES,
  className = '',
}: StatefulTimePickerProps) {
  /* -------------------------------------------------------
     1. MOBILE DETECTION (SSR SAFE)
  --------------------------------------------------------- */
  const [isMobile, setIsMobile] = useState(false);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const check = () => setIsMobile(window.innerWidth < 768);
    check();

    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  /* -------------------------------------------------------
     2. PRESELECT DEFAULT TIME WHEN OPENING
  --------------------------------------------------------- */
  useEffect(() => {
    if (open && !value) {
      const base = minimumBookableMoment(leadMinutes);
      const rounded = roundTo15(base);

      const timeValue = extractTime(rounded);
      onChange(timeValue);
    }
  }, [open, value, onChange, leadMinutes]);

  /* -------------------------------------------------------
     3. CONFIRM HANDLERS
  --------------------------------------------------------- */
  const handleConfirm = (t: TimeValue | null) => {
    onChange(t);
    setOpen(false);
  };

  /* -------------------------------------------------------
     4. FORMATTED DISPLAY VALUE
  --------------------------------------------------------- */
  const formattedValue = value
    ? `${String(value.hours).padStart(2, '0')}:${String(value.minutes).padStart(2, '0')}`
    : 'Select time';

  /* -------------------------------------------------------
     5. RETURN JSX (SSR SAFE)
  --------------------------------------------------------- */
  return (
    <div className={`relative ${className}`}>
      {/* TRIGGER BUTTON */}
      <button
        type='button'
        onClick={() => setOpen(true)}
        className='
          w-full p-3 text-left rounded-lg
          bg-white/5 text-amber-200
          border border-white/10
          hover:bg-white/10 transition
        '
      >
        {formattedValue}
      </button>

      {/* MODALS - Only render after mount to prevent hydration mismatch */}
      {mounted && (
        <>
          {/* DESKTOP MODAL */}
          {!isMobile && (
            <DesktopTimePickerModal
              isOpen={open}
              onClose={() => setOpen(false)}
              onConfirm={handleConfirm}
              value={value}
              date={date}
              interval={interval}
              minTime={minTime}
              maxTime={maxTime}
              leadMinutes={leadMinutes}
            />
          )}

          {/* MOBILE MODAL */}
          {isMobile && (
            <MobileTimePickerModal
              open={open}
              onClose={() => setOpen(false)}
              onConfirm={handleConfirm}
              value={value}
              onChange={onChange}
              date={date}
              interval={interval}
              minTime={minTime}
              maxTime={maxTime}
              leadMinutes={leadMinutes}
            />
          )}
        </>
      )}
    </div>
  );
}
