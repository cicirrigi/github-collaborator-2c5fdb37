'use client';

import { useEffect } from 'react';
import type { TimeValue } from '../core/time-types';
import { TimePicker } from '../TimePicker';
import { MobileTimeModalContainer } from './MobileTimeModalContainer';
import { MobileTimeModalOverlay } from './MobileTimeModalOverlay';

interface MobileTimePickerModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (t: TimeValue | null) => void;
  value: TimeValue | null;
  onChange: (t: TimeValue | null) => void;
  timezone: string;
  interval?: number;
  minTime?: TimeValue | undefined;
  maxTime?: TimeValue | undefined;
  leadMinutes?: number | undefined;
}

/**
 * VANTAGE LANE — Mobile TimePicker Modal (Enterprise)
 *
 * Fullscreen bottom-sheet modal:
 *  - overlay blur
 *  - sticky header
 *  - cancel / done actions
 *  - time grid full height
 *  - lead warning
 *  - body scroll prevention
 *
 * Uses TimePicker + TimeEngine
 */

export function MobileTimePickerModal({
  open,
  onClose,
  onConfirm,
  value,
  onChange,
  timezone,
  interval = 15,
  minTime,
  maxTime,
  leadMinutes,
}: MobileTimePickerModalProps) {
  // Prevent body scroll when modal is open (Enterprise UX)
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <>
      <MobileTimeModalOverlay open={open} onClose={onClose} />

      <MobileTimeModalContainer>
        {/* HEADER PREMIUM */}
        <div
          className='
            sticky top-0 z-50
            flex items-center justify-between
            py-2 mb-3
            bg-[#0B0B0B]
          '
        >
          <button onClick={onClose} className='text-amber-300 text-base font-medium'>
            Cancel
          </button>

          <h2 className='text-white text-lg font-semibold tracking-wide'>Select Time</h2>

          <button onClick={() => onConfirm(value)} className='text-amber-400 font-semibold'>
            Done
          </button>
        </div>

        {/* TIME GRID FULL HEIGHT */}
        <div className='flex-1 overflow-y-auto scroll-smooth pb-4'>
          <TimePicker
            value={value}
            onChange={onChange}
            timezone={timezone}
            interval={interval}
            minTime={minTime}
            maxTime={maxTime}
            leadMinutes={leadMinutes}
          />

          {/* Lead time warning */}
          <p className='text-xs text-white/40 mt-4 text-center'>
            Bookings must be made at least{' '}
            <span className='text-amber-300'>2 hours in advance</span> (UK time)
          </p>
        </div>
      </MobileTimeModalContainer>
    </>
  );
}
