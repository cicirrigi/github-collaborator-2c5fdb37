'use client';

export function MobileTimeModalOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;

  return <div onClick={onClose} className='fixed inset-0 z-40 bg-black/60 backdrop-blur-sm' />;
}
