export const tripTypeTokens = {
  container: 'flex flex-wrap gap-3 sm:gap-4',

  button: {
    base: [
      'relative group',
      'px-7 py-4 max-sm:px-5 max-sm:py-3',
      'rounded-2xl',
      'text-sm max-sm:text-xs font-medium',
      'transition-all duration-300',
      'cursor-pointer select-none',

      // ✨ GLASSMORPHISM REAL
      'backdrop-blur-xl',
      'bg-white/5',
      'border border-white/10',
      'shadow-[0_6px_20px_rgba(0,0,0,0.25)]',

      // layout
      'flex items-center justify-center overflow-hidden',
    ].join(' '),

    hover: [
      'group-hover:bg-white/[0.08]',
      'group-hover:border-white/20',
      'group-hover:shadow-[0_8px_25px_rgba(0,0,0,0.35)]',
      'group-hover:text-white',
    ].join(' '),

    selected: [
      // aur lichid
      'border-[#CBB26A]/80 bg-black/30',
      'text-white',
      'shadow-[0_0_25px_rgba(203,178,106,0.4)]',

      // inner-border aurie
      'before:absolute before:inset-0 before:rounded-2xl before:border before:border-[#CBB26A]/40 before:pointer-events-none',

      // gloss aurie în partea de sus
      'after:absolute after:inset-x-0 after:top-0 after:h-[40%] after:bg-gradient-to-b after:from-[#CBB26A]/10 after:to-transparent after:rounded-2xl after:pointer-events-none',
    ].join(' '),
  },

  label: 'relative z-20',
} as const;
