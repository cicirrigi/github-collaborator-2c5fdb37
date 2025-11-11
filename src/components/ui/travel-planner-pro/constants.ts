/**
 * 🎨 TRAVEL_PLANNER_PRO_THEME – premium version
 * 100% derivat din TRAVEL_THEME (respectă aurul, transparențele și tonurile neutre)
 */
export const TRAVEL_PLANNER_PRO_THEME = {
  colors: {
    gold: 'var(--brand-primary)',
    lightGold: 'var(--brand-accent)',
    darkGold: 'var(--brand-secondary)',
    neutral: 'var(--text-secondary)',
    light: 'var(--background-light)',
    dark: 'var(--background-dark)',
  },
  container: `
    relative rounded-3xl p-8 backdrop-blur-2xl overflow-hidden
    border border-white/20 shadow-[0_0_60px_-10px_var(--brand-primary)/30]
    before:absolute before:inset-0 before:z-0 before:pointer-events-none
    before:bg-[radial-gradient(circle_at_20%_20%,var(--brand-primary)/40_0%,transparent_50%),radial-gradient(circle_at_80%_80%,var(--brand-secondary)/30_0%,transparent_50%),radial-gradient(circle_at_60%_40%,var(--brand-accent)/20_0%,transparent_60%),linear-gradient(135deg,var(--background-dark)_0%,var(--background-elevated)_25%,var(--background-subtle)_50%,var(--background-dark)_100%)]
    before:rounded-3xl before:animate-pulse before:[animation-duration:5s]
    after:absolute after:inset-0 after:z-0 after:pointer-events-none 
    after:bg-[radial-gradient(ellipse_400px_300px_at_30%_70%,var(--brand-primary)/15,transparent),radial-gradient(ellipse_300px_400px_at_70%_30%,var(--text-muted)/20,transparent)]
    after:rounded-3xl after:opacity-60 after:animate-pulse after:[animation-duration:8s] after:[animation-delay:3s]
    [&>*]:relative [&>*]:z-10
  `,
  card: `
    bg-white/[0.15] border border-white/[0.2]
    rounded-2xl p-6 backdrop-blur-xl
    shadow-[0_16px_48px_rgba(0,0,0,0.4),0_4px_12px_rgba(0,0,0,0.3),inset_0_0_20px_rgba(255,255,255,0.12)]
    hover:shadow-[0_20px_60px_rgba(0,0,0,0.5),0_8px_20px_rgba(0,0,0,0.4),inset_0_0_30px_rgba(255,255,255,0.15)]
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
      hover:bg-white/[0.05] text-neutral-300
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

  motion: {
    transition: 'transition-all duration-300 ease-in-out',
    hover: 'hover:scale-105',
    tap: 'active:scale-95',
  },
} as const;

export type TravelPlannerProTheme = typeof TRAVEL_PLANNER_PRO_THEME;
