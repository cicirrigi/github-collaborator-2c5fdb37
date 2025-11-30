'use client';

import { useEffect, useRef, useState } from 'react';
import { DEFAULT_LEAD_TIME_MINUTES } from './core/time-constants';

import { extractTime, minimumBookableMoment, roundToInterval } from './core/time-utils';

import type { TimeValue } from './core/time-types';
import { DesktopTimePickerModal } from './desktop/DesktopTimePickerModal';
import { MobileTimePickerModal } from './mobile/MobileTimePickerModal';

export function StatefulTimePicker({
  date,
  value,
  onChange,
  interval = 15,
  minTime,
  maxTime,
  leadMinutes = DEFAULT_LEAD_TIME_MINUTES,
}: {
  date: Date;
  value: TimeValue | null;
  onChange: (t: TimeValue | null) => void;
  interval?: number;
  minTime?: TimeValue;
  maxTime?: TimeValue;
  leadMinutes?: number;
}) {
  const [isMobile, setIsMobile] = useState(false);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const defaultSet = useRef(false);

  useEffect(() => {
    setMounted(true);
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (!defaultSet.current && !value) {
      const base = minimumBookableMoment(leadMinutes);
      const rounded = roundToInterval(base, interval);
      onChange(extractTime(rounded));
      defaultSet.current = true;
    }
  }, [value, leadMinutes, interval, onChange]);

  const formatted =
    value && value.hours !== undefined
      ? `${String(value.hours).padStart(2, '0')}:${String(value.minutes).padStart(2, '0')}`
      : 'Select time';
  return (
    <div className='relative'>
      <button
        type='button'
        onClick={() => setOpen(true)}
        className='
          w-full p-3 text-left rounded-lg
          bg-white/5 text-amber-200 border border-white/10
          hover:bg-white/10 transition
        '
      >
        {formatted}
      </button>

      {mounted && (
        <>
          {!isMobile && (
            <DesktopTimePickerModal
              isOpen={open}
              onClose={() => setOpen(false)}
              onConfirm={onChange}
              value={value}
              date={date}
              interval={interval}
              minTime={minTime}
              maxTime={maxTime}
              leadMinutes={leadMinutes}
            />
          )}

          {isMobile && (
            <MobileTimePickerModal
              open={open}
              onClose={() => setOpen(false)}
              onConfirm={onChange}
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
