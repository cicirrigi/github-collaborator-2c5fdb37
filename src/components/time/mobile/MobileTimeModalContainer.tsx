'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface MobileTimeModalContainerProps {
  children: ReactNode;
}

const modalVariants = {
  initial: { y: '100%' },
  animate: { y: 0 },
  exit: { y: '100%' },
};

export function MobileTimeModalContainer({ children }: MobileTimeModalContainerProps) {
  return (
    <motion.div
      variants={modalVariants}
      initial='initial'
      animate='animate'
      exit='exit'
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      className='
        fixed inset-x-0 bottom-0 top-0
        z-50
        bg-[#0B0B0B]
        rounded-t-[28px]
        flex flex-col
        pt-3 pb-6
        shadow-[0_-10px_40px_rgba(0,0,0,0.45)]
      '
    >
      {/* Handle bar */}
      <div className='mx-auto mb-4 h-1 w-10 rounded-full bg-white/20' />

      {children}
    </motion.div>
  );
}
