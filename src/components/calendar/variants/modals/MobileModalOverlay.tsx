'use client';

interface MobileModalOverlayProps {
  visible: boolean;
  onClose: () => void;
}

export function MobileModalOverlay({ visible, onClose }: MobileModalOverlayProps) {
  if (!visible) return null;

  return (
    <div
      onClick={onClose}
      className='
        fixed inset-0 z-40
        bg-black/60 backdrop-blur-sm
        transition-opacity
      '
    />
  );
}
