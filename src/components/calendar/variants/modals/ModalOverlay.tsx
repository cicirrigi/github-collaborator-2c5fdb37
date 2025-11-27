'use client';

import { AnimatePresence, motion } from 'framer-motion';

interface ModalOverlayProps {
  isOpen: boolean;
  onClose?: () => void;
}

export function ModalOverlay({ isOpen, onClose }: ModalOverlayProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className='fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]'
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.25 } }}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
        />
      )}
    </AnimatePresence>
  );
}
