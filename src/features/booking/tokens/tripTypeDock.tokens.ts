export const tripTypeDockTokens = {
  container: 'flex justify-center py-4',

  dock: [
    'relative flex items-center gap-1',
    'px-5 py-4',
    'rounded-full',
    'backdrop-blur-2xl',
    // deep glass dark (same as pill inputs)
    'bg-[rgba(255,255,255,0.08)]',
    'border border-white/10',
    // outer cinematic shadow
    'shadow-[0_8px_28px_rgba(0,0,0,0.45)]',
    'max-w-xl w-full',
  ].join(' '),

  innerGlass: [
    'absolute inset-0 rounded-full',
    // inner bevel
    'shadow-[inset_0_4px_8px_rgba(255,255,255,0.25),inset_0_-6px_12px_rgba(0,0,0,0.45)]',
    'pointer-events-none',
  ].join(' '),

  item: {
    base: [
      'relative flex-1',
      'text-center cursor-pointer select-none',
      'text-white/70 text-xs sm:text-sm font-medium',
      'px-4 py-2',
      'rounded-full',
      'transition-all duration-300 overflow-hidden',
    ].join(' '),
    hover: 'hover:text-white hover:bg-white/10',
  },

  // SUPER PREMIUM ACTIVE LAYER
  active: [
    'absolute inset-0 rounded-full overflow-hidden',
    // aur lichid metalizat
    'bg-gradient-to-br from-[#F8E9C8] via-[#CBB26A] to-[#b79b5a]',
    'shadow-[0_0_35px_rgba(203,178,106,0.55)]',
    'border border-white/30',
  ].join(' '),

  particles: [
    'absolute inset-0 rounded-full pointer-events-none',
    'bg-[radial-gradient(circle_at_center,_rgba(255,240,200,0.25)_1px,_transparent_1px)]',
    'bg-[size:4px_4px]',
    'opacity-[0.15]',
  ].join(' '),
} as const;
