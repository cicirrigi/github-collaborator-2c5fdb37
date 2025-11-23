export const datePillTokens = {
  wrapper: 'relative inline-block',

  container: [
    'relative inline-block p-[2px]',
    'rounded-full',
    'bg-[rgba(255,255,255,0.08)]',
    'border border-white/10',
    'shadow-[0_8px_25px_rgba(0,0,0,0.45)]',
    'backdrop-blur-2xl',
    'transition-all duration-300',
    'cursor-pointer select-none',
  ].join(' '),

  focused: [
    'bg-[rgba(203,178,106,0.2)]',
    'border-[#CBB26A]/40',
    'shadow-[0_0_35px_rgba(203,178,106,0.45)]',
  ].join(' '),

  innerGlass: [
    'absolute inset-0 rounded-full',
    'shadow-[inset_0_4px_8px_rgba(255,255,255,0.15),inset_0_-8px_12px_rgba(0,0,0,0.6)]',
    'pointer-events-none',
  ].join(' '),

  content: [
    'flex items-center gap-3',
    'px-6 py-4',
    'rounded-full',
    'bg-black/60',
    'text-white/80 font-medium',
    'text-base',
  ].join(' '),

  iconWrap: [
    'h-9 w-9 rounded-full',
    'flex items-center justify-center',
    'bg-white/5 backdrop-blur-md',
    'border border-white/10',
  ].join(' '),

  icon: 'text-white/70 h-[18px] w-[18px]',
};
