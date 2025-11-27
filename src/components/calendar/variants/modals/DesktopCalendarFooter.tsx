'use client';

interface DesktopCalendarFooterProps {
  onCancel: () => void;
  onConfirm: () => void;
}

export function DesktopCalendarFooter({ onCancel, onConfirm }: DesktopCalendarFooterProps) {
  return (
    <div className='flex items-center justify-end gap-3 mt-2'>
      <button
        onClick={onCancel}
        className='px-4 py-2 text-sm rounded-md text-white/80 hover:text-white transition'
      >
        Cancel
      </button>

      <button
        onClick={onConfirm}
        className='px-4 py-2 text-sm rounded-md bg-amber-500 text-black font-medium hover:bg-amber-400 transition'
      >
        Confirm
      </button>
    </div>
  );
}
