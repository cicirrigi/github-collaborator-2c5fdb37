'use client';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function MobileTimeModalOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;

  return (
    <div
      className='
        fixed inset-0 z-40
        bg-black/60 backdrop-blur-sm
      '
      onClick={onClose}
    />
  );
}
