export const modalTokens = {
  overlay: [
    'fixed inset-0',
    'bg-black/60 backdrop-blur-sm',
    'flex items-end justify-center',
    'z-[999]',
    'transition-all',
  ].join(' '),

  sheet: [
    'bg-[rgba(15,15,15,0.85)]',
    'backdrop-blur-3xl',
    'w-full max-w-lg',
    'rounded-t-3xl',
    'shadow-[0_-20px_60px_rgba(0,0,0,0.7)]',
    'p-6',
    'h-[60vh]',
    'overflow-hidden',
    'transition-all duration-300',
  ].join(' '),

  dragHandle: ['w-10 h-1.5', 'rounded-full', 'mx-auto mb-4', 'bg-white/20'].join(' '),
} as const;
