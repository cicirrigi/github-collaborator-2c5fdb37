'use client';

export function MobileTimeModalOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;

  return (
    <button
      type='button'
      aria-label='Close'
      onClick={onClose}
      className='fixed inset-0 z-40 bg-black/60 backdrop-blur-sm'
    />
  );
}
