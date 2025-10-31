import { designTokens } from '@/config/theme.config';

export const newsletterTokens = {
  container: {
    bg: 'bg-[radial-gradient(circle_at_center,var(--brand-primary)/10,transparent_80%)]',
    backgroundColor: 'bg-white dark:bg-black',
    paddingY: 'py-28 sm:py-32',
  },
  heading: {
    color: designTokens.colors.text.primary,
    size: 'text-3xl md:text-4xl',
    weight: designTokens.typography.fontWeight.semibold,
  },
  text: {
    color: designTokens.colors.text.secondary,
    size: 'text-base',
  },
  input: {
    base: `
      w-full rounded-xl px-4 py-3 text-sm transition-all
      bg-white/80 dark:bg-white/10 
      border border-neutral-300 dark:border-white/10 
      text-neutral-900 dark:text-white 
      placeholder:text-neutral-500 dark:placeholder:text-neutral-400
      focus:ring-2 focus:ring-[var(--brand-primary)]/40 outline-none
      focus-visible:shadow-[0_0_0_3px_var(--brand-primary)/20]
    `,
    error: 'ring-red-500 dark:ring-red-400/60 border-red-500 dark:border-red-400/60',
  },
  button: {
    base: `
      rounded-xl px-6 py-3 text-sm font-semibold transition-all transform-gpu
      bg-[var(--brand-primary)] text-black
      hover:bg-[var(--brand-primary)]/90 active:scale-[0.98]
      focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]/40
      focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-black
      shadow-[0_0_30px_-10px_var(--brand-primary)/40]
    `,
  },
  privacy: {
    color: designTokens.colors.text.muted,
    size: 'text-xs',
  },
  messages: {
    success: 'text-green-500 dark:text-green-400',
    error: 'text-red-500 dark:text-red-400',
  },
  loading: {
    spinner: 'inline-block w-4 h-4 border-2 border-black/30 border-t-black rounded-full mr-2',
  },
  animations: {
    goldSweep: {
      duration: 2000, // 2 seconds for full cycle
      amplitude: 50, // ±50% movement range
      ease: [0.25, 0.46, 0.45, 0.94] as const, // Premium cubic bezier
    },
    stagger: {
      heading: 0,
      subtitle: 0.2,
      form: 0.4,
      privacy: 0.6,
    },
  },
} as const;
