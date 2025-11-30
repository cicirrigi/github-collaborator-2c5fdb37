'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

const variants = {
  initial: { y: '100%' },
  animate: { y: 0 },
  exit: { y: '100%' },
};

export function MobileTimeModalContainer({ children }: { children: ReactNode }) {
  return (
    <motion.div
      variants={variants}
      initial='initial'
      animate='animate'
      exit='exit'
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      className='
        fixed inset-x-0 bottom-0 top-0 z-50 bg-[#0c0c0c]
        rounded-t-[28px] flex flex-col pt-3 pb-0
        shadow-[0_-10px_40px_rgba(0,0,0,0.45)]
      '
    >
      {/* Handle bar */}
      <div className='mx-auto mb-4 h-1 w-10 rounded-full bg-white/20' />

      {children}
    </motion.div>
  );
}
