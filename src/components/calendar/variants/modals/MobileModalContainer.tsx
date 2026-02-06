'use client';

import { ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface MobileModalContainerProps {
  visible: boolean;
  children: ReactNode;
}

export function MobileModalContainer({ visible, children }: MobileModalContainerProps) {
  useEffect(() => {
    if (!visible) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [visible]);

  if (!visible) return null; // ✅ important: nu ține "papirusul" în DOM

  // SSR safety check
  if (typeof document === 'undefined') {
    return (
      <div
        className={[
          'fixed inset-0 z-50',
          'bg-[#0c0c0c] text-white',
          'flex flex-col min-h-0', // ✅ min-h-0 pentru flex + overflow corect
        ].join(' ')}
      >
        {children}
      </div>
    );
  }

  return createPortal(
    <div
      className={[
        'fixed inset-0 z-50',
        'bg-[#0c0c0c] text-white',
        'flex flex-col min-h-0', // ✅ min-h-0 pentru flex + overflow corect
      ].join(' ')}
    >
      {children}
    </div>,
    document.body
  );
}
