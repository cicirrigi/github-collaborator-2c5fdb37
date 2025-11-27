'use client';

import { ModalContainer } from '@/components/calendar/variants/modals/ModalContainer';
import { ModalOverlay } from '@/components/calendar/variants/modals/ModalOverlay';
import type { TimeValue } from '../core/time-types';
import { TimePicker } from '../TimePicker';
import { DesktopTimeFooter } from './DesktopTimeFooter';
import { useDesktopTimeModal } from './useDesktopTimeModal';

interface DesktopTimePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (t: TimeValue | null) => void;
  onConfirm: () => void;
  value: TimeValue | null;
  timezone: string;
  interval?: number;
  minTime?: TimeValue | undefined;
  maxTime?: TimeValue | undefined;
  leadMinutes?: number | undefined;
  label?: string;
}

export function DesktopTimePickerModal({
  isOpen,
  onClose,
  onSelect,
  onConfirm,
  value,
  timezone,
  interval = 15,
  minTime,
  maxTime,
  leadMinutes,
  label = 'Select Time',
}: DesktopTimePickerModalProps) {
  const modal = useDesktopTimeModal(value);

  return (
    <>
      <ModalOverlay isOpen={isOpen} onClose={onClose} />

      <ModalContainer isOpen={isOpen} onClose={onClose}>
        <div className='flex flex-col gap-4'>
          {/* HEADER */}
          <div className='flex items-center justify-between'>
            <h2 className='text-white text-lg font-medium tracking-wide'>{label}</h2>

            <button
              onClick={() => {
                modal.cancel();
                onClose();
              }}
              className='text-amber-300 hover:text-white transition-colors'
            >
              ✕
            </button>
          </div>

          {/* TIME PICKER — CONTROLLED BY TEMP TIME */}
          <TimePicker
            value={modal.tempTime}
            onChange={t => modal.select(t)}
            timezone={timezone}
            interval={interval}
            minTime={minTime}
            maxTime={maxTime}
            leadMinutes={leadMinutes}
            className='mt-2'
          />

          {/* Lead time warning */}
          <p className='text-xs text-white/40 mt-3 text-center'>
            Bookings must be made at least{' '}
            <span className='text-amber-300'>2 hours in advance</span> (UK time)
          </p>

          {/* FOOTER */}
          <DesktopTimeFooter
            onCancel={() => {
              modal.cancel();
              onClose();
            }}
            onConfirm={() => {
              const selectedTime = modal.confirm();
              onSelect(selectedTime);
              onConfirm();
            }}
          />
        </div>
      </ModalContainer>
    </>
  );
}
