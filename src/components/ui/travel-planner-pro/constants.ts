// 🎨 TRAVEL_PLANNER_PRO_THEME – Design tokens only (fără rules, fără logic)

export const TRAVEL_PLANNER_PRO_THEME = {
  // Culori din design system (nu mai hardcodate)
  colors: {
    primary: 'var(--brand-primary)',
    accent: 'var(--brand-accent)',
    secondary: 'var(--brand-secondary)',
    neutral: 'var(--text-secondary)',
    background: 'var(--background-elevated)',
    border: 'var(--border-subtle)',
  },
  // Layout din design tokens
  layout: {
    container: 'relative mx-auto max-w-6xl px-4 py-10 lg:py-14',
    grid: 'grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]',
    cardGrid: 'grid gap-8 lg:grid-cols-2',
  },

  // Container cu styling din design tokens
  container: `
    relative overflow-hidden
    bg-[var(--background-elevated)] backdrop-blur-2xl
    border border-[var(--border-subtle)]
    p-8 rounded-3xl
    transition-all duration-300 ease-out
    [&>*]:relative [&>*]:z-10
  `,
  card: `
    bg-[var(--background-elevated)] border border-[var(--border-subtle)]
    rounded-2xl p-6 backdrop-blur-xl
    shadow-[var(--shadow-elevated)] hover:shadow-[var(--shadow-premium)]
    hover:transform hover:-translate-y-1
    transition-all duration-300 ease-out
  `,
  header: `text-3xl font-semibold tracking-tight text-neutral-100`,
  subtext: `text-neutral-400 text-base mb-8`,
  sectionTitle: `text-lg font-medium text-neutral-200 mb-4`,

  calendar: {
    container: `grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8`,
    header: `flex items-center justify-between mb-4 text-neutral-100 font-medium`,
    grid: `grid grid-cols-7 gap-1 text-center`,
    dayBase: `
      aspect-square w-full flex items-center justify-center
      text-sm font-medium rounded-lg transition-all cursor-pointer
      hover:bg-[var(--background-hover)] text-neutral-300
    `,
    dayToday: `border border-[var(--brand-primary)]/40 text-[var(--brand-primary)]`,
    daySelected: `
      bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-accent)]
      text-black shadow-[0_0_10px_var(--brand-primary)/40]
    `,
    dayInRange: `bg-white/[0.06] text-neutral-200`,
    dayDisabled: `opacity-40 cursor-not-allowed text-neutral-600`,
    dayOtherMonth: `opacity-50 text-neutral-500`,
    weekHeader: `text-sm text-neutral-500 pb-1 font-medium`,
    sidebar: `
      w-full md:w-40 flex flex-col gap-1 overflow-y-auto scrollbar-thin
      scrollbar-track-transparent scrollbar-thumb-white/20
      border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-4
      max-h-60 md:max-h-80
    `,
    slot: `
      text-sm rounded-full px-3 py-2 cursor-pointer
      transition-all text-neutral-300 text-center
      hover:bg-white/[0.05]
    `,
    slotSelected: `
      bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-accent)]
      text-black shadow-md font-medium
    `,
  },

  accent: {
    gold: 'from-[var(--brand-primary)] to-[var(--brand-accent)]',
    gray: 'from-gray-800 to-gray-900',
  },

  // Motion - folosim CSS classes pentru performanță
  motion: {
    // Transition și hover din CSS classes (mai performant decât Framer Motion)
    transition: 'transition-all duration-300 ease-out',
    hover: 'hover:scale-[1.02]',
    tap: 'active:scale-95',
    // Framer Motion variants (din animations.config dacă sunt necesare)
    fadeInUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
    },
    staggerChildren: { animate: { transition: { staggerChildren: 0.1 } } },
  },
} as const;

export type TravelPlannerProTheme = typeof TRAVEL_PLANNER_PRO_THEME;
