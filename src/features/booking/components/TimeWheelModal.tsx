'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { TimeWheel } from './TimeWheel';

interface TimeWheelModalProps {
  isOpen: boolean;
  initialHour: string;
  initialMinute: string;
  onClose: () => void;
  onConfirm: (hour: string, minute: string) => void;
}

export function TimeWheelModal({
  isOpen,
  initialHour,
  initialMinute,
  onClose,
  onConfirm,
}: TimeWheelModalProps) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className='fixed inset-0 z-[999] flex items-end justify-center bg-black/60 backdrop-blur-sm'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className='absolute inset-0' onClick={onClose} />

          <motion.div
            className='
              relative w-full max-w-2xl
              bg-[rgba(15,15,15,0.85)]
              backdrop-blur-xl
              rounded-t-3xl
              shadow-[0_-10px_30px_rgba(0,0,0,0.5)]
              p-6
            '
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 24 }}
          >
            <div className='w-10 h-1.5 bg-white/20 rounded-full mx-auto mb-4' />

            <TimeWheel
              initialHour={initialHour}
              initialMinute={initialMinute}
              onConfirm={onConfirm}
            />

            <div className='mt-6 flex justify-center'>
              <button
                onClick={onClose}
                className='px-6 py-3 rounded-full bg-white/10 border border-white/20 text-white text-sm font-medium hover:bg-white/20 hover:border-white/30 transition-all duration-200'
              >
                Done
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
