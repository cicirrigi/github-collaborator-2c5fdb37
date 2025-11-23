export const pillInputTokens = {
  wrapper: 'relative w-full',

  container: [
    'relative w-full p-[2px]',
    'rounded-full',
    // deep glass dark
    'bg-[rgba(255,255,255,0.08)]',
    'backdrop-blur-2xl',
    'border border-white/10',
    // outer cinematic shadow
    'shadow-[0_8px_28px_rgba(0,0,0,0.45)]',
    'transition-all duration-300',
  ].join(' '),

  containerFocused: [
    'bg-[rgba(203,178,106,0.25)]',
    'border-[#CBB26A]/40',
    'shadow-[0_0_35px_rgba(203,178,106,0.55)]',
  ].join(' '),

  innerGlass: [
    'absolute inset-0 rounded-full',
    // inner bevel
    'shadow-[inset_0_4px_8px_rgba(255,255,255,0.25),inset_0_-6px_12px_rgba(0,0,0,0.45)]',
    'pointer-events-none',
  ].join(' '),

  inputBox: [
    'relative w-full rounded-full',
    'bg-black/60',
    'text-white/90 font-medium tracking-tight',
    'px-16 py-4',
    'placeholder-white/35',
    'outline-none',
    'text-base',
    'shadow-[inset_0_0_10px_rgba(0,0,0,0.45)]',
    'transition-all duration-300',
  ].join(' '),

  iconWrap: [
    'absolute left-4 top-1/2 -translate-y-1/2 h-9 w-9',
    'rounded-full flex items-center justify-center',
    // glass icon container
    'bg-white/5 backdrop-blur-md',
    'border border-white/10',
    'shadow-[0_0_12px_rgba(0,0,0,0.4)]',
  ].join(' '),

  icon: 'text-white/70 h-[18px] w-[18px]',
} as const;
