'use client';

import { ReactNode, useEffect } from 'react';

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

  return (
    <div
      className={[
        'fixed inset-x-0 bottom-0 z-50',
        'h-[100dvh]', // ✅ fix pentru mobile viewport
        'bg-[#0c0c0c] text-white',
        'flex flex-col min-h-0', // ✅ min-h-0 pentru flex + overflow corect
      ].join(' ')}
    >
      {children}
    </div>
  );
}
