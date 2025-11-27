'use client';

import { ReactNode, useEffect } from 'react';

interface MobileModalContainerProps {
  visible: boolean;
  children: ReactNode;
}

export function MobileModalContainer({ visible, children }: MobileModalContainerProps) {
  // Lock background scroll
  useEffect(() => {
    if (visible) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [visible]);

  return (
    <div
      className={`
        fixed inset-0 z-50
        flex flex-col
        bg-[#0c0c0c]
        text-white
        transition-transform duration-300
        ${visible ? 'translate-y-0' : 'translate-y-full'}
      `}
    >
      {children}
    </div>
  );
}
