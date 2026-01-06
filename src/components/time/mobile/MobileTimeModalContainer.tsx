'use client';

import type { ReactNode } from 'react';

interface MobileTimeModalContainerProps {
  visible: boolean;
  children: ReactNode;
}

export function MobileTimeModalContainer({ visible, children }: MobileTimeModalContainerProps) {
  return (
    <div
      className={[
        'fixed inset-x-0 bottom-0 z-50',
        'bg-[#0c0c0c] rounded-t-[28px] shadow-[0_-10px_20px_rgba(0,0,0,0.3)]',
        'transition-transform duration-300 will-change-transform',
        'max-h-[90vh]',
        visible ? 'translate-y-0' : 'translate-y-full',
      ].join(' ')}
    >
      <div className='flex max-h-[90vh] flex-col pt-3 pb-0'>
        <div className='mx-auto mb-4 h-1 w-10 rounded-full bg-white/20' />
        {children}
      </div>
    </div>
  );
}
