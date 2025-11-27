'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ReactNode, useEffect } from 'react';

interface ModalContainerProps {
  isOpen: boolean;
  children: ReactNode;
  onClose?: () => void;
}

export function ModalContainer({ isOpen, children, onClose }: ModalContainerProps) {
  // ESC key to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className='fixed inset-0 z-[100] flex items-center justify-center pointer-events-none'
          initial={false}
        >
          <motion.div
            className='
              pointer-events-auto
              bg-[#0b0b0b]
              border border-white/10
              rounded-2xl
              shadow-2xl
              p-6
              w-[420px]
              max-w-[92vw]
            '
            initial={{ opacity: 0, y: 30 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
            }}
            exit={{
              opacity: 0,
              y: 40,
              transition: { duration: 0.2, ease: [0.4, 0, 1, 1] },
            }}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
