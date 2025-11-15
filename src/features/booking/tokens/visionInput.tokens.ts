export const visionInputTokens = {
  wrapper: 'relative w-full mb-6',

  inputBox: [
    'w-full px-4 pb-2 pt-6',
    'bg-white/[0.02] backdrop-blur-xl',
    'border-b border-white/15',
    'text-white/90',
    'focus:border-[#CBB26A]',
    'transition-all duration-300',
    'outline-none',
    'rounded-t-xl',
  ].join(' '),

  label: [
    'absolute left-4 pointer-events-none',
    'text-white/40 text-sm',
    'transition-all duration-300',
  ].join(' '),

  labelFloating: 'top-1 text-xs text-[#CBB26A]',

  labelResting: 'top-4',

  icon: 'absolute left-[-28px] top-[18px] text-white/30 h-4 w-4',
};
