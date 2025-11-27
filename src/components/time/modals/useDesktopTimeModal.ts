'use client';

import { useState } from 'react';
import type { TimeValue } from '../core/time-types';

export function useDesktopTimeModal(initial: TimeValue | null = null) {
  const [isOpen, setIsOpen] = useState(false);

  const [tempTime, setTempTime] = useState<TimeValue | null>(initial);
  const [committedTime, setCommittedTime] = useState<TimeValue | null>(initial);

  return {
    isOpen,
    tempTime,
    committedTime,

    /** Deschide modalul + setează optional valoarea */
    open: (value?: TimeValue | null) => {
      if (value) {
        setTempTime(value);
      }
      setIsOpen(true);
    },

    /** Închide modalul */
    close: () => setIsOpen(false),

    /** Select time live (nu confirmă) */
    select: (time: TimeValue | null) => {
      setTempTime(time);
    },

    /** Confirmă selecția și întoarce valoarea finală */
    confirm: () => {
      setCommittedTime(tempTime);
      setIsOpen(false);
      return tempTime;
    },

    /** Anulează → revine la committedTime */
    cancel: () => {
      setTempTime(committedTime);
      setIsOpen(false);
    },
  };
}
