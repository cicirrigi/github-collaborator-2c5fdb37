'use client';

import { useEffect, useState } from 'react';
import { TimePicker } from '../TimePicker';
import type { TimeValue } from '../core/time-types';

import { MobileTimeModalContainer } from './MobileTimeModalContainer';
import { MobileTimeModalOverlay } from './MobileTimeModalOverlay';

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (t: TimeValue | null) => void;
  value: TimeValue | null;
  onChange: (t: TimeValue | null) => void;
  date: Date;
  interval?: number | undefined;
  minTime?: TimeValue | undefined;
  maxTime?: TimeValue | undefined;
  leadMinutes?: number | undefined;
}

export function MobileTimePickerModal({
  open,
  onClose,
  onConfirm,
  value,
  onChange, // eslint-disable-line @typescript-eslint/no-unused-vars
  date,
  interval,
  minTime,
  maxTime,
  leadMinutes,
}: Props) {
  const [tempTime, setTempTime] = useState<TimeValue | null>(value);

  // Sync temp with value when modal opens
  useEffect(() => {
    if (open) {
      setTempTime(value);
    }
  }, [open, value]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <>
      <MobileTimeModalOverlay open={open} onClose={onClose} />

      <MobileTimeModalContainer>
        <div className='sticky top-0 z-50 bg-[#0c0c0c] px-4 py-4 flex items-center justify-between border-b border-white/10'>
          <button onClick={onClose} className='text-amber-300'>
            Cancel
          </button>

          <h2 className='text-base font-medium'>Select Time</h2>

          <div className='w-10' />
        </div>

        <div className='flex-1 overflow-y-auto px-4 py-2'>
          <TimePicker
            date={date}
            value={tempTime}
            onChange={setTempTime}
            interval={interval}
            minTime={minTime}
            maxTime={maxTime}
            leadMinutes={leadMinutes}
          />

          <p className='text-xs text-white/40 mt-4 text-center'>
            Bookings must be made at least
            <span className='text-amber-300'> 2 hours </span> in advance (London time).
          </p>
        </div>

        {/* FOOTER */}
        <div className='sticky bottom-0 z-[60] bg-[#0c0c0c] px-4 py-4 border-t border-white/10'>
          <button
            type='button'
            style={{ pointerEvents: 'auto' }}
            className='
              w-full py-3 rounded-xl
              bg-amber-500 text-black font-semibold text-base
              shadow-lg active:scale-95 transition-transform
              touch-manipulation
            '
            onClick={() => onConfirm(tempTime)}
            onTouchStart={() => {}}
          >
            Confirm
          </button>
        </div>
      </MobileTimeModalContainer>
    </>
  );
}
